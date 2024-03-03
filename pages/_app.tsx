import { AuthContextProvider } from '@/context/AuthContext'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import ProtectedRoute from './ProtectedRoute'
import { ToastContainer, toast } from 'react-toastify';
import Footer from './components/Footer'
import Header from './components/Header'
//const privateRoutes = ['/' ]/* Add other private routes here */
const noAuthRequired=['/','/login','/register']
export default function App({ Component, pageProps }: AppProps) {
  
const router=useRouter()
  return (
    <AuthContextProvider>
      <Header/>
       <ToastContainer />
     {noAuthRequired.includes(router.pathname)?(
      <Component {...pageProps} />
     ):(
      <ProtectedRoute>
         <Component {...pageProps} />
      </ProtectedRoute>
     )}
       <Footer/>
    </AuthContextProvider>
  )
}
