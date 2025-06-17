
-- Create M-Pesa transactions table
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checkout_request_id TEXT NOT NULL,
  merchant_request_id TEXT,
  amount NUMERIC NOT NULL,
  phone_number TEXT NOT NULL,
  account_reference TEXT,
  transaction_desc TEXT,
  status TEXT DEFAULT 'pending',
  result_code TEXT,
  result_desc TEXT,
  mpesa_receipt_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_user_id ON mpesa_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_checkout_request_id ON mpesa_transactions(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_status ON mpesa_transactions(status);

-- Add comments for documentation
COMMENT ON TABLE mpesa_transactions IS 'Stores M-Pesa STK Push transaction records';
COMMENT ON COLUMN mpesa_transactions.checkout_request_id IS 'Unique identifier from M-Pesa for the STK Push request';
COMMENT ON COLUMN mpesa_transactions.merchant_request_id IS 'Merchant request ID from M-Pesa';
COMMENT ON COLUMN mpesa_transactions.status IS 'Transaction status: pending, completed, failed';
