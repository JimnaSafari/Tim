
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Initiate STK Push
router.post('/stk-push', authenticateToken, async (req, res) => {
  try {
    const { amount, phoneNumber, accountReference, transactionDesc } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        errorMessage: 'Invalid amount' 
      });
    }

    if (!phoneNumber || !/^254\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false,
        errorMessage: 'Invalid phone number format. Use 254XXXXXXXXX' 
      });
    }

    console.log(`Processing STK Push for user ${userId}: ${amount} to ${phoneNumber}`);

    // M-Pesa credentials from environment variables
    const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
    const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE;
    const PASSKEY = process.env.MPESA_PASSKEY;
    const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

    if (!CONSUMER_KEY || !CONSUMER_SECRET || !BUSINESS_SHORT_CODE || !PASSKEY) {
      return res.status(500).json({ 
        success: false,
        errorMessage: 'M-Pesa credentials not configured. Please add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BUSINESS_SHORT_CODE, and MPESA_PASSKEY to your environment variables.' 
      });
    }

    // Generate access token
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
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
    const password = Buffer.from(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');

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
      CallBackURL: CALLBACK_URL || `${process.env.BASE_URL || 'http://localhost:3000'}/api/mpesa/callback`,
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
      // Store transaction record (you'll need to create mpesa_transactions table)
      try {
        await query(`
          INSERT INTO mpesa_transactions (user_id, checkout_request_id, merchant_request_id, amount, phone_number, account_reference, transaction_desc, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
        `, [
          userId,
          stkData.CheckoutRequestID,
          stkData.MerchantRequestID,
          amount,
          phoneNumber,
          accountReference,
          transactionDesc
        ]);
      } catch (dbError) {
        console.error('Error storing transaction:', dbError);
        // Continue even if database storage fails
      }

      res.json({
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
        message: 'STK Push sent successfully'
      });
    } else {
      throw new Error(stkData.errorMessage || 'STK Push failed');
    }

  } catch (error) {
    console.error('STK Push error:', error);
    res.status(400).json({ 
      success: false,
      errorMessage: error.message 
    });
  }
});

// Check payment status
router.post('/payment-status', authenticateToken, async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    const userId = req.user.id;

    if (!checkoutRequestId) {
      return res.status(400).json({ error: 'Missing checkout request ID' });
    }

    // Check transaction status in database first
    try {
      const transactionResult = await query(
        'SELECT * FROM mpesa_transactions WHERE checkout_request_id = $1 AND user_id = $2',
        [checkoutRequestId, userId]
      );

      const transaction = transactionResult.rows[0];

      if (transaction && transaction.status === 'completed') {
        return res.json({
          resultCode: '0',
          resultDesc: 'Payment completed successfully',
          transactionId: transaction.mpesa_receipt_number,
          amount: transaction.amount
        });
      }

      if (transaction && transaction.status === 'failed') {
        return res.json({
          resultCode: transaction.result_code || '1',
          resultDesc: transaction.result_desc || 'Payment failed'
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    // If still pending or no transaction found, query M-Pesa API
    const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
    const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE;
    const PASSKEY = process.env.MPESA_PASSKEY;

    if (!CONSUMER_KEY || !CONSUMER_SECRET || !BUSINESS_SHORT_CODE || !PASSKEY) {
      // Return pending status if credentials not configured
      return res.json({
        resultCode: '1032',
        resultDesc: 'Request pending'
      });
    }

    // Generate access token
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
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
    const password = Buffer.from(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');

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

    res.json({
      resultCode: queryResult.ResultCode,
      resultDesc: queryResult.ResultDesc,
      transactionId: queryResult.MpesaReceiptNumber
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(400).json({ 
      error: error.message,
      resultCode: '1',
      resultDesc: 'Error checking payment status'
    });
  }
});

// M-Pesa callback endpoint (webhook)
router.post('/callback', async (req, res) => {
  try {
    const callbackData = req.body;
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

    // Extract transaction details from callback
    const { Body } = callbackData;
    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    let transactionId = null;
    let amount = null;

    // If payment was successful, extract additional details
    if (ResultCode === 0 && stkCallback.CallbackMetadata) {
      const metadata = stkCallback.CallbackMetadata.Item;
      
      // Extract transaction ID and amount from metadata
      const receiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber');
      const amountItem = metadata.find(item => item.Name === 'Amount');
      
      if (receiptNumber) transactionId = receiptNumber.Value;
      if (amountItem) amount = amountItem.Value;
    }

    // Update transaction status in database
    try {
      await query(`
        UPDATE mpesa_transactions 
        SET status = $1, result_code = $2, result_desc = $3, mpesa_receipt_number = $4, updated_at = NOW()
        WHERE checkout_request_id = $5
      `, [
        ResultCode === 0 ? 'completed' : 'failed',
        ResultCode.toString(),
        ResultDesc,
        transactionId,
        CheckoutRequestID
      ]);
    } catch (dbError) {
      console.error('Error updating transaction:', dbError);
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Internal server error' });
  }
});

module.exports = router;
