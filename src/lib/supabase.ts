
import { createClient } from '@supabase/supabase-js';
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// Use the Supabase client from the integrations folder
export const supabase = integrationSupabase;

// Type definitions for our database tables
export type User = {
  id: string;
  email: string;
  created_at: string;
  full_name: string;
  avatar_url?: string;
  user_type: 'donor' | 'ngo';
  address?: string;
  phone?: string;
  description?: string;
};

export type FoodDonation = {
  id: string;
  created_at: string;
  donor_id: string;
  title: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  food_type: string;
  expiry_date: string;
  location: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  status: 'available' | 'claimed' | 'collected' | 'expired';
};

export type DonationClaim = {
  id: string;
  created_at: string;
  donation_id: string;
  ngo_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'collected';
  pickup_time?: string;
  notes?: string;
};

export type Message = {
  id: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  donation_id?: string;
  content: string;
  read: boolean;
};
