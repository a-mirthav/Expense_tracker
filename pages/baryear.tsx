import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '../config/firebase';

type ExpenseItem = {
  expenseDescription: string;
  expenseAmount: number;
  category: string;
  date: string | null;
};

const Barchartyear = () => {
  const { user } = useAuth();
  const [yearlyExpenses, setYearlyExpenses] = useState<Record<string, number>>({});
  const [ApexChart, setApexChart] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userExpense: ExpenseItem[] = userData.expenses || [];

          const formattedExpenses = userExpense.map((expense: ExpenseItem) => ({
            ...expense,
            date: expense.date ? new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' }) : null,
          }));

          // Fetch total expense for each year
          const yearlyTotals: Record<string, number> = {};
          formattedExpenses.forEach((expense: ExpenseItem) => {
            const year = expense.date?.split('/')[1]; // Assuming date is in 'MM/DD/YYYY' format
            yearlyTotals[year!] = (yearlyTotals[year!] || 0) + expense.expenseAmount;
          });

          setYearlyExpenses(yearlyTotals);

          // Dynamically import ApexCharts only on the client side
          if (typeof window !== 'undefined') {
            const ApexCharts = (await import('react-apexcharts')).default;
            setApexChart(() => ApexCharts);
          }
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchData();
  }, [user]);

  const chartData = {
    options: {
      xaxis: {
        categories: Object.keys(yearlyExpenses),
        title: {
          text: 'Year',
        },
      },
      yaxis: {
        title: {
          text: 'Total Expense',
        },
      },
    },
    series: [
      {
        name: 'Total Expense',
        data: Object.values(yearlyExpenses),
      },
    ],
  };

  return (
    <div className="flex">
      <div style={{ flex: 1 }}>
        <h2 className="text-black text-2xl font-semibold mb-4">Yearly Expense Details</h2>
        {ApexChart && chartData.options.xaxis.categories.length > 0 ? (
          <div className="mt-4" style={{ height: '400px', width: '100%' }}>
            <ApexChart options={chartData.options} series={chartData.series} type="bar" height="400"style={{ width: '100%' }} />
          </div>
        ) : (
          <p>No expense data available.</p>
        )}
      </div>
    </div>
  );
};

export default Barchartyear;
