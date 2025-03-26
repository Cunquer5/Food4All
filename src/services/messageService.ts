
import { supabase, Message, User } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const sendMessage = async (recipient_id: string, content: string, donation_id?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id,
        content,
        donation_id,
        read: false
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Message;
  } catch (error: any) {
    toast({
      title: 'Error sending message',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }
};

export const getConversations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    // Get unique conversations by finding all unique users the current user has messaged with
    const { data: sentMessages, error: sentError } = await supabase
      .from('messages')
      .select('recipient_id')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });
      
    if (sentError) throw sentError;
    
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });
      
    if (receivedError) throw receivedError;
    
    const contactIds = new Set([
      ...sentMessages.map(m => m.recipient_id),
      ...receivedMessages.map(m => m.sender_id)
    ]);
    
    // Get profiles for each contact
    const contacts: Array<User & { unread_count: number }> = [];
    
    for (const contactId of contactIds) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', contactId)
        .single();
        
      if (profile) {
        // Count unread messages
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', contactId)
          .eq('recipient_id', user.id)
          .eq('read', false);
          
        contacts.push({
          ...profile as User,
          unread_count: count || 0
        });
      }
    }
    
    return contacts;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

export const getMessages = async (contactId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    // Get messages between current user and contact
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Mark received messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', contactId)
      .eq('recipient_id', user.id)
      .eq('read', false);
      
    return data as Message[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const getUnreadMessageCount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 0;
    
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('read', false);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};
