import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '../config/firebase';
import { AgChartsReact } from 'ag-charts-react';

// Define the type of each expense item
type ExpenseItem = {
  expenseDescription: string;
  expenseAmount: number;
  category: string;
  date: string | null;
  // Add more properties as needed
};


const Piechart = () => {
  const { user } = useAuth();
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user, selectedMonth]);

  const fetchData = async () => {
    try {
      const userId = user.uid;
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userExpense: ExpenseItem[] = userData.expenses || [];

        // Filter expenses based on the selected month
        const filteredExpenses = selectedMonth
          ? userExpense.filter((expense) => expense.date && expense.date.split('-')[1] === selectedMonth)
          : userExpense;

        const formattedExpenses = filteredExpenses.map((expense) => ({
          ...expense,
          date: expense.date ? new Date(expense.date).toLocaleDateString('en-US') : null,
        }));

        setExpenseList(formattedExpenses);

        // Fetch total income and total expense
        const fetchedTotalIncome = userData.totalIncome || 0;
        const fetchedTotalExpense = userData.totalExpense || 0;

        setTotalIncome(fetchedTotalIncome);
        setTotalExpense(fetchedTotalExpense);
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error fetching expense data:', error);
    }
  };

  const categoryTotals: Record<string, number> = {};
  expenseList.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.expenseAmount;
  });

  const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total,
    label: category,
  }));

  // Calculate the balance amount
  const balanceAmount = totalIncome - totalExpense;

  const options = {
    width:700,
    height:600,
    title: {
      text: 'Expense Distribution',
    },
    series: [
      {
        type: 'pie',
        angleKey: 'total',
        labelKey: 'label',
        calloutLabelKey: 'label',
        sectorLabelKey:'total',
        data: chartData,
        tooltip: {
          renderer: (params: any) => {
            const category = params.datum.label;
            return `<div>${category}</div>`;
          },
        },
      },
    ],
  } as any;

  useEffect(() => {
    console.log('chartData:', chartData);
    console.log('Total Expense:', totalExpense);
    console.log('Total Income:', totalIncome);
    console.log('Balance Amount:', balanceAmount);
  }, [chartData, totalExpense, totalIncome, balanceAmount]);


  return (
    <div className="flex">
      <div>
        <label htmlFor="monthDropdown" className="mr-2">
          Select Month:
        </label>
        <select
          id="monthDropdown"
          onChange={(e) => setSelectedMonth(e.target.value)}
          value={selectedMonth || ''}
          className="p-2 border rounded-md"
        >
          <option value="">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {chartData.length > 0 ? (
          <div className="mt-4">
            <AgChartsReact options={options} />
          </div>
        ) : (
          <p>No expense data available.</p>
        )}
      </div>

      <div className="ml-14 text-black font-semibold">
        {/* Display Total Income, Total Expense, and Balance Amount */}
        <p>Total Income: Rs {totalIncome}</p>
        <br />
        <p>Total Expense: Rs {totalExpense}</p>
        <br />
        <p className={balanceAmount < 0 ? 'text-red-500' : 'text-green-800'}>
          Balance Amount: Rs {balanceAmount}
        </p>
      </div>
    </div>
  );
};

export default Piechart;






