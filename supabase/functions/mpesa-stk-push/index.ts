
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

    const { amount, phoneNumber, accountReference, transactionDesc } = await req.json();

    // Validate input
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (!phoneNumber || !/^254\d{9}$/.test(phoneNumber)) {
      throw new Error('Invalid phone number format. Use 254XXXXXXXXX');
    }

    console.log(`Processing STK Push for user ${user.id}: ${amount} to ${phoneNumber}`);

    // TODO: Replace these with your actual M-Pesa credentials
    const CONSUMER_KEY = Deno.env.get('MPESA_CONSUMER_KEY');
    const CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET');
    const BUSINESS_SHORT_CODE = Deno.env.get('MPESA_BUSINESS_SHORT_CODE');
    const PASSKEY = Deno.env.get('MPESA_PASSKEY');
    const CALLBACK_URL = Deno.env.get('MPESA_CALLBACK_URL');

    if (!CONSUMER_KEY || !CONSUMER_SECRET || !BUSINESS_SHORT_CODE || !PASSKEY) {
      throw new Error('M-Pesa credentials not configured. Please add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BUSINESS_SHORT_CODE, and MPESA_PASSKEY to your secrets.');
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

    // Generate password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`);

    // STK Push request
    const stkPushData = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: CALLBACK_URL || `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc
    };

    const stkResponse = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    });

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode === '0') {
      // Store transaction record
      const { error: dbError } = await supabase
        .from('mpesa_transactions')
        .insert({
          user_id: user.id,
          checkout_request_id: stkData.CheckoutRequestID,
          merchant_request_id: stkData.MerchantRequestID,
          amount: amount,
          phone_number: phoneNumber,
          account_reference: accountReference,
          transaction_desc: transactionDesc,
          status: 'pending'
        });

      if (dbError) {
        console.error('Error storing transaction:', dbError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          checkoutRequestId: stkData.CheckoutRequestID,
          message: 'STK Push sent successfully'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      throw new Error(stkData.errorMessage || 'STK Push failed');
    }

  } catch (error) {
    console.error('STK Push error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        errorMessage: error.message 
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
