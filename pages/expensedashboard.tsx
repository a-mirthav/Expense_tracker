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

const ExpenseDashboard = () => {
  const { user } = useAuth();
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>([]);
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

        // Filter incomes based on the selected month
        const filteredExpenses = selectedMonth
          ? userExpense.filter((expense) => expense.date && expense.date.split('-')[1] === selectedMonth)
          : userExpense;

        const formattedExpenses = filteredExpenses.map((expense) => ({
          ...expense,
          date: expense.date ? new Date(expense.date).toLocaleDateString('en-US') : null,
        }));

        setExpenseList(formattedExpenses);
        const calculatedTotalExpense = formattedExpenses.reduce((total, expense) => total + expense.expenseAmount, 0);
        setTotalExpense(calculatedTotalExpense);
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error fetching income data:', error);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <h2 className="text-black text-2xl font-semibold mb-4">Expense Details</h2>
      <div>
        <label htmlFor="monthDropdown" className="mr-2">
          Select Month:
        </label>
        <select
          id="monthDropdown"
          onChange={handleMonthChange}
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
      </div>
      <p className="text-xl font-semibold mt-4">Your Total Expense: Rs {totalExpense}</p>
      <br />
      <table className="min-w-full bg-white border border-gray-300">
      <thead>
      <tr>
          <th className="py-2 px-6 border-b">Description</th>
          <th className="py-2 px-6 border-b">Amount</th>
          <th className="py-2 px-6 border-b">Category</th>
          <th className="py-2 px-6 border-b">Date</th>
  {/* Add more columns as needed */}
</tr>
</thead>
        <tbody>
          {expenseList.map((expense, index) => (
            <tr key={index} className="bg-gray-100">
              <td className="py-2 px-6 border-b">{expense.expenseDescription}</td>
              <td className="py-2 px-6 border-b">Rs {expense.expenseAmount}</td>
              <td className="py-2 px-6 border-b">{expense.category}</td>
              <td className="py-2 px-6 border-b">{expense.date || 'N/A'}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseDashboard;





















