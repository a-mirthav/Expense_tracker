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
  incomeDescription: Yup.string().required('Required!'),
  incomeAmount: Yup.number().required('Required!').min(0, 'Amount must be greater than  0'),
  category: Yup.string().required('Required!'),
   date: Yup.date().required('Required!'),
});

const Income = () => {
  const {user}=useAuth()
  const [successMessage, setSuccessMessage] = useState('');
  const [incomeList, setIncomeList] = useState<Array<{ incomeDescription: string, incomeAmount: number, category: string }>>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const formik = useFormik({
    initialValues: {
      incomeDescription: '',
      incomeAmount: 0,
      category: '',
      date: new Date(),
    },
    onSubmit: async (values) => {
      const auth = getAuth(); 
      console.log('Submitting form with values:', values); // Log the form values
      setIncomeList([...incomeList, values]); // Add new income to the list
      setSuccessMessage('Income added successfully!');
      formik.resetForm();
      const userId = user.uid;

      // Set user data in Firestore using setDoc
      const incomeDocRef = doc(db, 'users', userId);
      const formattedDate = values.date.toISOString().split('T')[0];
      const incomeData = {
        incomeDescription: values.incomeDescription,
        incomeAmount: values.incomeAmount,
        category: values.category,
        date:formattedDate ,
      };
     
      try {
        // Fetch the current totalIncome from Firestore
        const userDocSnap = await getDoc(incomeDocRef);
        const currentTotalIncome = userDocSnap.data()?.totalIncome || 0;
    
        // Update Firestore with the new incomeData and totalIncome
        await updateDoc(incomeDocRef, {
          incomes: arrayUnion(incomeData),
          totalIncome: currentTotalIncome + values.incomeAmount,
        });
    
        // Fetch the updated document to get the new totalIncome
        const updatedUserDocSnap = await getDoc(incomeDocRef);
        const updatedTotalIncome = updatedUserDocSnap.data()?.totalIncome || 0;
    
        // Update the local state with the new totalIncome
        setTotalIncome(updatedTotalIncome);
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
  


  const calculateTotalIncome = (): number => {
    return incomeList.reduce((total, income) => total + income.incomeAmount, 0);
  }
  return (
    <div className='flex items-center justify-normal  h-screen bg-gray-300'>
      
        <div>
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded shadow mx-60">
        <h1 className="text-2xl font-semibold mb-6">Income Form</h1>

        <div className="mb-4">
          <label htmlFor="incomeDescription" className="block text-gray-600">
            Income Description:
          </label>
          <input
            type="text"
            id="incomeDescription"
            name="incomeDescription"
            placeholder="Enter income Description"
            className="mt-1 p-2 border rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.incomeDescription}
          />
          {formik.touched.incomeDescription && formik.errors.incomeDescription ? (
            <div className="text-red-500">{formik.errors.incomeDescription}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <label htmlFor="incomeAmount" className="block text-gray-600">
            Income Amount:
          </label>
          <input
            type="number"
            id="incomeAmount"
            name="incomeAmount"
            placeholder="Enter income amount"
            className="mt-1 p-2 border rounded-md "
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.incomeAmount}
          />
          {formik.touched.incomeAmount && formik.errors.incomeAmount ? (
            <div className="text-red-500">{formik.errors.incomeAmount}</div>
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
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="rental income">Rental Income</option>
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
          Add Income
        </button>
        {successMessage && <p className="text-blue-700 ">{successMessage}</p>}
      </form>
      </div>
      
     
    </div>
  );
};

export default Income;
