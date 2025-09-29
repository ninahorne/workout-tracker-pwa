'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
      <h1 className="text-3xl font-black text-center mb-6 uppercase text-black">
        {isSignUp ? 'JOIN THE CREW' : 'WELCOME BACK'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-black text-black uppercase mb-2"
          >
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-4 border-black font-bold text-lg text-gray-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all duration-75"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-lg font-black text-black uppercase mb-2"
          >
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border-4 border-black font-bold text-lg text-gray-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all duration-75"
          />
        </div>

        {error && (
          <div className="bg-red-400 border-4 border-black p-4 font-bold text-black">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 font-black text-xl text-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'LOADING...' : isSignUp ? 'SIGN UP' : 'SIGN IN'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-black hover:underline font-bold text-lg uppercase cursor-pointer"
        >
          {isSignUp ? 'ALREADY A MEMBER? SIGN IN' : 'NEW HERE? JOIN THE CREW'}
        </button>
      </div>
    </div>
  );
}
