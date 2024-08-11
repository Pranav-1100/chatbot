'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Conversations() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Conversations</h1>
      <p>This page will be customized soon to display conversations.</p>
    </div>
  );
}