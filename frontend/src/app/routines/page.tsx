// In frontend/src/app/routines/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

// Define TypeScript interfaces for our data shapes
interface Workout {
  id: number;
  name: string;
  description: string;
}

interface Routine {
  id: number;
  name: string;
  description: string;
  workouts: Workout[]; // A routine contains an array of workouts
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const token = user?.token;

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchRoutines = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch routines.');
        }

        const data: Routine[] = await response.json();
        setRoutines(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [user, router, logout]);

  if (loading) return <p>Loading routines...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Routines</h1>
        <Link href="/routines/create" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create Routine
        </Link>
      </div>
      
      {routines.length === 0 ? (
        <p>You haven't created any routines yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <div key={routine.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">{routine.name}</h2>
              <p className="text-gray-600 mb-4">{routine.description}</p>
              
              <h3 className="text-lg font-medium text-gray-800 border-t pt-4">Workouts:</h3>
              {routine.workouts.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {/* Here we map over the nested workouts array */}
                  {routine.workouts.map((workout) => (
                    <li key={workout.id} className="text-gray-700">{workout.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No workouts have been added to this routine yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}