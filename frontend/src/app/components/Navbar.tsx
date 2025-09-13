// In frontend/src/app/components/Navbar.tsx
import Link from 'next/link';

export const Navbar = () => {
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
              <Link href="/workouts" className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                My Workouts
              </Link>
              <Link href="/login" className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};