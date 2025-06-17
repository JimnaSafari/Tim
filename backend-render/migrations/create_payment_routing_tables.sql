
-- Create payment routing configuration table
CREATE TABLE IF NOT EXISTS public.payment_routing_config (
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
CREATE TABLE IF NOT EXISTS public.payment_splits (
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
CREATE TABLE IF NOT EXISTS public.pool_balances (
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

-- Add payment split tracking to mpesa_transactions table if columns don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mpesa_transactions' AND column_name = 'has_splits') THEN
        ALTER TABLE public.mpesa_transactions ADD COLUMN has_splits BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mpesa_transactions' AND column_name = 'total_splits_count') THEN
        ALTER TABLE public.mpesa_transactions ADD COLUMN total_splits_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mpesa_transactions' AND column_name = 'completed_splits_count') THEN
        ALTER TABLE public.mpesa_transactions ADD COLUMN completed_splits_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Insert default routing configuration if not exists
INSERT INTO public.payment_routing_config (
  service_fee_mpesa_number,
  pool_money_mpesa_number,
  pool_money_bank_account,
  pool_money_threshold
) 
SELECT '254796720095', '254716841006', '006010159701', 150000
WHERE NOT EXISTS (SELECT 1 FROM public.payment_routing_config WHERE is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_splits_transaction_id ON payment_splits(original_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_splits_status ON payment_splits(status);
CREATE INDEX IF NOT EXISTS idx_pool_balances_batch_id ON pool_balances(batch_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_has_splits ON mpesa_transactions(has_splits);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_user_id ON mpesa_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_checkout_request_id ON mpesa_transactions(checkout_request_id);
