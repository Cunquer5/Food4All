
import React, { useState, useEffect } from 'react';
import { getConversations, getMessages } from '@/services/messageService';
import { User } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { sendMessage } from '@/services/messageService';
import { formatDistanceToNow } from 'date-fns';
import BlurContainer from '@/components/ui/BlurContainer';

const MessagesInbox = () => {
  const [conversations, setConversations] = useState<(User & { unread_count: number })[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const result = await getConversations();
        setConversations(result);
        
        // Set the first conversation as active if there is one and none is selected
        if (result.length > 0 && !activeContactId) {
          setActiveContactId(result[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
    
    // Polling for new messages every 10 seconds
    const interval = setInterval(loadConversations, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeContactId) {
      const loadMessages = async () => {
        try {
          const result = await getMessages(activeContactId);
          setMessages(result);
          
          // Update the unread count for this contact
          setConversations(prevConversations => 
            prevConversations.map(c => 
              c.id === activeContactId ? { ...c, unread_count: 0 } : c
            )
          );
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };
      
      loadMessages();
      
      // Poll for new messages from the active contact
      const interval = setInterval(loadMessages, 5000);
      
      return () => clearInterval(interval);
    }
  }, [activeContactId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeContactId || !newMessage.trim()) {
      return;
    }
    
    setSendingMessage(true);
    try {
      await sendMessage(activeContactId, newMessage);
      
      // Add the message to the list and clear the input
      setMessages(prev => [...prev, {
        sender_id: 'me', // Will be replaced when the messages refresh
        recipient_id: activeContactId,
        content: newMessage,
        created_at: new Date().toISOString(),
        read: false
      }]);
      setNewMessage('');
      
      // Refresh messages
      const result = await getMessages(activeContactId);
      setMessages(result);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="inbox" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="inbox">Messages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="inbox">
        <BlurContainer className="grid grid-cols-1 md:grid-cols-3 h-[500px]">
          {/* Contacts List */}
          <div className="border-r border-gray-200 dark:border-gray-800">
            <div className="p-4 font-medium">Conversations</div>
            
            {conversations.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No conversations yet</div>
            ) : (
              <div className="overflow-y-auto h-[calc(500px-57px)]">
                {conversations.map(contact => (
                  <div 
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                      activeContactId === contact.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => setActiveContactId(contact.id)}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar_url} />
                      <AvatarFallback>{contact.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="font-medium truncate">{contact.full_name}</div>
                        {contact.unread_count > 0 && (
                          <Badge variant="default" className="bg-foodall-teal hover:bg-foodall-teal/90">
                            {contact.unread_count}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {contact.user_type === 'donor' ? 'Donor' : 'Organization'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Messages Area */}
          <div className="col-span-2 flex flex-col">
            {activeContactId ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
                  <div className="font-medium">
                    {conversations.find(c => c.id === activeContactId)?.full_name}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map(message => {
                      const isMine = message.sender_id !== activeContactId;
                      
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isMine 
                                ? 'bg-foodall-teal text-white' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                          >
                            <div>{message.content}</div>
                            <div className={`text-xs mt-1 ${isMine ? 'text-teal-100' : 'text-gray-500'}`}>
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="bg-foodall-teal hover:bg-foodall-teal/90"
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </BlurContainer>
      </TabsContent>
    </Tabs>
  );
};

export default MessagesInbox;
