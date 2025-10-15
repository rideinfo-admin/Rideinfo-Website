/*
  # Add Detailed Fields to Schema
  
  1. Changes to institutes table
    - `address` (text) - Institute address
    - `contact_number` (text) - Contact phone number
    - `email` (text) - Institute email
    - `city` (text) - City location
    - `state` (text) - State location
    
  2. Changes to drivers table
    - `contact_number` (text) - Driver phone number
    - `email` (text) - Driver email
    - `license_number` (text) - Driving license number
    - `address` (text) - Driver address
    - `emergency_contact` (text) - Emergency contact number
    - `blood_group` (text) - Blood group
    - `joining_date` (date) - Date of joining
    - `status` (text) - Active/Inactive status
    
  3. Important Notes
    - All new fields are optional to maintain backward compatibility
    - Default status for drivers is 'active'
*/

-- Add new columns to institutes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutes' AND column_name = 'address'
  ) THEN
    ALTER TABLE institutes ADD COLUMN address text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutes' AND column_name = 'contact_number'
  ) THEN
    ALTER TABLE institutes ADD COLUMN contact_number text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutes' AND column_name = 'email'
  ) THEN
    ALTER TABLE institutes ADD COLUMN email text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutes' AND column_name = 'city'
  ) THEN
    ALTER TABLE institutes ADD COLUMN city text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'institutes' AND column_name = 'state'
  ) THEN
    ALTER TABLE institutes ADD COLUMN state text DEFAULT '';
  END IF;
END $$;

-- Add new columns to drivers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'contact_number'
  ) THEN
    ALTER TABLE drivers ADD COLUMN contact_number text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'email'
  ) THEN
    ALTER TABLE drivers ADD COLUMN email text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'license_number'
  ) THEN
    ALTER TABLE drivers ADD COLUMN license_number text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'address'
  ) THEN
    ALTER TABLE drivers ADD COLUMN address text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'emergency_contact'
  ) THEN
    ALTER TABLE drivers ADD COLUMN emergency_contact text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'blood_group'
  ) THEN
    ALTER TABLE drivers ADD COLUMN blood_group text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'joining_date'
  ) THEN
    ALTER TABLE drivers ADD COLUMN joining_date date DEFAULT CURRENT_DATE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'status'
  ) THEN
    ALTER TABLE drivers ADD COLUMN status text DEFAULT 'active';
  END IF;
END $$;