import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import createUserWithEmailAndPassword from Firebase auth
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {db} from '../config/firebase'
import {collection,addDoc,setDoc,doc} from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'

const validationSchema = Yup.object({
  name: Yup.string().required('Name Required!'),
  email: Yup.string().email('Invalid format').required('Email Required!'),
  password: Yup.string().required('Password Required!').min(6,'password atleast 6 characters'),
});


function Register() {
    const router = useRouter();

    const [successMessage, setSuccessMessage] = useState('');

  const { user,signup } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const auth = getAuth(); 
        const userCredential = await createUserWithEmailAndPassword(auth,values.email, values.password);
        console.log('User signed up successfully:', userCredential.user.email);
        toast.success('Registered Successfully!')
        //setSuccessMessage('User registered successfully!');
        
       // const added:boolean=await addDataToFireStore(name,email,password);
       // router.push('/about');
        // Handle redirecting or displaying success message upon successful signup
        const userId = userCredential.user.uid;

        // Set user data in Firestore using setDoc
        const userDocRef = doc(db, 'users', userId);
        const userData = {
          name: values.name,
          email: values.email,
          password:values.password
          // Add other user-related data as needed
        };

        await setDoc(userDocRef, userData);
        setTimeout(() => {
            setSuccessMessage('');
            router.push('/dashboard');
          }, 2000);
      } catch (error) {
        console.error('Error signing up:', (error as Error).message);
       // setSuccessMessage('User registered already!');
        toast.warning('User already exists!')
        // Handle signup error, display error message, etc.
      }
      
    },
    validationSchema,
  });

  return (
    <div className='flex items-center justify-center h-screen bg-gray-300'>
      <div className='flex'>

<Image
src="/expense_image.jpg" width={650}
height={650}

alt="Picture of the author" className='mr-20'
/>
</div>
        <form className='bg-white p-10 rounded shadow'onSubmit={formik.handleSubmit}>
            <h1 className='text-2xl font-semibold mb-6'>Register Form</h1>

            <div className='mb-4'>
            <label htmlFor='name' className='block text-gray-600' >Name</label>
            <input type='text' 
                    id='name'
                     name='name' 
                     placeholder='Enter your name' className='mt-1 p-2 border rounded-md' 
                     onChange={formik.handleChange} 
                     onBlur={formik.handleBlur}
                     value={formik.values.name}/>
            {formik.touched.name&&formik.errors.name?(<div className='text-red-500'>{formik.errors.name}</div>):null}
            </div>

            <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-600' >Email</label>
            <input type='text' 
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
            <button type='submit' className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Submit</button>
            
            <div>
            <header className='bg-white'>
        <div className='flex items-center p-4'>
          <h4 className='mr-2'>Already a user?</h4>
          <Link href="/login" className='text-blue-600 hover:text-blue-900'>Login</Link>
        </div>
      </header>
            </div>
        </form>
    </div>
  )
}

export default Register