import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth() // Assuming a 'loading' state to check if user authentication is loading
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login') // Redirect to login if user is not authenticated and authentication is not loading
    }
  }, [router, user])

  

  return <>{user ? children : null}</> // Render children only if the user is authenticated
}

export default ProtectedRoute
