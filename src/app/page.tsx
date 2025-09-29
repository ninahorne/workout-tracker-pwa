import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Ready to start your workout?</p>
        </header>

        <div className="space-y-6">
          {/* Today's Workout Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Today&apos;s Workout
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No workout scheduled for today
              </p>
              <Link
                href="/workouts"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Workouts
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500">This Week</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Workouts</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500">Total</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link
              href="/workouts"
              className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Workout
            </Link>
            <Link
              href="/exercises"
              className="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Browse Exercises
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
