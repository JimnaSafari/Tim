
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

    const { transactionId, totalAmount, serviceFeeAmount, poolAmount } = await req.json();

    console.log(`Processing payment splits for transaction ${transactionId}: Total=${totalAmount}, ServiceFee=${serviceFeeAmount}, Pool=${poolAmount}`);

    // Get routing configuration
    const { data: config, error: configError } = await supabase
      .from('payment_routing_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (configError) {
      console.error('Config error:', configError);
      throw new Error('Failed to get routing configuration');
    }

    // Determine pool destination based on amount
    const poolDestinationType = poolAmount > config.pool_money_threshold ? 'bank' : 'mpesa';
    const poolDestination = poolDestinationType === 'bank' 
      ? config.pool_money_bank_account 
      : config.pool_money_mpesa_number;

    // Create payment splits records
    const splits = [
      {
        original_transaction_id: transactionId,
        split_type: 'service_fee',
        amount: serviceFeeAmount,
        destination_type: 'mpesa',
        destination_identifier: config.service_fee_mpesa_number,
        status: 'pending'
      },
      {
        original_transaction_id: transactionId,
        split_type: 'pool_contribution',
        amount: poolAmount,
        destination_type: poolDestinationType,
        destination_identifier: poolDestination,
        status: 'pending'
      }
    ];

    const { error: splitsError } = await supabase
      .from('payment_splits')
      .insert(splits);

    if (splitsError) {
      console.error('Splits error:', splitsError);
      throw new Error('Failed to create payment splits');
    }

    // Update the original transaction with split information
    const { error: updateError } = await supabase
      .from('mpesa_transactions')
      .update({
        has_splits: true,
        total_splits_count: splits.length,
        completed_splits_count: 0
      })
      .eq('checkout_request_id', transactionId);

    if (updateError) {
      console.error('Failed to update transaction with split info:', updateError);
    }

    // Process the splits (simplified for now - in production, this would trigger actual M-Pesa B2C transfers)
    console.log('Payment splits created successfully:');
    console.log(`- Service fee: KES ${serviceFeeAmount} to ${config.service_fee_mpesa_number}`);
    console.log(`- Pool money: KES ${poolAmount} to ${poolDestination} (${poolDestinationType})`);

    return new Response(
      JSON.stringify({ 
        success: true,
        splits: splits.length,
        message: 'Payment splits processed successfully',
        splitDetails: {
          serviceFee: serviceFeeAmount,
          poolContribution: poolAmount,
          destination: {
            serviceFee: config.service_fee_mpesa_number,
            poolMoney: poolDestination,
            poolType: poolDestinationType
          }
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing payment splits:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
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
