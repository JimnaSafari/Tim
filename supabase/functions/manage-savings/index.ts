
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

    const { action, amount, description } = await req.json();

    if (!['deposit', 'withdrawal'].includes(action)) {
      throw new Error('Invalid action. Must be deposit or withdrawal');
    }

    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    console.log(`Processing ${action} of ${amount} for user:`, user.id);

    // For withdrawals, check if user has sufficient balance
    if (action === 'withdrawal') {
      const { data: savingsData } = await supabase
        .from('savings')
        .select('amount, transaction_type')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const balance = savingsData?.reduce((total, transaction) => {
        return transaction.transaction_type === 'deposit' 
          ? total + Number(transaction.amount)
          : total - Number(transaction.amount);
      }, 0) || 0;

      if (balance < amount) {
        throw new Error('Insufficient balance');
      }
    }

    // Create the savings transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('savings')
      .insert({
        user_id: user.id,
        amount: amount,
        transaction_type: action,
        description: description || `${action.charAt(0).toUpperCase() + action.slice(1)} transaction`,
        status: 'completed'
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      throw transactionError;
    }

    console.log('Transaction completed successfully');

    return new Response(
      JSON.stringify({ 
        message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`,
        transaction 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing savings transaction:', error);
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
