'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente a la página de login
    router.push('/login');
  }, [router]);

  return null;  // No mostrar nada mientras redirige
}
