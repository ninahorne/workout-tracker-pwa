'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Exercise {
  id: string;
  name: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string[];
  exercise_type: string;
  equipment: string;
  is_system: boolean;
}

interface WorkoutExercise {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface WorkoutCreateFormProps {
  exercisesByMuscle: Record<string, Exercise[]>;
}

export default function WorkoutCreateForm({
  exercisesByMuscle,
}: WorkoutCreateFormProps) {
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    [],
  );
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);

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
    value: any,
  ) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  return (
    <form className="space-y-6">
      {/* Workout Name */}
      <Card className="bg-white">
        <CardContent className="p-5">
          <label className="block text-lg font-black text-black uppercase mb-3">
            WORKOUT NAME
          </label>
          <input
            type="text"
            name="name"
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
          disabled={selectedExercises.length === 0}
        >
          CREATE WORKOUT
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full font-bold text-xl"
          onClick={() => window.history.back()}
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
