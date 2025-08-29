// In frontend/app/login/page.tsx
'use client'; // This marks the component as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Your backend's /auth/token endpoint expects form data, not JSON.
    // We use URLSearchParams to format it correctly.
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      
      // Store the token securely. localStorage is simple for this example.
      localStorage.setItem('accessToken', data.access_token);
      
      // Redirect to the workouts page on successful login
      router.push('/workouts');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}