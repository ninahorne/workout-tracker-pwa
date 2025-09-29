import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">
            WORKOUT HISTORY
          </h1>
          <p className="text-black font-bold uppercase mt-2">
            TRACK YOUR PROGRESS OVER TIME
          </p>
        </header>

        {sessions && sessions.length > 0 ? (
          <div className="space-y-5">
            {sessions.map((session) => (
              <Card key={session.id} variant="secondary">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase">
                        {session.workouts?.name || 'UNNAMED WORKOUT'}
                      </h3>
                      <p className="text-white font-bold mt-1">
                        {new Date(session.date || '')
                          .toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          .toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      {session.duration && (
                        <div className="bg-yellow-400 border-2 border-black px-2 py-1 mb-2">
                          <p className="text-sm font-black text-black">
                            {session.duration} MIN
                          </p>
                        </div>
                      )}
                      <p className="text-sm font-bold text-white">
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
                    <p className="text-white font-bold mb-4 uppercase">
                      {session.overall_notes}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">
                      SESSION #{session.id.slice(-8).toUpperCase()}
                    </span>
                    <Link href={`/history/${session.id}`}>
                      <Button variant="success" size="sm" className="font-bold">
                        VIEW DETAILS
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {sessions.length === 20 && (
              <div className="text-center py-4">
                <Button variant="default" size="md" className="font-bold">
                  LOAD MORE
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card variant="accent" className="text-center p-8">
            <CardContent>
              <h3 className="text-2xl font-black text-black mb-4 uppercase">
                NO WORKOUT HISTORY YET!
              </h3>
              <p className="text-black font-bold mb-6 uppercase">
                Complete your first workout to see it here
              </p>
              <Link href="/workouts">
                <Button variant="danger" size="lg" className="font-bold">
                  START YOUR FIRST WORKOUT
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
