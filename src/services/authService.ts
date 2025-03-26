
import { supabase, User } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type AuthFormData = {
  email: string;
  password: string;
  full_name?: string;
  user_type?: 'donor' | 'ngo';
};

export const signUp = async (formData: AuthFormData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          user_type: formData.user_type,
        },
      },
    });

    if (error) {
      throw error;
    }

    toast({
      title: 'Account created!',
      description: 'Please check your email to confirm your account',
    });

    return data;
  } catch (error: any) {
    toast({
      title: 'Error creating account',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const signIn = async (formData: { email: string; password: string }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      throw error;
    }

    toast({
      title: 'Welcome back!',
      description: 'You have successfully logged in',
    });

    return data;
  } catch (error: any) {
    toast({
      title: 'Error signing in',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out',
    });
  } catch (error: any) {
    toast({
      title: 'Error signing out',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    return data as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (profile: Partial<User>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
    });
    
    return data as User;
  } catch (error: any) {
    toast({
      title: 'Error updating profile',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};
