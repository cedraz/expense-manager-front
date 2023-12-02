'use client'
import * as React from 'react'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// CSS
import './globals.css'

// Hooks
import { usePathname } from 'next/navigation'
import AuthProvider from '@/hooks/auth'

// Components
import Navbar from '@/components/navbar/navbar'

// Material UI
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body className="bg-white text-black">
        <ThemeRegistry>
          <AuthProvider>
            <ToastContainer />
            {pathname !== '/' && pathname !== '/login' && pathname !== '/register' && <Navbar />}
            {children}
          </AuthProvider>
          
        </ThemeRegistry>
      </body>
    </html>
  )
}