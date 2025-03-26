
import React, { createContext, useContext, useState } from 'react';
import { User } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setTempUserType: (type: 'donor' | 'ngo') => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: true, // Default to authenticated
  setTempUserType: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to set temporary user type without actual authentication
  const setTempUserType = (type: 'donor' | 'ngo') => {
    const mockUser: User = {
      id: `temp-${Math.random().toString(36).substring(2, 9)}`,
      email: `temp-${type}@example.com`,
      created_at: new Date().toISOString(),
      full_name: `Temporary ${type === 'donor' ? 'Donor' : 'Organization'}`,
      user_type: type,
    };
    
    setUser(mockUser);
    // Store in localStorage to persist through page refreshes
    localStorage.setItem('tempUser', JSON.stringify(mockUser));
  };

  // Mock refreshUser that would normally fetch from Supabase
  const refreshUser = async () => {
    try {
      // Check if we have a temp user in localStorage
      const tempUserString = localStorage.getItem('tempUser');
      if (tempUserString) {
        const tempUser = JSON.parse(tempUserString);
        setUser(tempUser as User);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize from localStorage if available
  React.useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: true, // Always authenticated for now
      setTempUserType,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
