import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DeleteExerciseButton from '@/components/delete-exercise-button';

export default async function ExercisesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch system exercises and user's custom exercises
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or(`user_id.eq.${user.id},is_system.eq.true`)
    .order('is_system', { ascending: false })
    .order('name');

  // Group exercises by muscle group
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              EXERCISES
            </h1>
            <div className="flex space-x-3">
              <button className="p-3 bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-purple-300">
                <MagnifyingGlassIcon className="h-5 w-5 text-black" />
              </button>
              <Link href="/exercises/create">
                <button className="p-3 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-green-300">
                  <PlusIcon className="h-5 w-5 text-black" />
                </button>
              </Link>
            </div>
          </div>
        </header>

        {exercisesByMuscle && Object.keys(exercisesByMuscle).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(exercisesByMuscle).map(
              ([muscleGroup, exercises]) => (
                <div key={muscleGroup}>
                  <div className="bg-blue-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4 mb-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wide">
                      {muscleGroup}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {exercises.map((exercise) => (
                      <Card key={exercise.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-black text-lg">
                                {exercise.name}
                                {!exercise.is_system && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-green-400 text-black border-2 border-black font-bold uppercase">
                                    Custom
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center mt-2 space-x-3">
                                <span className="text-sm text-black font-bold uppercase border-2 border-black px-2 py-1 bg-yellow-400">
                                  {exercise.exercise_type}
                                </span>
                                {exercise.equipment && (
                                  <span className="text-sm text-black font-bold uppercase border-2 border-black px-2 py-1 bg-purple-400">
                                    {exercise.equipment}
                                  </span>
                                )}
                              </div>
                              {exercise.secondary_muscle_groups &&
                                exercise.secondary_muscle_groups.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-sm font-bold text-black">
                                      SECONDARY:{' '}
                                      {exercise.secondary_muscle_groups
                                        .join(', ')
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Link href={`/exercises/${exercise.id}`}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="font-bold"
                                >
                                  VIEW
                                </Button>
                              </Link>
                              {!exercise.is_system && (
                                <DeleteExerciseButton
                                  exerciseId={exercise.id}
                                  exerciseName={exercise.name}
                                />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <Card variant="accent" className="text-center p-8">
            <CardContent>
              <h3 className="text-2xl font-black text-black mb-4 uppercase">
                NO EXERCISES FOUND!
              </h3>
              <p className="text-black font-bold mb-6 uppercase">
                Create your first custom exercise to get started
              </p>
              <Link href="/exercises/create">
                <Button
                  variant="success"
                  size="lg"
                  className="inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  CREATE EXERCISE
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
