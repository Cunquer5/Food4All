
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ShoppingBag, MessageCircle, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlurContainer from '@/components/ui/BlurContainer';
import { FoodDonation } from '@/lib/supabase';
import MessageModal from '@/components/messaging/MessageModal';
import { useAuth } from '@/contexts/AuthContext';

interface DonationCardProps {
  donation: FoodDonation & { 
    profiles: { 
      full_name: string; 
      avatar_url?: string;
    } 
  };
}

const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { user } = useAuth();
  
  // Format the expiry date
  const expiryDate = new Date(donation.expiry_date);
  const isExpired = expiryDate < new Date();
  
  // Status badge colors
  const statusColors = {
    available: 'bg-green-500',
    claimed: 'bg-blue-500',
    collected: 'bg-purple-500',
    expired: 'bg-red-500'
  };
  
  // Determine if the current user is an NGO (can contact) 
  const isNGO = user?.user_type === 'ngo';
  
  return (
    <BlurContainer className="overflow-hidden">
      {/* Donation Image (if available) */}
      {donation.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={donation.image_url} 
            alt={donation.title}
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{donation.title}</h3>
          <Badge className={statusColors[donation.status as keyof typeof statusColors] || 'bg-gray-500'}>
            {donation.status}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">{donation.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {donation.quantity} {donation.quantity_unit} of {donation.food_type}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className={isExpired ? 'text-red-500' : ''}>
              Expires: {format(expiryDate, 'PPP')}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{donation.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="text-sm">
            Donated by <span className="font-medium">{donation.profiles.full_name}</span>
          </div>
          
          {isNGO && donation.status === 'available' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-foodall-teal hover:text-foodall-teal/90"
              onClick={() => setShowMessageModal(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Contact
            </Button>
          )}
        </div>
      </div>
      
      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal 
          recipientId={donation.donor_id}
          recipientName={donation.profiles.full_name}
          donationId={donation.id}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </BlurContainer>
  );
};

export default DonationCard;
