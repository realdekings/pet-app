// In frontend/src/app/components/Navbar.tsx
'use client'; // 👈 1. Make it a Client Component

import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // 👈 2. Import the useAuth hook

export const Navbar = () => {
  // 3. Get user status and logout function from the context
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              WorkoutApp
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* 4. Conditionally render links based on user status */}
              {user ? (
                // If user is logged in, show these links
                <>
                  <Link
                    href="/workouts"
                    className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Workouts
                  </Link>
                  <Link
                    href="/routines"
                    className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Routines
                  </Link>
                  <button
                    onClick={logout} // 👈 5. Call the logout function on click
                    className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // If user is logged out, show this link
                <Link
                  href="/login"
                  className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};