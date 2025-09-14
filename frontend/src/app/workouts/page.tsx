// In frontend/src/app/workouts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Using the updated context
import Link from 'next/link';

interface Workout {
  id: number;
  name: string;
  description: string;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // ✅ CORRECTED: Get the 'user' object from the context
  const { user, logout } = useAuth();

  useEffect(() => {
    // ✅ CORRECTED: Get the token from the user object
    const token = user?.token;

    if (!token) {
      // If no token is found in the context state, redirect to login
      router.push('/login');
      return;
    }

    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workouts/`, {
          method: 'GET',
          headers: {
            // ✅ CORRECTED: Use the 'token' variable
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Token is invalid or expired, use the logout function from context
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch workouts.');
        }

        const data: Workout[] = await response.json();
        setWorkouts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user, router, logout]); // ✅ CORRECTED: Depend on the 'user' object

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <Link href="/workouts/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Workout
        </Link>
      </div>
      
      {workouts.length === 0 ? (
        <p>You haven't created any workouts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{workout.name}</h2>
              <p className="text-gray-600">{workout.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}