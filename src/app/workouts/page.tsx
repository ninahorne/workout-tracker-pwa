import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function WorkoutsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's workouts
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Workouts</h1>
          <Link
            href="/workouts/create"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
          </Link>
        </header>

        {workouts && workouts.length > 0 ? (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {workout.name}
                  </h3>
                  {workout.category && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {workout.category}
                    </span>
                  )}
                </div>
                {workout.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {workout.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {workout.last_used
                      ? `Last used: ${new Date(
                          workout.last_used,
                        ).toLocaleDateString()}`
                      : 'Never used'}
                  </span>
                  <Link
                    href={`/workouts/${workout.id}`}
                    className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first workout to get started
            </p>
            <Link
              href="/workouts/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
