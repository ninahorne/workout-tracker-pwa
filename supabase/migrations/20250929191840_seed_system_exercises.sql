-- Seed system exercises
INSERT INTO exercises (id, user_id, name, primary_muscle_group, secondary_muscle_groups, exercise_type, equipment, notes, is_system) VALUES
-- Chest exercises
(gen_random_uuid(), NULL, 'Bench Press', 'Chest', ARRAY['Shoulders', 'Triceps'], 'compound', 'Barbell', 'Classic compound chest exercise', true),
(gen_random_uuid(), NULL, 'Incline Bench Press', 'Chest', ARRAY['Shoulders', 'Triceps'], 'compound', 'Barbell', 'Targets upper chest', true),
(gen_random_uuid(), NULL, 'Dumbbell Press', 'Chest', ARRAY['Shoulders', 'Triceps'], 'compound', 'Dumbbells', 'Greater range of motion than barbell', true),
(gen_random_uuid(), NULL, 'Push-ups', 'Chest', ARRAY['Shoulders', 'Triceps'], 'compound', 'Bodyweight', 'Bodyweight chest exercise', true),
(gen_random_uuid(), NULL, 'Dumbbell Flyes', 'Chest', ARRAY[]::TEXT[]::TEXT[], 'isolation', 'Dumbbells', 'Isolation exercise for chest', true),

-- Back exercises
(gen_random_uuid(), NULL, 'Deadlift', 'Back', ARRAY['Glutes', 'Hamstrings', 'Traps'], 'compound', 'Barbell', 'King of all exercises', true),
(gen_random_uuid(), NULL, 'Pull-ups', 'Back', ARRAY['Biceps'], 'compound', 'Pull-up Bar', 'Bodyweight back exercise', true),
(gen_random_uuid(), NULL, 'Barbell Rows', 'Back', ARRAY['Biceps', 'Rear Delts'], 'compound', 'Barbell', 'Horizontal pulling movement', true),
(gen_random_uuid(), NULL, 'Lat Pulldowns', 'Back', ARRAY['Biceps'], 'compound', 'Cable Machine', 'Vertical pulling movement', true),
(gen_random_uuid(), NULL, 'T-Bar Rows', 'Back', ARRAY['Biceps', 'Rear Delts'], 'compound', 'T-Bar', 'Thick grip rowing exercise', true),

-- Leg exercises
(gen_random_uuid(), NULL, 'Squats', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Barbell', 'King of leg exercises', true),
(gen_random_uuid(), NULL, 'Romanian Deadlift', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], 'compound', 'Barbell', 'Hip hinge movement', true),
(gen_random_uuid(), NULL, 'Leg Press', 'Quadriceps', ARRAY['Glutes'], 'compound', 'Leg Press Machine', 'Machine-based leg exercise', true),
(gen_random_uuid(), NULL, 'Walking Lunges', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Dumbbells', 'Unilateral leg exercise', true),
(gen_random_uuid(), NULL, 'Leg Curls', 'Hamstrings', ARRAY[]::TEXT[], 'isolation', 'Machine', 'Hamstring isolation', true),
(gen_random_uuid(), NULL, 'Calf Raises', 'Calves', ARRAY[]::TEXT[], 'isolation', 'Machine', 'Calf isolation exercise', true),

-- Shoulder exercises
(gen_random_uuid(), NULL, 'Overhead Press', 'Shoulders', ARRAY['Triceps'], 'compound', 'Barbell', 'Standing shoulder press', true),
(gen_random_uuid(), NULL, 'Dumbbell Shoulder Press', 'Shoulders', ARRAY['Triceps'], 'compound', 'Dumbbells', 'Seated or standing dumbbell press', true),
(gen_random_uuid(), NULL, 'Lateral Raises', 'Shoulders', ARRAY[]::TEXT[], 'isolation', 'Dumbbells', 'Side deltoid isolation', true),
(gen_random_uuid(), NULL, 'Rear Delt Flyes', 'Shoulders', ARRAY[]::TEXT[], 'isolation', 'Dumbbells', 'Rear deltoid isolation', true),
(gen_random_uuid(), NULL, 'Face Pulls', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Cable Machine', 'Rear delt and upper back', true),

-- Arm exercises
(gen_random_uuid(), NULL, 'Barbell Curls', 'Biceps', ARRAY[]::TEXT[], 'isolation', 'Barbell', 'Classic bicep exercise', true),
(gen_random_uuid(), NULL, 'Hammer Curls', 'Biceps', ARRAY['Forearms'], 'isolation', 'Dumbbells', 'Neutral grip curls', true),
(gen_random_uuid(), NULL, 'Tricep Dips', 'Triceps', ARRAY[]::TEXT[], 'compound', 'Dip Station', 'Bodyweight tricep exercise', true),
(gen_random_uuid(), NULL, 'Close-Grip Bench Press', 'Triceps', ARRAY['Chest'], 'compound', 'Barbell', 'Tricep-focused bench press', true),
(gen_random_uuid(), NULL, 'Tricep Pushdowns', 'Triceps', ARRAY[]::TEXT[], 'isolation', 'Cable Machine', 'Cable tricep isolation', true),

-- Core exercises
(gen_random_uuid(), NULL, 'Plank', 'Core', ARRAY[]::TEXT[], 'isolation', 'Bodyweight', 'Isometric core exercise', true),
(gen_random_uuid(), NULL, 'Crunches', 'Core', ARRAY[]::TEXT[], 'isolation', 'Bodyweight', 'Basic abdominal exercise', true),
(gen_random_uuid(), NULL, 'Russian Twists', 'Core', ARRAY[]::TEXT[], 'isolation', 'Bodyweight', 'Rotational core exercise', true),
(gen_random_uuid(), NULL, 'Hanging Leg Raises', 'Core', ARRAY[]::TEXT[], 'isolation', 'Pull-up Bar', 'Advanced core exercise', true),
(gen_random_uuid(), NULL, 'Dead Bug', 'Core', ARRAY[]::TEXT[], 'isolation', 'Bodyweight', 'Core stability exercise', true);
