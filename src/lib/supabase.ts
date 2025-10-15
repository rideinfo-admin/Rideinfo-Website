import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Institute = {
  id: string;
  name: string;
  user_id: string;
  address: string;
  contact_number: string;
  email: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type Driver = {
  id: string;
  name: string;
  bus_number: string;
  institute_id: string;
  user_id: string;
  contact_number: string;
  email: string;
  license_number: string;
  address: string;
  emergency_contact: string;
  blood_group: string;
  joining_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};
