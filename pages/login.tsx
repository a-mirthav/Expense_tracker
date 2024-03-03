import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useFormik } from 'formik'
import { useRouter } from 'next/router';
import * as Yup from'yup'
import { useAuth } from '@/context/AuthContext';
import { getAuth } from "firebase/auth";
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema=Yup.object({
    email:Yup.string().required('Email Required!'),
    password:Yup.string().required('Password Required!')
})

function Login() {
  
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');
    const { user} = useAuth();

    const formik=useFormik({
        initialValues:{
            email: '',
            password: ''
        },
        onSubmit: async (values) => {
          try {
            const auth = getAuth(); 
            const userCredential = await signInWithEmailAndPassword (auth,values.email, values.password);
           // router.push('/about');
            console.log('User signed up successfully:', userCredential.user.email);
           // setSuccessMessage('User logged in successfully!');
            toast.success('Login Successful!')
            // router.push('/about');
             // Handle redirecting or displaying success message upon successful signup
             setTimeout(() => {
                 setSuccessMessage('');
                 router.push('/dashboard');
               }, 2000);
          } catch (error) {
            console.error('Error signing up:', (error as Error).message);
           // setSuccessMessage('Invalid login credentials!');
            toast.warning('Login Failed!')
            
          }
           
           // console.log('Form data',values)
        },
        validationSchema
    })


  return (

    
    <div className='flex items-center justify-center h-screen bg-gray-300'>
       <div className='flex'>

       <Image
      src="/expense_image.jpg" width={600}
      height={600}
      
      alt="Picture of the author" className='mr-20'
    />
    </div>
        <form className='bg-white p-10 rounded shadow'onSubmit={formik.handleSubmit}>
            <h1 className='text-2xl font-semibold mb-6'>Login Form</h1>

            <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-600' >Email</label>
            <input type='email' 
                    id='email'
                     name='email' 
                     placeholder='Enter your email' className='mt-1 p-2 border rounded-md' 
                     onChange={formik.handleChange} 
                     onBlur={formik.handleBlur}
                     value={formik.values.email}/>
            {formik.touched.email&&formik.errors.email?(<div className='text-red-500'>{formik.errors.email}</div>):null}
            </div>

            

            <div className='mb-4'>
            <label htmlFor='password'className='block text-gray-600'>Password</label>
            <input type='password' 
            id='password' 
            name='password' 
            placeholder='Enter password' className='mt-1 p-2  border rounded-md'
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur}
            value={formik.values.password}/>
            {formik.touched.password&&formik.errors.password?(<div className='text-red-500'>{formik.errors.password}</div>):null}
            </div>

           <div>
            <button type='submit' className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Login</button>
           
            
            
            </div>
            <div>
            <header className='bg-white'>
        <div className='flex items-center p-4'>
          <h4 className='mr-2'>Create new account?</h4>
          <Link href="/register" className='text-blue-600 hover:text-blue-900'>Sign up</Link>
        </div>
      </header>
            </div>
        </form>
        
    </div>
  )
}

export default Login