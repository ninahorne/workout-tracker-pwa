import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Exercises</h1>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <Link
              href="/exercises/create"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {exercisesByMuscle && Object.keys(exercisesByMuscle).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(exercisesByMuscle).map(
              ([muscleGroup, exercises]) => (
                <div key={muscleGroup}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                    {muscleGroup}
                  </h2>
                  <div className="space-y-2">
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {exercise.name}
                              {!exercise.is_system && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                                  Custom
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="text-xs text-gray-500 capitalize">
                                {exercise.exercise_type}
                              </span>
                              {exercise.equipment && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-xs text-gray-500">
                                    {exercise.equipment}
                                  </span>
                                </>
                              )}
                            </div>
                            {exercise.secondary_muscle_groups &&
                              exercise.secondary_muscle_groups.length > 0 && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-500">
                                    Secondary:{' '}
                                    {exercise.secondary_muscle_groups.join(
                                      ', ',
                                    )}
                                  </span>
                                </div>
                              )}
                          </div>
                          <Link
                            href={`/exercises/${exercise.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800 ml-4"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No exercises found
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first custom exercise to get started
            </p>
            <Link
              href="/exercises/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Exercise
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
