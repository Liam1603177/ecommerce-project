"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { getProducts, addProduct, deleteProduct, editProduct } from "@/firebase/productService";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const newProduct = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      imageUrl: formData.imageUrl,
    };

    if (editMode) {
      await editProduct(productToEdit.id, newProduct);
      setEditMode(false);
      setProductToEdit(null);
    } else {
      await addProduct(newProduct);
    }

    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      imageUrl: "",
    });

    const products = await getProducts();
    setProducts(products);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    const products = await getProducts();
    setProducts(products);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
    });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {user.email}</h1>
      <p className="text-lg mb-4">Aquí puedes gestionar tus productos.</p>

      {/* Formulario para agregar o editar productos */}
      <form onSubmit={handleAddProduct} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="p-2 w-full border rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="p-2 w-full border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleInputChange}
          required
          className="p-2 w-full border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleInputChange}
          required
          className="p-2 w-full border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="p-2 w-full border rounded"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="URL de imagen"
          value={formData.imageUrl}
          onChange={handleInputChange}
          required
          className="p-2 w-full border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          {editMode ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>

      {/* Lista de productos */}
      <div className="space-y-4 ">
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-black p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold ">{product.name}</h2>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Categoría: {product.category}</p>
              <img src={product.imageUrl} alt={product.name} className="mt-4 w-32 h-32 object-cover" />
              <button onClick={() => handleEditProduct(product)} className="bg-yellow-500 text-white p-2 mt-2 rounded hover:bg-yellow-600">
                Editar
              </button>
              <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white p-2 mt-2 ml-2 rounded hover:bg-red-600">
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
