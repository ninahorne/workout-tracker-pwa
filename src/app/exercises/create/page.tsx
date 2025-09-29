import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function CreateExercisePage() {
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
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/exercises">
              <button className="p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-red-300">
                <ArrowLeftIcon className="h-5 w-5 text-black" />
              </button>
            </Link>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              CREATE EXERCISE
            </h1>
          </div>
        </header>

        <form className="space-y-6">
          {/* Exercise Name */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <label className="block text-lg font-black text-black uppercase mb-3">
                EXERCISE NAME
              </label>
              <input
                type="text"
                name="name"
                placeholder="ENTER EXERCISE NAME"
                className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none"
                required
              />
            </CardContent>
          </Card>

          {/* Primary Muscle Group */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <label className="block text-lg font-black text-black uppercase mb-3">
                PRIMARY MUSCLE GROUP
              </label>
              <select
                name="primary_muscle_group"
                className="w-full p-4 border-4 border-black font-bold text-black uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none"
                required
              >
                <option value="">SELECT MUSCLE GROUP</option>
                <option value="CHEST">CHEST</option>
                <option value="BACK">BACK</option>
                <option value="SHOULDERS">SHOULDERS</option>
                <option value="BICEPS">BICEPS</option>
                <option value="TRICEPS">TRICEPS</option>
                <option value="QUADRICEPS">QUADRICEPS</option>
                <option value="HAMSTRINGS">HAMSTRINGS</option>
                <option value="GLUTES">GLUTES</option>
                <option value="CALVES">CALVES</option>
                <option value="CORE">CORE</option>
                <option value="LOWER BACK">LOWER BACK</option>
                <option value="FOREARMS">FOREARMS</option>
              </select>
            </CardContent>
          </Card>

          {/* Exercise Type */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <label className="block text-lg font-black text-black uppercase mb-3">
                EXERCISE TYPE
              </label>
              <select
                name="exercise_type"
                className="w-full p-4 border-4 border-black font-bold text-black uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none"
                required
              >
                <option value="">SELECT TYPE</option>
                <option value="COMPOUND">COMPOUND</option>
                <option value="ISOLATION">ISOLATION</option>
              </select>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <label className="block text-lg font-black text-black uppercase mb-3">
                EQUIPMENT
              </label>
              <select
                name="equipment"
                className="w-full p-4 border-4 border-black font-bold text-black uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none"
              >
                <option value="">SELECT EQUIPMENT</option>
                <option value="DUMBBELLS">DUMBBELLS</option>
                <option value="BARBELL">BARBELL</option>
                <option value="CABLE MACHINE">CABLE MACHINE</option>
                <option value="MACHINE">MACHINE</option>
                <option value="BODYWEIGHT">BODYWEIGHT</option>
                <option value="SMITH MACHINE">SMITH MACHINE</option>
                <option value="ASSISTED MACHINE">ASSISTED MACHINE</option>
                <option value="PULL-UP BAR">PULL-UP BAR</option>
              </select>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <label className="block text-lg font-black text-black uppercase mb-3">
                NOTES (OPTIONAL)
              </label>
              <textarea
                name="notes"
                placeholder="ADD EXERCISE NOTES..."
                rows={4}
                className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none resize-none"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              type="submit"
              variant="success"
              size="lg"
              className="w-full font-bold text-xl"
            >
              CREATE EXERCISE
            </Button>
            <Link href="/exercises">
              <Button
                variant="secondary"
                size="lg"
                className="w-full font-bold text-xl"
              >
                CANCEL
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
