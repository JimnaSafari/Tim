
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    console.log('Fetching user data for:', user.id);

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get user's savings balance
    const { data: savingsData } = await supabase
      .from('savings')
      .select('amount, transaction_type, created_at, description')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    const balance = savingsData?.reduce((total, transaction) => {
      return transaction.transaction_type === 'deposit' 
        ? total + Number(transaction.amount)
        : total - Number(transaction.amount);
    }, 0) || 0;

    // Get user's batches
    const { data: userBatches } = await supabase
      .from('batch_members')
      .select(`
        batch_id,
        position,
        payout_date,
        has_received_payout,
        joined_at,
        batches (
          id,
          name,
          description,
          monthly_contribution,
          max_members,
          current_members,
          status,
          invite_code,
          created_at
        )
      `)
      .eq('user_id', user.id);

    // Get recent transactions (last 5)
    const recentTransactions = savingsData?.slice(0, 5) || [];

    console.log('User data fetched successfully');

    return new Response(
      JSON.stringify({
        profile,
        balance,
        batches: userBatches,
        recentTransactions,
        savingsHistory: savingsData
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
