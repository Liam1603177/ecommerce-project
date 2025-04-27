// src/firebase/productService.js
import { db } from "./config";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// Obtener productos de Firestore
export const getProducts = async () => {
  const productsCol = collection(db, "products");
  const productSnapshot = await getDocs(productsCol);
  const productsList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return productsList;
};

// Agregar un producto a Firestore
export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    console.log("Producto agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al agregar el producto: ", e);
  }
};

// Eliminar un producto de Firestore
export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    console.log("Producto eliminado con ID: ", id);
  } catch (e) {
    console.error("Error al eliminar el producto: ", e);
  }

};

// Editar un producto en Firestore
export const editProduct = async (id, updatedProduct) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, updatedProduct);
      console.log("Producto actualizado con ID: ", id);
    } catch (e) {
      console.error("Error al actualizar el producto: ", e);
    }
  };
  
