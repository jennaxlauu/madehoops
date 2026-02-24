/*
  # Add Athlete Fields and Support for Data Import
  
  1. Changes
    - Add phone, email, and other contact fields to athletes table
    - Add tier field for membership tiers
    - Add indexes for performance
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add missing fields to athletes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'email'
  ) THEN
    ALTER TABLE athletes ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'phone'
  ) THEN
    ALTER TABLE athletes ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE athletes ADD COLUMN date_of_birth date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'age'
  ) THEN
    ALTER TABLE athletes ADD COLUMN age integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'tier'
  ) THEN
    ALTER TABLE athletes ADD COLUMN tier text DEFAULT 'standard';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'membership'
  ) THEN
    ALTER TABLE athletes ADD COLUMN membership text;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_check_ins_athlete_id ON check_ins(athlete_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_check_in_time ON check_ins(check_in_time);
CREATE INDEX IF NOT EXISTS idx_athletes_email ON athletes(email);
CREATE INDEX IF NOT EXISTS idx_athletes_phone ON athletes(phone);