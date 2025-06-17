
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

    const { checkoutRequestId } = await req.json();

    if (!checkoutRequestId) {
      throw new Error('Missing checkout request ID');
    }

    // Check transaction status in database first
    const { data: transaction, error: dbError } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .eq('user_id', user.id)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      throw new Error('Error checking transaction status');
    }

    if (transaction && transaction.status === 'completed') {
      return new Response(
        JSON.stringify({
          resultCode: '0',
          resultDesc: 'Payment completed successfully',
          transactionId: transaction.mpesa_receipt_number,
          amount: transaction.amount
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    if (transaction && transaction.status === 'failed') {
      return new Response(
        JSON.stringify({
          resultCode: transaction.result_code || '1',
          resultDesc: transaction.result_desc || 'Payment failed'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // If still pending or no transaction found, query M-Pesa API
    const CONSUMER_KEY = Deno.env.get('MPESA_CONSUMER_KEY');
    const CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET');
    const BUSINESS_SHORT_CODE = Deno.env.get('MPESA_BUSINESS_SHORT_CODE');
    const PASSKEY = Deno.env.get('MPESA_PASSKEY');

    if (!CONSUMER_KEY || !CONSUMER_SECRET || !BUSINESS_SHORT_CODE || !PASSKEY) {
      // Return pending status if credentials not configured
      return new Response(
        JSON.stringify({
          resultCode: '1032',
          resultDesc: 'Request pending'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Generate access token
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    const tokenResponse = await fetch('https://sandbox-api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to generate M-Pesa access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Query transaction status
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`);

    const queryData = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const queryResponse = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryData),
    });

    const queryResult = await queryResponse.json();

    return new Response(
      JSON.stringify({
        resultCode: queryResult.ResultCode,
        resultDesc: queryResult.ResultDesc,
        transactionId: queryResult.MpesaReceiptNumber
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Payment status check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        resultCode: '1',
        resultDesc: 'Error checking payment status'
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
