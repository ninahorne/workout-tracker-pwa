import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              SCHEDULE
            </h1>
            <Link href="/schedule/create">
              <button className="p-3 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-green-300">
                <PlusIcon className="h-5 w-5 text-black" />
              </button>
            </Link>
          </div>
        </header>

        {/* Today's Workouts */}
        {todayWorkouts && todayWorkouts.length > 0 && (
          <div className="mb-8">
            <div className="bg-red-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4 mb-4">
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                TODAY
              </h2>
            </div>
            <div className="space-y-4">
              {todayWorkouts.map((scheduled) => (
                <Card key={scheduled.id} variant="primary">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-white text-lg uppercase">
                          {scheduled.workouts?.name || 'UNNAMED WORKOUT'}
                        </h3>
                        {scheduled.workouts?.category && (
                          <span className="text-sm font-bold bg-yellow-400 text-black border-2 border-black px-2 py-1 mt-2 inline-block uppercase">
                            {scheduled.workouts.category}
                          </span>
                        )}
                        <p className="text-white font-bold mt-2">
                          {new Date(
                            scheduled.scheduled_date,
                          ).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link href={`/workouts/${scheduled.workout_id}/start`}>
                          <Button
                            variant="success"
                            size="sm"
                            className="font-bold w-full"
                          >
                            START
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="font-bold"
                        >
                          SKIP
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Workouts */}
        {upcomingWorkouts && upcomingWorkouts.length > 0 ? (
          <div className="mb-8">
            <div className="bg-purple-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4 mb-4">
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                UPCOMING
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingWorkouts.map((scheduled) => (
                <Card key={scheduled.id} className="bg-white">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black text-lg uppercase">
                          {scheduled.workouts?.name || 'UNNAMED WORKOUT'}
                        </h3>
                        {scheduled.workouts?.category && (
                          <span className="text-sm font-bold bg-yellow-400 text-black border-2 border-black px-2 py-1 mt-2 inline-block uppercase">
                            {scheduled.workouts.category}
                          </span>
                        )}
                        <p className="text-black font-bold mt-2 uppercase">
                          {new Date(
                            scheduled.scheduled_date,
                          ).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          AT{' '}
                          {new Date(
                            scheduled.scheduled_date,
                          ).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="font-bold"
                      >
                        EDIT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          !todayWorkouts?.length && (
            <Card variant="accent" className="text-center p-8">
              <CardContent>
                <CalendarIcon className="h-16 w-16 text-black mx-auto mb-4" />
                <h3 className="text-2xl font-black text-black mb-4 uppercase">
                  NO SCHEDULED WORKOUTS!
                </h3>
                <p className="text-black font-bold mb-6 uppercase">
                  Schedule your workouts to stay consistent
                </p>
                <Link href="/schedule/create">
                  <Button
                    variant="success"
                    size="lg"
                    className="inline-flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    SCHEDULE WORKOUT
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        )}

        {/* Quick Actions */}
        <div className="space-y-4 mt-8">
          <Link href="/schedule/calendar">
            <Button
              variant="default"
              size="lg"
              className="w-full font-bold text-xl"
            >
              VIEW CALENDAR
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
