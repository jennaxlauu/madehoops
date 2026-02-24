import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StaffUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'Admin' | 'Athlete Check-In Management' | 'Trainer';
  created_at: string;
};
