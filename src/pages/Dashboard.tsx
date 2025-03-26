
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlurContainer from '@/components/ui/BlurContainer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Clock, MapPin, BarChart3, Plus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import DonationForm from '@/components/donations/DonationForm';
import { getDonations } from '@/services/donationService';
import { FoodDonation } from '@/lib/supabase';
import DonationCard from '@/components/donations/DonationCard';
import MessagesInbox from '@/components/messaging/MessagesInbox';
import { getUnreadMessageCount } from '@/services/messageService';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user } = useAuth();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [userDonations, setUserDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const isDonor = user?.user_type === 'donor';

  useEffect(() => {
    const loadDonations = async () => {
      setIsLoading(true);
      try {
        // Load available donations for NGOs
        let availableDonations: any[] = [];
        if (!isDonor) {
          availableDonations = await getDonations({ status: 'available' });
        }
        
        // Load user's donations for donors
        let myDonations: any[] = [];
        if (user?.id) {
          myDonations = await getDonations({ donor_id: user.id });
        }
        
        setDonations(availableDonations);
        setUserDonations(myDonations);
      } catch (error) {
        console.error('Error loading donations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadMessageCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };
    
    loadDonations();
    loadUnreadCount();
    
    // Reload data every 30 seconds
    const interval = setInterval(() => {
      loadDonations();
      loadUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user, isDonor]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              {isDonor 
                ? 'Manage your donations and track your impact' 
                : 'Find available donations and connect with donors'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <BlurContainer className="p-6 flex items-center">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 mr-4">
                <Package size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userDonations.length}</div>
                <div className="text-sm text-muted-foreground">
                  {isDonor ? 'Your Donations' : 'Available Donations'}
                </div>
              </div>
            </BlurContainer>
            
            <BlurContainer className="p-6 flex items-center">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 mr-4">
                <Clock size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {userDonations.filter(d => d.status === 'claimed').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isDonor ? 'Claimed Donations' : 'Pending Pickups'}
                </div>
              </div>
            </BlurContainer>
            
            <BlurContainer className="p-6 flex items-center">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 mr-4">
                <MapPin size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">
                  {isDonor ? 'Nearby NGOs' : 'Service Areas'}
                </div>
              </div>
            </BlurContainer>
            
            <BlurContainer className="p-6 flex items-center">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 mr-4">
                <BarChart3 size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {userDonations.filter(d => d.status === 'collected').length * 10}kg
                </div>
                <div className="text-sm text-muted-foreground">Food Saved</div>
              </div>
            </BlurContainer>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isDonor ? 'Manage Donations' : 'Available Donations'}
            </h2>
            {isDonor && (
              <Button 
                className="bg-foodall-teal hover:bg-foodall-teal/90 text-white"
                onClick={() => setShowDonationForm(true)}
              >
                <Plus size={16} className="mr-2" />
                New Donation
              </Button>
            )}
          </div>

          <Tabs defaultValue="donations" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="donations">
                {isDonor ? 'Your Donations' : 'Available Donations'}
              </TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                Messages
                {unreadCount > 0 && (
                  <Badge variant="default" className="ml-2 bg-foodall-teal hover:bg-foodall-teal/90">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              {isDonor && (
                <TabsTrigger value="requests">Pickup Requests</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="donations">
              {isLoading ? (
                <BlurContainer className="p-8 text-center">
                  <p className="text-muted-foreground">Loading donations...</p>
                </BlurContainer>
              ) : isDonor ? (
                userDonations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userDonations.map((donation) => (
                      <DonationCard key={donation.id} donation={donation} />
                    ))}
                  </div>
                ) : (
                  <BlurContainer>
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">You have no donations yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setShowDonationForm(true)}
                      >
                        <Plus size={16} className="mr-2" />
                        Create Your First Donation
                      </Button>
                    </div>
                  </BlurContainer>
                )
              ) : (
                donations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((donation) => (
                      <DonationCard key={donation.id} donation={donation} />
                    ))}
                  </div>
                ) : (
                  <BlurContainer>
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No available donations at the moment.</p>
                      <p className="text-sm mt-2">
                        Check back later or refresh the page to see new donations.
                      </p>
                    </div>
                  </BlurContainer>
                )
              )}
            </TabsContent>
            
            <TabsContent value="messages">
              <MessagesInbox />
            </TabsContent>
            
            <TabsContent value="requests">
              <BlurContainer>
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">You have no pickup requests at the moment.</p>
                </div>
              </BlurContainer>
            </TabsContent>
          </Tabs>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Impact Visualization</h2>
            <BlurContainer className="p-6">
              <div className="aspect-[2/1] bg-gradient-to-r from-foodall-blue/40 via-foodall-green/30 to-foodall-cyan/40 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Impact metrics visualization will appear here</p>
              </div>
            </BlurContainer>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6">Nearby NGOs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <BlurContainer key={item} className="p-6">
                  <h3 className="font-medium mb-2">Community Food Bank #{item}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    123 Main Street, City, Country
                  </p>
                  <div className="flex justify-between">
                    <span className="text-sm">2.3 miles away</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 text-foodall-teal hover:text-foodall-teal/90"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </BlurContainer>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Donation Form Dialog */}
      <Dialog open={showDonationForm} onOpenChange={setShowDonationForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Donation</DialogTitle>
          </DialogHeader>
          <DonationForm onClose={() => setShowDonationForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
