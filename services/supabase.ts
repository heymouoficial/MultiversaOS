
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kddzrphifmddhdfsybxl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZHpycGhpZm1kZGhkZnN5YnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDM5NzUsImV4cCI6MjA4MDM3OTk3NX0.rRPPi1ND0d_5dzo7U2cVL6_o396ZXSGuBugm1A68Oks';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Memory System
export const memorySystem = {
    // Identify or Create User
    async identifyUser(name: string) {
        // Simple identification by name for demo purposes. 
        // In production, use fingerprintjs or auth.
        const { data, error } = await supabase
            .from('leads')
            .select('id')
            .eq('name', name)
            .single();

        if (data) return data.id;

        const { data: newData, error: newError } = await supabase
            .from('leads')
            .insert([{ name }])
            .select('id')
            .single();
        
        return newData?.id;
    },

    // Save Message
    async saveMessage(leadId: string, role: 'user' | 'model', content: string) {
        if (!leadId) return;
        
        // Find active conversation or create one
        let conversationId;
        const { data: conv } = await supabase
            .from('conversations')
            .select('id')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (conv) {
            conversationId = conv.id;
        } else {
            const { data: newConv } = await supabase
                .from('conversations')
                .insert([{ lead_id: leadId, intent: 'consulting' }])
                .select('id')
                .single();
            conversationId = newConv?.id;
        }

        if (conversationId) {
            await supabase.from('messages').insert([{
                conversation_id: conversationId,
                role,
                content
            }]);
        }
    },

    // Retrieve Context (The "Brain")
    async getContext(leadId: string) {
        if (!leadId) return [];
        
        // Get last 5 messages from recent conversations
        const { data } = await supabase
            .from('conversations')
            .select(`
                messages (
                    role,
                    content,
                    created_at
                )
            `)
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (data && data[0]?.messages) {
            return data[0].messages
                .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((m: any) => ({ role: m.role, content: m.content }));
        }
        return [];
    }
};
