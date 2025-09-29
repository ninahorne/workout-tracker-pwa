import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DeleteExerciseButton from '@/components/delete-exercise-button';

interface ExerciseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ExerciseDetailPage({
  params,
}: ExerciseDetailPageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the specific exercise
  const { data: exercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', params.id)
    .or(`user_id.eq.${user.id},is_system.eq.true`)
    .single();

  if (!exercise) {
    redirect('/exercises');
  }

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/exercises">
                <button className="p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-red-300">
                  <ArrowLeftIcon className="h-5 w-5 text-black" />
                </button>
              </Link>
              <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                EXERCISE DETAILS
              </h1>
            </div>
            {!exercise.is_system && (
              <div className="flex space-x-2">
                <Link href={`/exercises/${exercise.id}/edit`}>
                  <button className="p-2 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-blue-300">
                    <PencilIcon className="h-4 w-4 text-black" />
                  </button>
                </Link>
                <DeleteExerciseButton
                  exerciseId={exercise.id}
                  exerciseName={exercise.name}
                />
              </div>
            )}
          </div>
        </header>

        {/* Exercise Details */}
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Exercise Name */}
              <div>
                <h2 className="text-3xl font-black text-black uppercase mb-2">
                  {exercise.name}
                  {!exercise.is_system && (
                    <span className="ml-3 px-3 py-1 text-sm bg-green-400 text-black border-2 border-black font-bold uppercase">
                      Custom
                    </span>
                  )}
                </h2>
              </div>

              {/* Primary Muscle Group */}
              <div>
                <h3 className="text-lg font-black text-black uppercase mb-2">
                  Primary Muscle Group
                </h3>
                <div className="bg-blue-400 border-4 border-black p-3">
                  <span className="text-white font-black uppercase text-lg">
                    {exercise.primary_muscle_group}
                  </span>
                </div>
              </div>

              {/* Secondary Muscle Groups */}
              {exercise.secondary_muscle_groups &&
                exercise.secondary_muscle_groups.length > 0 && (
                  <div>
                    <h3 className="text-lg font-black text-black uppercase mb-2">
                      Secondary Muscle Groups
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {exercise.secondary_muscle_groups.map(
                        (muscle: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-400 text-black border-2 border-black font-bold uppercase text-sm"
                          >
                            {muscle}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Exercise Type */}
              <div>
                <h3 className="text-lg font-black text-black uppercase mb-2">
                  Exercise Type
                </h3>
                <div className="bg-yellow-400 border-4 border-black p-3">
                  <span className="text-black font-black uppercase text-lg">
                    {exercise.exercise_type}
                  </span>
                </div>
              </div>

              {/* Equipment */}
              {exercise.equipment && (
                <div>
                  <h3 className="text-lg font-black text-black uppercase mb-2">
                    Equipment
                  </h3>
                  <div className="bg-red-400 border-4 border-black p-3">
                    <span className="text-white font-black uppercase text-lg">
                      {exercise.equipment}
                    </span>
                  </div>
                </div>
              )}

              {/* Notes */}
              {exercise.notes && (
                <div>
                  <h3 className="text-lg font-black text-black uppercase mb-2">
                    Notes
                  </h3>
                  <div className="bg-white border-4 border-black p-4">
                    <p className="text-black font-bold">{exercise.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!exercise.is_system && (
            <Link href={`/exercises/${exercise.id}/edit`}>
              <Button
                variant="default"
                size="lg"
                className="w-full font-bold text-xl"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                EDIT EXERCISE
              </Button>
            </Link>
          )}
          <Link href="/exercises">
            <Button
              variant="secondary"
              size="lg"
              className="w-full font-bold text-xl"
            >
              BACK TO EXERCISES
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
