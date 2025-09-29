import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with neobrutalism style */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">
            💪 WORKOUT TRACKER
          </h1>
          <p className="text-lg font-bold text-black">TIME TO GET SWOLE! 🔥</p>
        </div>

        <div className="space-y-6">
          {/* Today's Workout Card */}
          <Card variant="primary">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-black uppercase">
                🎯 TODAY&apos;S MISSION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl mb-4">💤</div>
                <p className="text-white font-bold text-lg mb-6">
                  NO WORKOUT SCHEDULED
                </p>
                <Link href="/workouts">
                  <Button variant="success" size="lg" className="w-full">
                    🏋️ FIND A WORKOUT
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats with brutalist grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="accent">
              <CardContent className="text-center p-4">
                <div className="text-3xl font-black text-black">📅</div>
                <div className="text-4xl font-black text-black">0</div>
                <p className="font-bold text-black uppercase">This Week</p>
              </CardContent>
            </Card>
            <Card variant="secondary">
              <CardContent className="text-center p-4">
                <div className="text-3xl font-black text-white">📊</div>
                <div className="text-4xl font-black text-white">0</div>
                <p className="font-bold text-white uppercase">Total</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 gap-4">
            <Link href="/workouts" className="block">
              <Button variant="danger" size="lg" className="w-full text-xl">
                🚀 START WORKOUT
              </Button>
            </Link>
            <Link href="/exercises" className="block">
              <Button variant="default" size="lg" className="w-full text-xl">
                📚 BROWSE EXERCISES
              </Button>
            </Link>
          </div>

          {/* Fun motivational section */}
          <Card className="bg-green-400">
            <CardContent className="text-center p-6">
              <div className="text-4xl mb-2">🎯</div>
              <p className="font-black text-xl text-black uppercase">
                CONSISTENCY IS KEY!
              </p>
              <p className="font-bold text-black">Small steps, big gains! 💪</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
