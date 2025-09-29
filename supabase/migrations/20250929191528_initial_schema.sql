-- Initial schema setup

-- Create custom types
CREATE TYPE exercise_type AS ENUM ('compound', 'isolation');
CREATE TYPE workout_status AS ENUM ('pending', 'completed', 'skipped');
CREATE TYPE recurrence_frequency AS ENUM ('daily', 'weekly', 'custom');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_muscle_group TEXT NOT NULL,
  secondary_muscle_groups TEXT[] DEFAULT '{}',
  exercise_type exercise_type NOT NULL,
  equipment TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT FALSE, -- true for pre-populated exercises
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Create workout_exercises table (junction table with order and targets)
CREATE TABLE workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps TEXT DEFAULT '8-12', -- flexible format like "8-12" or "15"
  rest_time INTEGER DEFAULT 60, -- seconds
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_sessions table
CREATE TABLE workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER, -- minutes
  overall_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_exercises table
CREATE TABLE session_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise_sets table
CREATE TABLE exercise_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_exercise_id UUID REFERENCES session_exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(6,2), -- allows weights up to 9999.99
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  completed BOOLEAN DEFAULT TRUE,
  rest_duration INTEGER, -- actual rest time in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_workouts table
CREATE TABLE scheduled_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notification_time TIME DEFAULT '08:00:00',
  status workout_status DEFAULT 'pending',
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recurrence_rules table
CREATE TABLE recurrence_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_workout_id UUID REFERENCES scheduled_workouts(id) ON DELETE CASCADE NOT NULL,
  frequency recurrence_frequency NOT NULL,
  interval_value INTEGER DEFAULT 1, -- every X days/weeks
  days_of_week INTEGER[] DEFAULT '{}', -- 0=Sunday, 1=Monday, etc.
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_muscle_group ON exercises(primary_muscle_group);
CREATE INDEX idx_exercises_is_system ON exercises(is_system);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(workout_id, order_index);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX idx_exercise_sets_session_exercise_id ON exercise_sets(session_exercise_id);
CREATE INDEX idx_scheduled_workouts_user_id ON scheduled_workouts(user_id);
CREATE INDEX idx_scheduled_workouts_date ON scheduled_workouts(scheduled_date);
CREATE INDEX idx_scheduled_workouts_status ON scheduled_workouts(status);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurrence_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Exercises policies
CREATE POLICY "Users can view own exercises and system exercises" ON exercises 
  FOR SELECT USING (auth.uid() = user_id OR is_system = true);
CREATE POLICY "Users can create own exercises" ON exercises 
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);
CREATE POLICY "Users can update own exercises" ON exercises 
  FOR UPDATE USING (auth.uid() = user_id AND is_system = false);
CREATE POLICY "Users can delete own exercises" ON exercises 
  FOR DELETE USING (auth.uid() = user_id AND is_system = false);

-- Workouts policies
CREATE POLICY "Users can manage own workouts" ON workouts 
  FOR ALL USING (auth.uid() = user_id);

-- Workout exercises policies
CREATE POLICY "Users can manage workout exercises for own workouts" ON workout_exercises 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Workout sessions policies
CREATE POLICY "Users can manage own workout sessions" ON workout_sessions 
  FOR ALL USING (auth.uid() = user_id);

-- Session exercises policies
CREATE POLICY "Users can manage session exercises for own sessions" ON session_exercises 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = session_exercises.session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Exercise sets policies
CREATE POLICY "Users can manage exercise sets for own sessions" ON exercise_sets 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM session_exercises 
      JOIN workout_sessions ON workout_sessions.id = session_exercises.session_id
      WHERE session_exercises.id = exercise_sets.session_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Scheduled workouts policies
CREATE POLICY "Users can manage own scheduled workouts" ON scheduled_workouts 
  FOR ALL USING (auth.uid() = user_id);

-- Recurrence rules policies
CREATE POLICY "Users can manage recurrence rules for own scheduled workouts" ON recurrence_rules 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scheduled_workouts 
      WHERE scheduled_workouts.id = recurrence_rules.scheduled_workout_id 
      AND scheduled_workouts.user_id = auth.uid()
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_workouts_updated_at BEFORE UPDATE ON scheduled_workouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
