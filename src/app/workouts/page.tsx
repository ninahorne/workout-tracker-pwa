import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              MY WORKOUTS
            </h1>
            <Link href="/workouts/create">
              <button className="p-3 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-green-300">
                <PlusIcon className="h-5 w-5 text-black" />
              </button>
            </Link>
          </div>
        </header>

        {workouts && workouts.length > 0 ? (
          <div className="space-y-5">
            {workouts.map((workout) => (
              <Card key={workout.id} variant="primary">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-white uppercase">
                      {workout.name}
                    </h3>
                    {workout.category && (
                      <span className="px-3 py-1 text-sm font-bold bg-yellow-400 text-black border-2 border-black uppercase">
                        {workout.category}
                      </span>
                    )}
                  </div>
                  {workout.description && (
                    <p className="text-white font-bold mb-4 uppercase">
                      {workout.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white uppercase">
                      {workout.last_used
                        ? `LAST USED: ${new Date(
                            workout.last_used,
                          ).toLocaleDateString()}`
                        : 'NEVER USED'}
                    </span>
                    <Link href={`/workouts/${workout.id}`}>
                      <Button variant="success" size="sm" className="font-bold">
                        VIEW
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="accent" className="text-center p-8">
            <CardContent>
              <h3 className="text-2xl font-black text-black mb-4 uppercase">
                NO WORKOUTS YET!
              </h3>
              <p className="text-black font-bold mb-6 uppercase">
                Create your first workout to get started
              </p>
              <Link href="/workouts/create">
                <Button
                  variant="success"
                  size="lg"
                  className="inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  CREATE WORKOUT
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
