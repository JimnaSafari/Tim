
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

    // Get user batches
    const { data: batches } = await supabase
      .from('batches')
      .select(`
        *,
        batch_members!inner(position, joined_at)
      `)
      .eq('batch_members.user_id', user.id);

    // Get user savings transactions
    const { data: savings } = await supabase
      .from('savings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Calculate savings balance
    const savingsBalance = savings?.reduce((total, transaction) => {
      return transaction.transaction_type === 'deposit' 
        ? total + Number(transaction.amount)
        : total - Number(transaction.amount);
    }, 0) || 0;

    // Calculate monthly total (current month deposits)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = savings?.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transaction.transaction_type === 'deposit' &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    }).reduce((total, transaction) => total + Number(transaction.amount), 0) || 0;

    // Get recent savings (last 10 transactions)
    const recentSavings = savings?.slice(0, 10) || [];

    const userData = {
      profile,
      batches: batches || [],
      savingsBalance,
      monthlyTotal,
      recentSavings,
      totalSavings: savings?.length || 0
    };

    console.log('User data fetched successfully');

    return new Response(
      JSON.stringify(userData),
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
