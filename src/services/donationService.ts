import { supabase, FoodDonation, DonationClaim } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const createDonation = async (donation: Omit<FoodDonation, 'id' | 'created_at' | 'status'>, imageFile?: File) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Upload image if provided
    let image_url = undefined;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `donations/${donation.donor_id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('food-images')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase
        .storage
        .from('food-images')
        .getPublicUrl(filePath);
        
      image_url = data.publicUrl;
    }
    
    const { data, error } = await supabase
      .from('donations')
      .insert({
        ...donation,
        status: 'available',
        image_url
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Donation created',
      description: 'Your food donation has been successfully posted',
    });
    
    return data as FoodDonation;
  } catch (error: any) {
    toast({
      title: 'Error creating donation',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const getDonations = async (filters?: { 
  status?: FoodDonation['status'], 
  donor_id?: string,
  food_type?: string,
  search?: string
}) => {
  try {
    // For temporary users (with IDs starting with 'temp-'), return mock data
    if (filters?.donor_id && filters.donor_id.startsWith('temp-')) {
      return mockDonationsForTemporaryUsers(filters.donor_id);
    }
    
    let query = supabase
      .from('donations')
      .select('*, profiles:donor_id(full_name, avatar_url)');
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.donor_id && !filters.donor_id.startsWith('temp-')) {
      query = query.eq('donor_id', filters.donor_id);
    }
    
    if (filters?.food_type) {
      query = query.eq('food_type', filters.food_type);
    }
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as (FoodDonation & { profiles: { full_name: string; avatar_url?: string } })[];
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

const mockDonationsForTemporaryUsers = (userId: string) => {
  // Create some example donations for demonstration purposes
  const mockDonations = [];
  
  // Only add mock donations if this is a donor
  if (userId.includes('donor')) {
    mockDonations.push({
      id: `mock-${Math.random().toString(36).substring(2)}`,
      created_at: new Date().toISOString(),
      donor_id: userId,
      title: 'Fresh Vegetables',
      description: 'A variety of fresh vegetables from my garden.',
      quantity: 5,
      quantity_unit: 'kg',
      food_type: 'produce',
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: '123 Example Street',
      latitude: 40.7128,
      longitude: -74.0060,
      status: 'available',
      profiles: {
        full_name: 'Temporary Donor',
        avatar_url: null
      }
    });
  }
  
  return mockDonations;
};

export const getDonationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*, profiles:donor_id(full_name, avatar_url, phone, email)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as (FoodDonation & { 
      profiles: { 
        full_name: string; 
        avatar_url?: string;
        phone?: string;
        email: string;
      } 
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    return null;
  }
};

export const updateDonationStatus = async (id: string, status: FoodDonation['status']) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Check if user owns the donation
    const { data: donation } = await supabase
      .from('donations')
      .select('donor_id')
      .eq('id', id)
      .single();
      
    if (!donation) throw new Error('Donation not found');
    if (donation.donor_id !== user.id) throw new Error('You can only update your own donations');
    
    const { data, error } = await supabase
      .from('donations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Donation updated',
      description: `Donation status updated to ${status}`,
    });
    
    return data as FoodDonation;
  } catch (error: any) {
    toast({
      title: 'Error updating donation',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const claimDonation = async (donation_id: string, pickup_time?: string, notes?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Check user type is NGO
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();
      
    if (!profile || profile.user_type !== 'ngo') {
      throw new Error('Only NGOs can claim donations');
    }
    
    const { data, error } = await supabase
      .from('claims')
      .insert({
        donation_id,
        ngo_id: user.id,
        status: 'pending',
        pickup_time,
        notes
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Claim submitted',
      description: 'Your claim for this donation has been submitted',
    });
    
    return data as DonationClaim;
  } catch (error: any) {
    toast({
      title: 'Error claiming donation',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const getDonationClaims = async (donation_id: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Check if user owns the donation
    const { data: donation } = await supabase
      .from('donations')
      .select('donor_id')
      .eq('id', donation_id)
      .single();
      
    if (!donation) throw new Error('Donation not found');
    if (donation.donor_id !== user.id) throw new Error('You can only view claims for your donations');
    
    const { data, error } = await supabase
      .from('claims')
      .select('*, profiles:ngo_id(full_name, avatar_url, phone, email, description)')
      .eq('donation_id', donation_id);
      
    if (error) throw error;
    
    return data as (DonationClaim & { 
      profiles: { 
        full_name: string; 
        avatar_url?: string;
        phone?: string;
        email: string;
        description?: string;
      } 
    })[];
  } catch (error) {
    console.error('Error fetching claims:', error);
    return [];
  }
};

export const updateClaimStatus = async (claim_id: string, status: DonationClaim['status']) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Get claim and check if user owns the donation
    const { data: claim } = await supabase
      .from('claims')
      .select('donation_id')
      .eq('id', claim_id)
      .single();
      
    if (!claim) throw new Error('Claim not found');
    
    const { data: donation } = await supabase
      .from('donations')
      .select('donor_id')
      .eq('id', claim.donation_id)
      .single();
      
    if (!donation) throw new Error('Donation not found');
    if (donation.donor_id !== user.id) throw new Error('You can only update claims for your donations');
    
    const { data, error } = await supabase
      .from('claims')
      .update({ status })
      .eq('id', claim_id)
      .select()
      .single();
      
    if (error) throw error;
    
    // If claim is approved, update donation status to claimed
    if (status === 'approved') {
      await supabase
        .from('donations')
        .update({ status: 'claimed' })
        .eq('id', claim.donation_id);
    }
    
    toast({
      title: 'Claim updated',
      description: `Claim status updated to ${status}`,
    });
    
    return data as DonationClaim;
  } catch (error: any) {
    toast({
      title: 'Error updating claim',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};
