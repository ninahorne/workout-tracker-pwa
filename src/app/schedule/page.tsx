import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default async function SchedulePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch upcoming scheduled workouts
  const { data: scheduledWorkouts } = await supabase
    .from('scheduled_workouts')
    .select(
      `
      *,
      workouts (
        name,
        category
      )
    `,
    )
    .eq('user_id', user.id)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true })
    .limit(10);

  const today = new Date();
  const todayWorkouts = scheduledWorkouts?.filter(
    (workout) =>
      new Date(workout.scheduled_date).toDateString() === today.toDateString(),
  );

  const upcomingWorkouts = scheduledWorkouts?.filter(
    (workout) =>
      new Date(workout.scheduled_date).toDateString() !== today.toDateString(),
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <Link
            href="/schedule/create"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
          </Link>
        </header>

        {/* Today's Workouts */}
        {todayWorkouts && todayWorkouts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Today</h2>
            <div className="space-y-3">
              {todayWorkouts.map((scheduled) => (
                <div
                  key={scheduled.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {scheduled.workouts?.name || 'Unnamed Workout'}
                      </h3>
                      {scheduled.workouts?.category && (
                        <span className="text-xs text-blue-600">
                          {scheduled.workouts.category}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(scheduled.scheduled_date).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/workouts/${scheduled.workout_id}/start`}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Start
                      </Link>
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Workouts */}
        {upcomingWorkouts && upcomingWorkouts.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Upcoming
            </h2>
            <div className="space-y-3">
              {upcomingWorkouts.map((scheduled) => (
                <div
                  key={scheduled.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {scheduled.workouts?.name || 'Unnamed Workout'}
                      </h3>
                      {scheduled.workouts?.category && (
                        <span className="text-xs text-gray-600">
                          {scheduled.workouts.category}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(scheduled.scheduled_date).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}{' '}
                        at{' '}
                        {new Date(scheduled.scheduled_date).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !todayWorkouts?.length && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No scheduled workouts
              </h3>
              <p className="text-gray-500 mb-6">
                Schedule your workouts to stay consistent
              </p>
              <Link
                href="/schedule/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule Workout
              </Link>
            </div>
          )
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link
            href="/schedule/calendar"
            className="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            View Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
