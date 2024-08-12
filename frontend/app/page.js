'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">Welcome to AI ChatBot</h2>
          <p className="mt-2 text-sm text-gray-600">Your intelligent conversation companion</p>
        </div>
        <div className="mt-8 space-y-4">
          <Link href="/register" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            Get Started
          </Link>
          <Link href="/login" className="w-full flex justify-center py-3 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}