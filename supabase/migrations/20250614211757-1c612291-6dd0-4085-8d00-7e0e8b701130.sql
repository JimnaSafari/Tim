
-- Create payment routing configuration table
CREATE TABLE public.payment_routing_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_fee_mpesa_number TEXT NOT NULL DEFAULT '254796720095',
  pool_money_mpesa_number TEXT NOT NULL DEFAULT '254716841006',
  pool_money_bank_account TEXT NOT NULL DEFAULT '006010159701',
  pool_money_threshold NUMERIC NOT NULL DEFAULT 150000,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment splits table to track how payments are divided
CREATE TABLE public.payment_splits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_transaction_id TEXT NOT NULL,
  split_type TEXT NOT NULL CHECK (split_type IN ('service_fee', 'pool_contribution')),
  amount NUMERIC NOT NULL,
  destination_type TEXT NOT NULL CHECK (destination_type IN ('mpesa', 'bank')),
  destination_identifier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_reference TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pool money balance tracking table
CREATE TABLE public.pool_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  mpesa_balance NUMERIC NOT NULL DEFAULT 0,
  bank_balance NUMERIC NOT NULL DEFAULT 0,
  last_bank_transfer_amount NUMERIC DEFAULT 0,
  last_bank_transfer_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create M-Pesa transactions table for Supabase environment
CREATE TABLE public.mpesa_transactions (
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
  has_splits BOOLEAN DEFAULT false,
  total_splits_count INTEGER DEFAULT 0,
  completed_splits_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default routing configuration
INSERT INTO public.payment_routing_config (
  service_fee_mpesa_number,
  pool_money_mpesa_number,
  pool_money_bank_account,
  pool_money_threshold
) VALUES (
  '254796720095',
  '254716841006', 
  '006010159701',
  150000
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_splits_transaction_id ON payment_splits(original_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_splits_status ON payment_splits(status);
CREATE INDEX IF NOT EXISTS idx_pool_balances_batch_id ON pool_balances(batch_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_has_splits ON mpesa_transactions(has_splits);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_user_id ON mpesa_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_checkout_request_id ON mpesa_transactions(checkout_request_id);
