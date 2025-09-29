-- Clear existing system exercises and insert updated ones
DELETE FROM exercises WHERE is_system = true;

-- Insert updated system exercises
INSERT INTO exercises (id, user_id, name, primary_muscle_group, secondary_muscle_groups, exercise_type, equipment, notes, is_system) VALUES

-- Upper Body - Arms
(gen_random_uuid(), NULL, 'Dumbbell Bicep Curls', 'Biceps', ARRAY[]::TEXT[], 'isolation', 'Dumbbells', 'Classic bicep isolation exercise', true),
(gen_random_uuid(), NULL, 'Hammer Curls', 'Biceps', ARRAY['Forearms'], 'isolation', 'Dumbbells', 'Neutral grip curls targeting biceps and forearms', true),
(gen_random_uuid(), NULL, 'Compound Curls', 'Biceps', ARRAY['Forearms'], 'isolation', 'Dumbbells', 'Multi-angle bicep curl variation', true),
(gen_random_uuid(), NULL, 'Assisted Tricep Dips', 'Triceps', ARRAY['Shoulders'], 'compound', 'Assisted Dip Machine', 'Machine-assisted tricep dips', true),

-- Upper Body - Chest & Back
(gen_random_uuid(), NULL, 'Dumbbell Chest Press', 'Chest', ARRAY['Shoulders', 'Triceps'], 'compound', 'Dumbbells', 'Dumbbell chest press exercise', true),
(gen_random_uuid(), NULL, 'Machine Rows', 'Back', ARRAY['Biceps', 'Rear Delts'], 'compound', 'Cable Machine', 'Seated cable rowing exercise', true),
(gen_random_uuid(), NULL, 'Lat Pull Down', 'Back', ARRAY['Biceps'], 'compound', 'Cable Machine', 'Vertical pulling movement for lats', true),
(gen_random_uuid(), NULL, 'Assisted Chin Ups', 'Back', ARRAY['Biceps'], 'compound', 'Assisted Pull-up Machine', 'Machine-assisted chin ups', true),
(gen_random_uuid(), NULL, 'Bent Over Rows', 'Back', ARRAY['Biceps', 'Rear Delts'], 'compound', 'Dumbbells', 'Bent over dumbbell rowing exercise', true),

-- Upper Body - Shoulders
(gen_random_uuid(), NULL, 'I''s Dumbbell', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Dumbbells', 'Dumbbell I-raise for rear deltoids', true),
(gen_random_uuid(), NULL, 'T''s Dumbbell', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Dumbbells', 'Dumbbell T-raise for middle deltoids', true),
(gen_random_uuid(), NULL, 'Y''s Dumbbell', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Dumbbells', 'Dumbbell Y-raise for front deltoids', true),
(gen_random_uuid(), NULL, 'Crucifix Cable Pulls', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Cable Machine', 'Cable rear delt flyes', true),

-- Lower Body - Hamstrings & Glutes
(gen_random_uuid(), NULL, 'RDLs', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], 'compound', 'Dumbbells', 'Romanian deadlifts for hamstrings', true),
(gen_random_uuid(), NULL, 'Hip Thrusts', 'Glutes', ARRAY['Hamstrings'], 'compound', 'Barbell', 'Hip thrust exercise for glutes', true),
(gen_random_uuid(), NULL, 'Back Extension', 'Lower Back', ARRAY['Glutes', 'Hamstrings'], 'isolation', 'Back Extension Machine', 'Lower back extension exercise', true),

-- Lower Body - Quadriceps & General
(gen_random_uuid(), NULL, 'Leg Press', 'Quadriceps', ARRAY['Glutes'], 'compound', 'Leg Press Machine', 'Machine-based leg exercise', true),
(gen_random_uuid(), NULL, 'Smith Machine Squat', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Smith Machine', 'Guided squat movement', true),
(gen_random_uuid(), NULL, 'Bulgarian Split Squat', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Dumbbells', 'Single-leg squat variation', true),
(gen_random_uuid(), NULL, 'Split Squat', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Dumbbells', 'Stationary lunge position squat', true),
(gen_random_uuid(), NULL, 'Sumo Squat', 'Quadriceps', ARRAY['Glutes', 'Inner Thighs'], 'compound', 'Dumbbells', 'Wide stance squat variation', true);
