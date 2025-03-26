
import { supabase } from '@/lib/supabase';

export type DonationStats = {
  total_donations: number;
  available_donations: number;
  claimed_donations: number;
  collected_donations: number;
  total_food_quantity: number;
};

export type FoodTypeDistribution = {
  food_type: string;
  count: number;
};

export type TimeSeriesData = {
  date: string;
  donations: number;
};

export const getDonationStats = async (userId?: string): Promise<DonationStats> => {
  try {
    // Base query to get total donations
    let query = supabase.from('donations').select('*', { count: 'exact' });
    
    if (userId) {
      query = query.eq('donor_id', userId);
    }
    
    const { count: total_donations } = await query;
    
    // Get available donations count
    let availableQuery = supabase.from('donations').select('*', { count: 'exact' }).eq('status', 'available');
    if (userId) availableQuery = availableQuery.eq('donor_id', userId);
    const { count: available_donations } = await availableQuery;
    
    // Get claimed donations count
    let claimedQuery = supabase.from('donations').select('*', { count: 'exact' }).eq('status', 'claimed');
    if (userId) claimedQuery = claimedQuery.eq('donor_id', userId);
    const { count: claimed_donations } = await claimedQuery;
    
    // Get collected donations count
    let collectedQuery = supabase.from('donations').select('*', { count: 'exact' }).eq('status', 'collected');
    if (userId) collectedQuery = collectedQuery.eq('donor_id', userId);
    const { count: collected_donations } = await collectedQuery;
    
    // Get total food quantity
    let quantityQuery = supabase.from('donations').select('quantity');
    if (userId) quantityQuery = quantityQuery.eq('donor_id', userId);
    const { data: quantities } = await quantityQuery;
    
    const total_food_quantity = quantities 
      ? quantities.reduce((sum, item) => sum + (item.quantity || 0), 0) 
      : 0;
    
    return {
      total_donations: total_donations || 0,
      available_donations: available_donations || 0,
      claimed_donations: claimed_donations || 0,
      collected_donations: collected_donations || 0,
      total_food_quantity
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return {
      total_donations: 0,
      available_donations: 0,
      claimed_donations: 0,
      collected_donations: 0,
      total_food_quantity: 0
    };
  }
};

export const getFoodTypeDistribution = async (userId?: string): Promise<FoodTypeDistribution[]> => {
  try {
    let query = supabase
      .from('donations')
      .select('food_type');
      
    if (userId) {
      query = query.eq('donor_id', userId);
    }
    
    const { data } = await query;
    
    if (!data || data.length === 0) return [];
    
    // Count occurrences of each food type
    const foodTypeCounts: Record<string, number> = {};
    data.forEach(item => {
      const foodType = item.food_type;
      foodTypeCounts[foodType] = (foodTypeCounts[foodType] || 0) + 1;
    });
    
    // Convert to array of objects
    return Object.entries(foodTypeCounts).map(([food_type, count]) => ({
      food_type,
      count
    })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching food type distribution:', error);
    return [];
  }
};

export const getTimeSeriesData = async (userId?: string, days = 30): Promise<TimeSeriesData[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let query = supabase
      .from('donations')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
      
    if (userId) {
      query = query.eq('donor_id', userId);
    }
    
    const { data } = await query;
    
    if (!data || data.length === 0) return [];
    
    // Generate date range
    const dateRange: TimeSeriesData[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateRange.unshift({ date: dateStr, donations: 0 });
    }
    
    // Count donations per day
    data.forEach(item => {
      const dateStr = new Date(item.created_at).toISOString().split('T')[0];
      const dataPoint = dateRange.find(d => d.date === dateStr);
      if (dataPoint) {
        dataPoint.donations += 1;
      }
    });
    
    return dateRange;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return [];
  }
};

export const getNGOImpactStats = async (ngoId: string) => {
  try {
    // Get approved claims for this NGO
    const { data: claims } = await supabase
      .from('claims')
      .select('donation_id')
      .eq('ngo_id', ngoId)
      .in('status', ['approved', 'collected']);
      
    if (!claims || claims.length === 0) {
      return {
        donations_claimed: 0,
        total_food_quantity: 0,
        food_types: []
      };
    }
    
    const donationIds = claims.map(claim => claim.donation_id);
    
    // Get donations data
    const { data: donations } = await supabase
      .from('donations')
      .select('quantity, food_type')
      .in('id', donationIds);
      
    if (!donations) {
      return {
        donations_claimed: 0,
        total_food_quantity: 0,
        food_types: []
      };
    }
    
    // Calculate total quantity
    const total_food_quantity = donations.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // Count food types
    const foodTypeCounts: Record<string, number> = {};
    donations.forEach(item => {
      const foodType = item.food_type;
      foodTypeCounts[foodType] = (foodTypeCounts[foodType] || 0) + 1;
    });
    
    const food_types = Object.entries(foodTypeCounts).map(([food_type, count]) => ({
      food_type,
      count
    })).sort((a, b) => b.count - a.count);
    
    return {
      donations_claimed: donations.length,
      total_food_quantity,
      food_types
    };
  } catch (error) {
    console.error('Error fetching NGO impact stats:', error);
    return {
      donations_claimed: 0,
      total_food_quantity: 0,
      food_types: []
    };
  }
};
