'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Exercise {
  id: string;
  name: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string[] | null;
  exercise_type: string;
  equipment: string | null;
  is_system: boolean | null;
}

interface WorkoutExercise {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface ExistingWorkoutExercise {
  id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: string;
  rest_time: number | null;
  notes: string | null;
  exercises: {
    id: string;
    name: string;
    primary_muscle_group: string;
    secondary_muscle_groups: string[] | null;
    exercise_type: string;
    equipment: string | null;
    is_system: boolean | null;
  } | null;
}

interface Workout {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  last_used: string | null;
}

interface WorkoutEditFormProps {
  workout: Workout;
  workoutExercises: ExistingWorkoutExercise[];
  exercisesByMuscle: Record<string, Exercise[]>;
}

export default function WorkoutEditForm({
  workout,
  workoutExercises,
  exercisesByMuscle,
}: WorkoutEditFormProps) {
  // Convert existing workout exercises to the format used by the form
  const initialExercises: WorkoutExercise[] = workoutExercises.map((we) => ({
    exercise_id: we.exercise_id,
    exercise_name: we.exercises?.name || 'Unknown Exercise',
    sets: we.target_sets,
    reps: parseInt(we.target_reps) || 0,
    notes: we.notes || undefined,
  }));

  const [selectedExercises, setSelectedExercises] =
    useState<WorkoutExercise[]>(initialExercises);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const addExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      sets: 3,
      reps: 10,
    };
    setSelectedExercises([...selectedExercises, newWorkoutExercise]);
    setShowExerciseSelection(false);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExerciseDetails = (
    index: number,
    field: keyof WorkoutExercise,
    value: string | number | undefined,
  ) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    try {
      // Update workout
      const { error: workoutError } = await supabase
        .from('workouts')
        .update({
          name,
          description: description || null,
          category: category || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workout.id);

      if (workoutError) throw workoutError;

      // Delete existing workout exercises
      const { error: deleteError } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('workout_id', workout.id);

      if (deleteError) throw deleteError;

      // Create updated workout exercises
      if (selectedExercises.length > 0) {
        const workoutExercises = selectedExercises.map((exercise, index) => ({
          workout_id: workout.id,
          exercise_id: exercise.exercise_id,
          order_index: index,
          target_sets: exercise.sets,
          target_reps: exercise.reps.toString(),
          notes: exercise.notes || null,
        }));

        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(workoutExercises);

        if (exercisesError) throw exercisesError;
      }

      // Redirect to workout detail page
      router.push(`/workouts/${workout.id}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update workout',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this workout? This action cannot be undone.',
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Delete workout exercises first (due to foreign key constraint)
      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('workout_id', workout.id);

      if (exercisesError) throw exercisesError;

      // Delete the workout
      const { error: workoutError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workout.id);

      if (workoutError) throw workoutError;

      // Redirect to workouts list
      router.push('/workouts');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete workout',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-400 border-4 border-black p-4 font-bold text-black">
          {error}
        </div>
      )}

      {/* Workout Name */}
      <Card className="bg-white">
        <CardContent className="p-5">
          <label className="block text-lg font-black text-black uppercase mb-3">
            WORKOUT NAME
          </label>
          <input
            type="text"
            name="name"
            defaultValue={workout.name}
            placeholder="ENTER WORKOUT NAME"
            className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none"
            required
          />
        </CardContent>
      </Card>

      {/* Workout Description */}
      <Card className="bg-white">
        <CardContent className="p-5">
          <label className="block text-lg font-black text-black uppercase mb-3">
            DESCRIPTION (OPTIONAL)
          </label>
          <textarea
            name="description"
            defaultValue={workout.description || ''}
            placeholder="DESCRIBE YOUR WORKOUT..."
            rows={4}
            className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none resize-none"
          />
        </CardContent>
      </Card>

      {/* Workout Category */}
      <Card className="bg-white">
        <CardContent className="p-5">
          <label className="block text-lg font-black text-black uppercase mb-3">
            CATEGORY
          </label>
          <select
            name="category"
            defaultValue={workout.category || ''}
            className="w-full p-4 border-4 border-black font-bold text-black uppercase bg-yellow-200 focus:bg-yellow-100 focus:outline-none"
          >
            <option value="">SELECT CATEGORY</option>
            <option value="UPPER BODY">UPPER BODY</option>
            <option value="LOWER BODY">LOWER BODY</option>
            <option value="FULL BODY">FULL BODY</option>
            <option value="PUSH">PUSH</option>
            <option value="PULL">PULL</option>
            <option value="LEGS">LEGS</option>
            <option value="CARDIO">CARDIO</option>
            <option value="STRENGTH">STRENGTH</option>
          </select>
        </CardContent>
      </Card>

      {/* Exercise Selection */}
      <Card variant="primary">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-white uppercase">
              EXERCISES ({selectedExercises.length})
            </h2>
            <Button
              type="button"
              variant="success"
              size="sm"
              className="font-bold"
              onClick={() => setShowExerciseSelection(!showExerciseSelection)}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              ADD
            </Button>
          </div>

          {/* Selected Exercises */}
          {selectedExercises.length > 0 ? (
            <div className="space-y-3 mb-4">
              {selectedExercises.map((workoutExercise, index) => (
                <div key={index} className="bg-white border-4 border-black p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-black uppercase text-sm">
                      {workoutExercise.exercise_name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="p-1 bg-red-400 border-2 border-black hover:bg-red-300"
                    >
                      <XMarkIcon className="h-4 w-4 text-black" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        SETS
                      </label>
                      <input
                        type="number"
                        value={workoutExercise.sets}
                        onChange={(e) =>
                          updateExerciseDetails(
                            index,
                            'sets',
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full p-2 border-2 border-black text-black font-bold bg-yellow-200 focus:bg-yellow-100"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        REPS
                      </label>
                      <input
                        type="number"
                        value={workoutExercise.reps}
                        onChange={(e) =>
                          updateExerciseDetails(
                            index,
                            'reps',
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full p-2 border-2 border-black text-black font-bold bg-yellow-200 focus:bg-yellow-100"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        WEIGHT
                      </label>
                      <input
                        type="number"
                        value={workoutExercise.weight || ''}
                        onChange={(e) =>
                          updateExerciseDetails(
                            index,
                            'weight',
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                        className="w-full p-2 border-2 border-black text-black font-bold bg-yellow-200 focus:bg-yellow-100"
                        placeholder="LBS"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-black mb-1">
                      NOTES
                    </label>
                    <input
                      type="text"
                      value={workoutExercise.notes || ''}
                      onChange={(e) =>
                        updateExerciseDetails(index, 'notes', e.target.value)
                      }
                      className="w-full p-2 border-2 border-black text-black font-bold bg-yellow-200 focus:bg-yellow-100"
                      placeholder="OPTIONAL NOTES"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-4 mb-4">
              <p className="text-black font-bold uppercase text-center">
                NO EXERCISES ADDED YET
              </p>
            </div>
          )}

          {/* Exercise Selection Modal */}
          {showExerciseSelection && (
            <div className="bg-white border-4 border-black p-4 max-h-64 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-black text-black uppercase">
                  SELECT EXERCISE
                </h3>
                <button
                  type="button"
                  onClick={() => setShowExerciseSelection(false)}
                  className="p-1 bg-red-400 border-2 border-black hover:bg-red-300"
                >
                  <XMarkIcon className="h-4 w-4 text-black" />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(exercisesByMuscle).map(
                  ([muscleGroup, exercises]) => (
                    <div key={muscleGroup}>
                      <h4 className="font-bold text-black uppercase text-sm mb-2 bg-blue-400 p-2 border-2 border-black">
                        {muscleGroup}
                      </h4>
                      {exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          type="button"
                          onClick={() => addExercise(exercise)}
                          className="w-full text-left p-2 border-2 border-black bg-yellow-200 hover:bg-yellow-100 font-bold text-black text-sm mb-1"
                          disabled={selectedExercises.some(
                            (we) => we.exercise_id === exercise.id,
                          )}
                        >
                          {exercise.name}
                          {selectedExercises.some(
                            (we) => we.exercise_id === exercise.id,
                          ) && ' ✓'}
                        </button>
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          type="submit"
          variant="success"
          size="lg"
          className="w-full font-bold text-xl"
          disabled={isLoading || selectedExercises.length === 0}
        >
          {isLoading ? 'UPDATING...' : 'UPDATE WORKOUT'}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="lg"
          className="w-full font-bold text-xl"
          onClick={handleDelete}
          disabled={isLoading}
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          DELETE WORKOUT
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full font-bold text-xl"
          onClick={() => router.push(`/workouts/${workout.id}`)}
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
