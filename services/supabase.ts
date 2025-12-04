
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const memorySystem = {
    // Identify or Create User based on LocalStorage ID (Fingerprint)
    identifyUser: async (name: string) => {
        if (!supabase) return null;

        // Simple fingerprinting: check local storage or generate one
        let fingerprint = localStorage.getItem('multiversa_fid');
        if (!fingerprint) {
            fingerprint = Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('multiversa_fid', fingerprint);
        }

        // Check if exists
        const { data: existing } = await supabase
            .from('leads')
            .select('id')
            .eq('fingerprint', fingerprint)
            .single();

        if (existing) {
            // Update name if provided and different
            if (name) {
                await supabase.from('leads').update({ name, last_seen: new Date() }).eq('id', existing.id);
            }
            return existing.id;
        } else {
            // Create new
            const { data: newLead, error } = await supabase
                .from('leads')
                .insert([{ fingerprint, name }])
                .select('id')
                .single();

            if (error) {
                console.error("Error creating lead:", error);
                return null;
            }
            return newLead.id;
        }
    },

    // Save Chat Message
    saveMessage: async (leadId: string, role: 'user' | 'model', content: string) => {
        if (!supabase) return;
        await supabase.from('conversations').insert([{ lead_id: leadId, role, content }]);
    },

    // Get Context (Last 20 messages)
    getContext: async (leadId: string) => {
        if (!supabase) return [];
        const { data } = await supabase
            .from('conversations')
            .select('role, content')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false }) // Get latest
            .limit(20);

        return data ? data.reverse() : []; // Return in chronological order
    },

    // Save Reservation
    saveReservation: async (leadId: string, data: any) => {
        if (!supabase) return;
        await supabase.from('reservations').insert([{
            lead_id: leadId,
            ticket_id: data.ticketId,
            plan: data.plan,
            location: data.location,
            payment_method: data.paymentMethod,
            status: 'pending'
        }]);
    }
};
