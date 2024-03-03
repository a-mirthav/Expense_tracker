import React, { useState,useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAuth } from "firebase/auth";
import {db} from '../config/firebase'
import {collection,addDoc,setDoc,doc,getDoc,updateDoc, arrayUnion,query, where, getDocs} from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image'
const validationSchema = Yup.object({
  expenseDescription: Yup.string(),
  expenseAmount: Yup.number().required('Required!').min(0, 'Amount must be greater than  0'),
  category: Yup.string().required('Required!'),
   date: Yup.date().required('Required!'),
});

const Expense = () => {
  const {user}=useAuth()
  const [successMessage, setSuccessMessage] = useState('');
  const [expenseList, setExpenseList] = useState<Array<{ expenseDescription: string, expenseAmount: number, category: string }>>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const formik = useFormik({
    initialValues: {
      expenseDescription: '',
      expenseAmount: 0,
      category: '',
      date: new Date(),
    },
    onSubmit: async (values) => {
      const auth = getAuth(); 
      console.log('Submitting form with values:', values); // Log the form values
      setExpenseList([...expenseList, values]); // Add new income to the list
      setSuccessMessage('Expense added successfully!');
      formik.resetForm();
      const userId = user.uid;

      // Set user data in Firestore using setDoc
      const expenseDocRef = doc(db, 'users', userId);
      const formattedDate = values.date.toISOString().split('T')[0];
      const expenseData = {
        expenseDescription: values.expenseDescription,
        expenseAmount: values.expenseAmount,
        category: values.category,
        date:formattedDate ,
      };
     
      try {
        // Fetch the current totalIncome from Firestore
        const userDocSnap = await getDoc(expenseDocRef);
        const currentTotalExpense = userDocSnap.data()?.totalExpense || 0;
    
        // Update Firestore with the new incomeData and totalIncome
        await updateDoc(expenseDocRef, {
          expenses: arrayUnion(expenseData),
          totalExpense: currentTotalExpense + values.expenseAmount,
        });
    
        // Fetch the updated document to get the new totalIncome
        const updatedUserDocSnap = await getDoc(expenseDocRef);
        const updatedTotalexpense = updatedUserDocSnap.data()?.totalExpense || 0;
    
        // Update the local state with the new totalIncome
        setTotalExpense(updatedTotalexpense);
      } catch (error) {
        console.error('Error updating Firestore:', error);
        // Handle error appropriately, e.g., display an error message
      }
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    },
    validationSchema,
  });
  


  
  return (
    <div className='flex items-center justify-normal  h-screen bg-gray-300'>
        <div>
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded shadow mx-60">
        <h1 className="text-2xl font-semibold mb-6">Expense Form</h1>

        <div className="mb-4">
          <label htmlFor="incomeDescription" className="block text-gray-600">
            Expense Description:
          </label>
          <input
            type="text"
            id="expenseDescription"
            name="expenseDescription"
            placeholder="Enter expense Description"
            className="mt-1 p-2 border rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.expenseDescription}
          />
          {formik.touched.expenseDescription && formik.errors.expenseDescription ? (
            <div className="text-red-500">{formik.errors.expenseDescription}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <label htmlFor="expenseAmount" className="block text-gray-600">
            Expense Amount:
          </label>
          <input
            type="number"
            id="expenseAmount"
            name="expenseAmount"
            placeholder="Enter expense amount"
            className="mt-1 p-2 border rounded-md "
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.expenseAmount}
          />
          {formik.touched.expenseAmount && formik.errors.expenseAmount ? (
            <div className="text-red-500">{formik.errors.expenseAmount}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-600">
            Category:
          </label>
          <select 
            id="category"
            name="category"
            className="block text-gray-600 mt-1 p-2 border rounded-md "
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
          >
            <option value="">Select category</option>
            <option value="rent">Rent</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500">{formik.errors.category}</div>
          ) : null}
        </div>

        <div className="mb-4">
            <label htmlFor="date" className="block text-gray-600">
              Date:
            </label>
            
            <DatePicker
              id="date"
              name="date"
              selected={formik.values.date}
              onChange={(date) => formik.setFieldValue("date", date)}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
        >
          Add Expense
        </button>
        {successMessage && <p className="text-blue-700 ">{successMessage}</p>}
      </form>
      </div>
     
           
    </div>
  );
};

export default Expense;
