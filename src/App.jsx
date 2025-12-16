import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsPage from './pages/ProductsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminCategoryPage from './pages/AdminCategoryPage'
import AdminProductPage from './pages/AdminProductPage'
import './App.css'

function App () {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange)
    
    // Check pathname periodically (for programmatic navigation)
    const interval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname)
      }
    }, 100)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      clearInterval(interval)
    }
  }, [currentPath])

  // Check if we're on admin pages
  const isAdminDashboard = currentPath === '/admin/dashboard'
  const isAdminCategory = currentPath === '/admin/category'
  const isAdminProduct = currentPath === '/admin/products'

  if (isAdminDashboard) {
    return <AdminDashboardPage />
  }

  if (isAdminCategory) {
    return <AdminCategoryPage />
  }

  if (isAdminProduct) {
    return <AdminProductPage />
  }

  // Regular user pages
  return (
    <>
      <Navbar />
      <Hero />
      <ProductsPage />
    </>
  )
}

export default App
