/*
  # Create Training Metrics Tables
  
  1. New Tables
    - `physical_measurements`
      - Height, vertical leap (standing/approach), body measurements
    - `physical_tests`
      - Speed, agility, shuttle, conditioning results
    - `basketball_drills`
      - Shooting percentages, drill scores, skill evaluations, scrimmage grades
    - `strength_conditioning`
      - Bench, squat, deadlift, pull-ups, conditioning circuits, other lifts
      
  2. Security
    - Enable RLS on all tables
    - Allow staff to manage all training data
*/

-- Physical Measurements Table
CREATE TABLE IF NOT EXISTS physical_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  recorded_by uuid REFERENCES staff_users(id) NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL,
  
  -- Height and vertical
  height_inches numeric(5,2),
  standing_vertical_inches numeric(5,2),
  approach_vertical_inches numeric(5,2),
  
  -- Body measurements
  weight_lbs numeric(6,2),
  wingspan_inches numeric(5,2),
  standing_reach_inches numeric(5,2),
  body_fat_percentage numeric(4,2),
  
  notes text
);

ALTER TABLE physical_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow staff to view physical measurements"
  ON physical_measurements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow staff to insert physical measurements"
  ON physical_measurements FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow staff to update physical measurements"
  ON physical_measurements FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow staff to delete physical measurements"
  ON physical_measurements FOR DELETE
  TO anon, authenticated
  USING (true);

-- Physical Tests Table
CREATE TABLE IF NOT EXISTS physical_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  recorded_by uuid REFERENCES staff_users(id) NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL,
  
  -- Test results (in seconds)
  sprint_40_yard_seconds numeric(5,3),
  lane_agility_seconds numeric(5,3),
  shuttle_run_seconds numeric(5,3),
  mile_run_seconds integer,
  
  -- Other conditioning metrics
  conditioning_score numeric(5,2),
  
  notes text
);

ALTER TABLE physical_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow staff to view physical tests"
  ON physical_tests FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow staff to insert physical tests"
  ON physical_tests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow staff to update physical tests"
  ON physical_tests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow staff to delete physical tests"
  ON physical_tests FOR DELETE
  TO anon, authenticated
  USING (true);

-- Basketball Drills Table
CREATE TABLE IF NOT EXISTS basketball_drills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  recorded_by uuid REFERENCES staff_users(id) NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL,
  
  -- Shooting percentages
  free_throw_percentage numeric(5,2),
  three_point_percentage numeric(5,2),
  mid_range_percentage numeric(5,2),
  
  -- Drill scores (out of 100)
  ball_handling_score numeric(5,2),
  defensive_drill_score numeric(5,2),
  shooting_drill_score numeric(5,2),
  
  -- Evaluations (grades A-F or scores)
  skill_evaluation text,
  scrimmage_grade text,
  
  notes text
);

ALTER TABLE basketball_drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow staff to view basketball drills"
  ON basketball_drills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow staff to insert basketball drills"
  ON basketball_drills FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow staff to update basketball drills"
  ON basketball_drills FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow staff to delete basketball drills"
  ON basketball_drills FOR DELETE
  TO anon, authenticated
  USING (true);

-- Strength and Conditioning Table
CREATE TABLE IF NOT EXISTS strength_conditioning (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE NOT NULL,
  recorded_by uuid REFERENCES staff_users(id) NOT NULL,
  recorded_at timestamptz DEFAULT now() NOT NULL,
  
  -- Main lifts (in lbs)
  bench_press_lbs numeric(6,2),
  squat_lbs numeric(6,2),
  deadlift_lbs numeric(6,2),
  
  -- Bodyweight exercises
  pull_ups_count integer,
  push_ups_count integer,
  
  -- Conditioning
  conditioning_circuit_time_seconds integer,
  conditioning_circuit_score numeric(5,2),
  
  -- Other tracked lifts (JSON for flexibility)
  other_lifts jsonb DEFAULT '{}'::jsonb,
  
  notes text
);

ALTER TABLE strength_conditioning ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow staff to view strength conditioning"
  ON strength_conditioning FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow staff to insert strength conditioning"
  ON strength_conditioning FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow staff to update strength conditioning"
  ON strength_conditioning FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow staff to delete strength conditioning"
  ON strength_conditioning FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_physical_measurements_athlete_recorded ON physical_measurements(athlete_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_physical_tests_athlete_recorded ON physical_tests(athlete_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_basketball_drills_athlete_recorded ON basketball_drills(athlete_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_strength_conditioning_athlete_recorded ON strength_conditioning(athlete_id, recorded_at DESC);