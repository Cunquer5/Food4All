// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ursnognoqhhxgiekywpw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyc25vZ25vcWhoeGdpZWt5d3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTI0NjgsImV4cCI6MjA1ODQ4ODQ2OH0.ROr93muJaz2C4UO5by9_jOqM_IQklQ8NDCa-nePuzaY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);