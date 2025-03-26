
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sendMessage } from '@/services/messageService';
import { X } from 'lucide-react';

interface MessageModalProps {
  recipientId: string;
  recipientName: string;
  donationId?: string;
  onClose: () => void;
}

const MessageModal = ({ recipientId, recipientName, donationId, onClose }: MessageModalProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(recipientId, message, donationId);
      toast.success('Message sent successfully');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Send Message to {recipientName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[120px] mb-4"
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={isSending}
            className="bg-foodall-teal hover:bg-foodall-teal/90 text-white"
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
