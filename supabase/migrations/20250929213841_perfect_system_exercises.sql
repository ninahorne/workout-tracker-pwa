-- Clear existing system exercises and insert perfected ones
DELETE FROM exercises WHERE is_system = true;

-- Insert perfected system exercises
INSERT INTO exercises (id, user_id, name, primary_muscle_group, secondary_muscle_groups, exercise_type, equipment, notes, is_system) VALUES

-- Upper Body - Arms (Biceps)
(gen_random_uuid(), NULL, 'Dumbbell Bicep Curls', 'Biceps', ARRAY[]::TEXT[], 'isolation', 'Dumbbells', 'Classic bicep isolation exercise', true),
(gen_random_uuid(), NULL, 'Hammer Curls', 'Biceps', ARRAY['Forearms'], 'isolation', 'Dumbbells', 'Neutral grip curls targeting biceps and forearms', true),
(gen_random_uuid(), NULL, 'Compound Curls', 'Biceps', ARRAY['Forearms'], 'isolation', 'Dumbbells', 'Multi-angle bicep curl variation', true),
(gen_random_uuid(), NULL, 'Machine Bicep Curl', 'Biceps', ARRAY['Forearms'], 'isolation', 'Preacher Curl Machine', 'Preacher machine bicep curls for constant tension', true),

-- Upper Body - Arms (Triceps)
(gen_random_uuid(), NULL, 'Assisted Tricep Dips', 'Triceps', ARRAY['Shoulders'], 'compound', 'Assisted Dip Machine', 'Machine-assisted tricep dips', true),
(gen_random_uuid(), NULL, 'Cable Tricep Push Downs', 'Triceps', ARRAY[]::TEXT[], 'isolation', 'Cable Machine', 'Cable tricep pushdowns for tricep isolation', true),

-- Upper Body - Chest
(gen_random_uuid(), NULL, 'Dumbbell Chest Press', 'Chest', ARRAY['Shoulders', 'Triceps'], 'compound', 'Dumbbells', 'Dumbbell chest press exercise', true),
(gen_random_uuid(), NULL, 'Cable Chest Flyes', 'Chest', ARRAY['Shoulders'], 'isolation', 'Cable Machine', 'Cable chest flyes for chest isolation', true),
(gen_random_uuid(), NULL, 'Dumbbell Chest Flyes', 'Chest', ARRAY['Shoulders'], 'isolation', 'Dumbbells', 'Dumbell chest flyes for chest isolation', true),

-- Upper Body - Back
(gen_random_uuid(), NULL, 'Machine Rows', 'Back', ARRAY['Biceps', 'Rear Delts'], 'compound', 'Cable Machine', 'Seated cable rowing exercise', true),
(gen_random_uuid(), NULL, 'Lat Pull Down', 'Back', ARRAY['Biceps'], 'compound', 'Cable Machine', 'Vertical pulling movement for lats', true),
(gen_random_uuid(), NULL, 'Assisted Chin Ups', 'Back', ARRAY['Biceps'], 'compound', 'Assisted Pull-up Machine', 'Machine-assisted chin ups', true),
(gen_random_uuid(), NULL, 'Bent Over Rows', 'Back', ARRAY['Biceps', 'Rear Delts'], 'compound', 'Dumbbells', 'Bent over dumbbell rowing exercise', true),

-- Upper Body - Shoulders
(gen_random_uuid(), NULL, 'Y''s Dumbbell Incline', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Dumbbells', 'Incline bench Y-raise for front deltoids', true),
(gen_random_uuid(), NULL, 'I''s, T''s, Y''s Standing', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Dumbbells', 'Combined I, T, Y raises performed standing', true),
(gen_random_uuid(), NULL, 'Crucifix Cable Pulls', 'Shoulders', ARRAY['Upper Back'], 'isolation', 'Cable Machine', 'Cable rear delt flyes', true),
(gen_random_uuid(), NULL, 'Lateral Raises', 'Shoulders', ARRAY[]::TEXT[], 'isolation', 'Dumbbells', 'Dumbbell lateral raises for side deltoids', true),

-- Lower Body - Hamstrings & Glutes
(gen_random_uuid(), NULL, 'RDLs', 'Hamstrings', ARRAY['Hamstrings', 'Lower Back'], 'compound', 'Barbell', 'Barbell RDLs for hamstrings and glutes', true),
(gen_random_uuid(), NULL, 'Hamstring Curls', 'Hamstrings', ARRAY[]::TEXT[], 'isolation', 'Machine', 'Machine hamstring curls for isolated hamstring work', true),

(gen_random_uuid(), NULL, 'Hip Thrusts', 'Glutes', ARRAY['Hamstrings'], 'compound', 'Barbell', 'Hip thrust exercise for glutes', true),
(gen_random_uuid(), NULL, 'Bulgarian Split Squat', 'Glutes', ARRAY['Quadriceps', 'Hamstrings'], 'compound', 'Dumbbells', 'Single-leg squat variation focusing on glutes', true),

-- Lower Body - Lower Back
(gen_random_uuid(), NULL, 'Back Extension', 'Lower Back', ARRAY['Glutes', 'Hamstrings'], 'isolation', 'Back Extension Machine', 'Lower back extension exercise', true),
(gen_random_uuid(), NULL, 'Barbell Deadlifts', 'Lower Back', ARRAY['Hamstrings', 'Glutes'], 'compound', 'Barbell', 'Traditional barbell deadlifts for lower back strength', true),

-- Lower Body - Quadriceps
(gen_random_uuid(), NULL, 'Leg Press', 'Quadriceps', ARRAY['Glutes'], 'compound', 'Leg Press Machine', 'Machine-based leg exercise', true),
(gen_random_uuid(), NULL, 'Smith Machine Squat', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Smith Machine', 'Guided squat movement', true),
(gen_random_uuid(), NULL, 'Sumo Squat', 'Quadriceps', ARRAY['Glutes', 'Inner Thighs'], 'compound', 'Dumbbells', 'Wide stance squat variation', true),
(gen_random_uuid(), NULL, 'Leg Extension', 'Quadriceps', ARRAY[]::TEXT[], 'isolation', 'Machine', 'Machine leg extensions for quadriceps isolation', true);

(gen_random_uuid(), NULL, 'Split Squat', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'compound', 'Dumbbells', 'Stationary lunge position squat', true),