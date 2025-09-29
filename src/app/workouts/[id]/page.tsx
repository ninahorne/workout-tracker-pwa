import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PencilIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WorkoutDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the specific workout
  const { data: workout } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!workout) {
    redirect('/workouts');
  }

  // Fetch workout exercises with exercise details
  const { data: workoutExercises } = await supabase
    .from('workout_exercises')
    .select(
      `
      *,
      exercises (
        id,
        name,
        primary_muscle_group,
        secondary_muscle_groups,
        exercise_type,
        equipment
      )
    `,
    )
    .eq('workout_id', params.id)
    .order('order_index');

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/workouts">
                <button className="p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-red-300">
                  <ArrowLeftIcon className="h-5 w-5 text-black" />
                </button>
              </Link>
              <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                WORKOUT DETAILS
              </h1>
            </div>
            <div className="flex space-x-2">
              <Link href={`/workouts/${workout.id}/edit`}>
                <button className="p-2 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-blue-300">
                  <PencilIcon className="h-4 w-4 text-black" />
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Workout Information */}
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-black text-black uppercase mb-2">
                  {workout.name}
                </h2>
                {workout.category && (
                  <span className="px-3 py-1 text-sm bg-blue-400 text-white border-2 border-black font-bold uppercase">
                    {workout.category}
                  </span>
                )}
              </div>

              {workout.description && (
                <div>
                  <h3 className="text-lg font-black text-black uppercase mb-2">
                    Description
                  </h3>
                  <div className="bg-yellow-100 border-4 border-black p-4">
                    <p className="text-black font-bold">
                      {workout.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-black text-black uppercase">
                    Created:
                  </span>
                  <br />
                  <span className="font-bold text-black">
                    {workout.created_at
                      ? new Date(workout.created_at).toLocaleDateString()
                      : 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="font-black text-black uppercase">
                    Last Used:
                  </span>
                  <br />
                  <span className="font-bold text-black">
                    {workout.last_used
                      ? new Date(workout.last_used).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card variant="primary" className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-white uppercase">
                Exercises ({workoutExercises?.length || 0})
              </h2>
            </div>

            {workoutExercises && workoutExercises.length > 0 ? (
              <div className="space-y-3">
                {workoutExercises.map((workoutExercise, index) => (
                  <div
                    key={workoutExercise.id}
                    className="bg-white border-4 border-black p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-black text-black uppercase text-sm">
                        {index + 1}. {workoutExercise.exercises?.name}
                      </h3>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs bg-blue-400 text-white border-2 border-black font-bold uppercase">
                          {workoutExercise.exercises?.exercise_type}
                        </span>
                        {workoutExercise.exercises?.equipment && (
                          <span className="px-2 py-1 text-xs bg-purple-400 text-white border-2 border-black font-bold uppercase">
                            {workoutExercise.exercises?.equipment}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div className="text-center">
                        <div className="text-xs font-black text-black uppercase">
                          Sets
                        </div>
                        <div className="text-lg font-black text-black">
                          {workoutExercise.target_sets}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-black text-black uppercase">
                          Reps
                        </div>
                        <div className="text-lg font-black text-black">
                          {workoutExercise.target_reps}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-black text-black uppercase">
                          Rest
                        </div>
                        <div className="text-sm font-black text-black">
                          {workoutExercise.rest_time || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-black uppercase">
                      Primary: {workoutExercise.exercises?.primary_muscle_group}
                      {workoutExercise.exercises?.secondary_muscle_groups &&
                        workoutExercise.exercises?.secondary_muscle_groups
                          .length > 0 && (
                          <span className="ml-2">
                            • Secondary:{' '}
                            {workoutExercise.exercises?.secondary_muscle_groups.join(
                              ', ',
                            )}
                          </span>
                        )}
                    </div>

                    {workoutExercise.notes && (
                      <div className="mt-2 p-2 bg-yellow-100 border-2 border-black">
                        <div className="text-xs font-black text-black uppercase">
                          Notes:
                        </div>
                        <div className="text-sm font-bold text-black">
                          {workoutExercise.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-4 border-black p-4 text-center">
                <p className="text-black font-bold uppercase">
                  No exercises added to this workout
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            variant="success"
            size="lg"
            className="w-full font-bold text-xl"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            START WORKOUT
          </Button>
          <Link href={`/workouts/${workout.id}/edit`}>
            <Button
              variant="default"
              size="lg"
              className="w-full font-bold text-xl"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              EDIT WORKOUT
            </Button>
          </Link>
          <Link href="/workouts">
            <Button
              variant="secondary"
              size="lg"
              className="w-full font-bold text-xl"
            >
              BACK TO WORKOUTS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
