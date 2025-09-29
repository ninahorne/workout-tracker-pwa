import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HistoryPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch recent workout sessions
  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select(
      `
      *,
      workouts (
        name
      )
    `,
    )
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Workout History</h1>
          <p className="text-gray-600">Track your progress over time</p>
        </header>

        {sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {session.workouts?.name || 'Unnamed Workout'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session.date || '').toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {session.duration && (
                      <p className="text-sm font-medium text-gray-900">
                        {session.duration} min
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(session.date || '').toLocaleTimeString(
                        'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </p>
                  </div>
                </div>

                {session.overall_notes && (
                  <p className="text-sm text-gray-600 mb-3">
                    {session.overall_notes}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Session #{session.id.slice(-8)}
                  </span>
                  <Link
                    href={`/history/${session.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}

            {sessions.length === 20 && (
              <div className="text-center py-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Load More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No workout history yet
            </h3>
            <p className="text-gray-500 mb-6">
              Complete your first workout to see it here
            </p>
            <Link
              href="/workouts"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Your First Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
