import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import WorkoutCreateForm from '@/components/workout-create-form';

export default async function CreateWorkoutPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch available exercises
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or(`user_id.eq.${user.id},is_system.eq.true`)
    .order('primary_muscle_group')
    .order('name');

  // Group exercises by muscle group for better organization
  const exercisesByMuscle = exercises?.reduce((acc, exercise) => {
    const muscle = exercise.primary_muscle_group;
    if (!acc[muscle]) {
      acc[muscle] = [];
    }
    acc[muscle].push(exercise);
    return acc;
  }, {} as Record<string, typeof exercises>);

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/workouts">
              <button className="p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-red-300">
                <ArrowLeftIcon className="h-5 w-5 text-black" />
              </button>
            </Link>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              CREATE WORKOUT
            </h1>
          </div>
        </header>

        <WorkoutCreateForm exercisesByMuscle={exercisesByMuscle || {}} />
      </div>
    </div>
  );
}
