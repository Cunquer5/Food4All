
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlurContainer from '@/components/ui/BlurContainer';
import { Building, Heart } from 'lucide-react';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { setTempUserType } = useAuth();

  const handleSelectionDonor = () => {
    setTempUserType('donor');
    navigate('/dashboard');
  };

  const handleSelectionNGO = () => {
    setTempUserType('ngo');
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-4xl">
          <BlurContainer className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold">How would you like to participate?</h1>
              <p className="text-muted-foreground mt-3">
                Choose your role in reducing food waste and fighting hunger.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-foodall-teal to-green-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  onClick={handleSelectionDonor}
                  className="relative flex flex-col items-center p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <Heart className="h-8 w-8 text-foodall-teal" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Food Donor</h2>
                  <p className="text-muted-foreground text-center">
                    Share your excess food and help reduce waste.
                    As a donor, you can post available food items for collection.
                  </p>
                </button>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-foodall-teal rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  onClick={handleSelectionNGO}
                  className="relative flex flex-col items-center p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                    <Building className="h-8 w-8 text-foodall-teal" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">NGO / Charity</h2>
                  <p className="text-muted-foreground text-center">
                    Connect with donors and collect food for those in need.
                    Find available donations and arrange pickups.
                  </p>
                </button>
              </div>
            </div>
          </BlurContainer>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserTypeSelection;
