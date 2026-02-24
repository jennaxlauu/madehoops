/*
  # Add Comprehensive Athlete Fields
  
  1. Changes
    - Add gender field
    - Add address field
    - Add emergency contact fields (name, email, phone)
    - Add shirt_size field
    - Add opted_in_to_marketing field
    - Add organization field
    
  2. Notes
    - All fields are nullable except those already required
    - Supports full athlete profile management
*/

-- Add gender field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'gender'
  ) THEN
    ALTER TABLE athletes ADD COLUMN gender text;
  END IF;
END $$;

-- Add address field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'address'
  ) THEN
    ALTER TABLE athletes ADD COLUMN address text;
  END IF;
END $$;

-- Add emergency contact fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'emergency_contact_name'
  ) THEN
    ALTER TABLE athletes ADD COLUMN emergency_contact_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'emergency_contact_email'
  ) THEN
    ALTER TABLE athletes ADD COLUMN emergency_contact_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'emergency_contact_phone'
  ) THEN
    ALTER TABLE athletes ADD COLUMN emergency_contact_phone text;
  END IF;
END $$;

-- Add shirt size field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'shirt_size'
  ) THEN
    ALTER TABLE athletes ADD COLUMN shirt_size text;
  END IF;
END $$;

-- Add opted in to marketing field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'opted_in_to_marketing'
  ) THEN
    ALTER TABLE athletes ADD COLUMN opted_in_to_marketing boolean DEFAULT false;
  END IF;
END $$;

-- Add organization field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athletes' AND column_name = 'organization'
  ) THEN
    ALTER TABLE athletes ADD COLUMN organization text;
  END IF;
END $$;
