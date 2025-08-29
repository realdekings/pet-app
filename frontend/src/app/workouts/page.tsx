// In frontend/app/workouts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define a type for our workout object for better type safety
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

  useEffect(() => {
    const fetchWorkouts = async () => {
      // Get the token from localStorage
      const token = localStorage.getItem('accessToken');

      if (!token) {
        // If no token is found, redirect to login page
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workouts/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Token is invalid or expired
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('accessToken'); // Clear the bad token
          router.push('/login');
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
  }, [router]); // Add router to the dependency array

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>My Workouts</h1>
      {workouts.length === 0 ? (
        <p>You haven't created any workouts yet.</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <h2>{workout.name}</h2>
              <p>{workout.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}