import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Link from 'next/link'
function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <Image
      src="/expenso.png" width={30}
      height={30}
      
      alt="Picture of the author" className='rounded-full'
    />
         
          <span className="ml-3 text-xl">Expenso</span>
        </div>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/dashboard" className="mr-5 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/income" className="mr-5 hover:text-gray-900">
            Income
          </Link>
          <Link href="/expense" className="mr-5 hover:text-gray-900">
            Expense
          </Link>
        </nav>
        <div className="flex items-end mt-4 md:mt-0">
          {user ? (
            <div className="relative inline-block text-left">
              <button
                className="justify-end inline-flex items-center bg-blue-100 border-0 py-1 px-5 focus:outline-none hover:bg-blue-200 rounded text-base sm:text-sm"
                onClick={toggleDropdown}
              >
               <Image
      src="/user.png" width={30}
      height={30}
      
      alt="Picture of the author" className='rounded-full mr-2'
    />
                <span className="mr-3">{user.displayName}</span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  className={`w-4 h-4 ${showDropdown ? 'transform rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                  <div className="rounded-md bg-white shadow-xs">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          router.push('/login');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="md:ml-auto flex flex-wrap items-center   justify-center mr-5 text-gray-700 hover:text-gray-900 "
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
