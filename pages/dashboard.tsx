import React, { useState, ReactNode } from 'react';
import IncomeDashboard from './incomedashboard';
import ExpenseDashboard from './expensedashboard';
import PiechartExpense from './piechart';
import Barchart from './barchart';
import Barchartyear from './baryear';

function Dashboard() {
  const [displayedComponent, setDisplayedComponent] = useState<ReactNode | null>(null);
  const [selectedExpenseOption, setSelectedExpenseOption] = useState<string | null>(null);

  const showIncomeDashboard = () => {
    setDisplayedComponent(<IncomeDashboard />);
    setSelectedExpenseOption(null);
  };

  const showExpenseDashboard = () => {
    setDisplayedComponent(<ExpenseDashboard />);
    setSelectedExpenseOption(null);
  };

  const showPiechartExpense = () => {
    setDisplayedComponent(<PiechartExpense />);
    setSelectedExpenseOption(null);
  };

  const showBarchartExpense = () => {
    setDisplayedComponent(<Barchart />);
    setSelectedExpenseOption(null);
  };

  const showBarchartyearExpense = () => {
    setDisplayedComponent(<Barchartyear />);
    setSelectedExpenseOption(null);
  };

  return (
    <div className='bg-gray-300 p-4'>
      <h1 className='text-3xl font-bold mb-4 text-gray-800'>Your Transactions</h1>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        <button
          onClick={showIncomeDashboard}
          className='button-style bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded col-span-1'
        >
          Your Income
        </button>
        <button
          onClick={showExpenseDashboard}
          className='button-style bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-1'
        >
          Your Expense
        </button>
        <div className='relative inline-block text-left col-span-1'>
          <button
            type='button'
            onClick={() => setSelectedExpenseOption('expenseChart')}
            className='button-style bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full'
          >
            Expense Chart
          </button>
          {selectedExpenseOption === 'expenseChart' && (
            <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg'>
              <div className='rounded-md bg-white shadow-xs'>
                <div className='py-1'>
                  <button
                    onClick={showPiechartExpense}
                    className='block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                  >
                    Pie Chart
                  </button>
                  <button
                    onClick={showBarchartExpense}
                    className='block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                  >
                    Monthly Chart
                  </button>
                  <button
                    onClick={showBarchartyearExpense}
                    className='block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                  >
                    Yearly Chart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-center items-center p-4 mt-4 border-t-2 border-gray-300'>
        {displayedComponent}
      </div>
    </div>
  );
}

export default Dashboard;
