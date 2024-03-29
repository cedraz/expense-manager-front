'use client'
import * as React from 'react'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// CSS
import './globals.css'
import { Montserrat } from 'next/font/google'

// Hooks
import { usePathname } from 'next/navigation'
import AuthProvider from '@/hooks/auth'

// Components
import Navbar from '@/components/navbar/navbar'

// Material UI
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

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
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              limit={1}/>
            {pathname !== '/' && pathname !== '/login' && pathname !== '/register' &&  pathname !== '/verify-email' &&  pathname !== '/forgot-password' && pathname !== '/verify-code' && <Navbar />}
            <div className={montserrat.className}>
              {children}
            </div>
          </AuthProvider>
          
        </ThemeRegistry>
      </body>
    </html>
  )
}