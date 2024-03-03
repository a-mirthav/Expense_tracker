import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useFormik } from 'formik'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  
  
  return (
    <div className='bg-gray-300 h-screen'>
      <div className='flex  justify-center'>
        <h1 className='text-black font-bold '>This is an expense tracker website</h1>
        </div>
        <div className='flex  justify-center'>
        <p>This will help you to manage your expenses along with your income</p> 
        </div>
       
      
  
      
    
</div>
  )
}
