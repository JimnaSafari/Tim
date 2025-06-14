
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batches table for merry-go-round groups
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  monthly_contribution DECIMAL(10,2) NOT NULL,
  max_members INTEGER NOT NULL DEFAULT 10,
  current_members INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('recruiting', 'active', 'completed')) DEFAULT 'recruiting',
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batch members table
CREATE TABLE public.batch_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  position INTEGER,
  payout_date DATE,
  has_received_payout BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(batch_id, user_id),
  UNIQUE(batch_id, position)
);

-- Create savings table
CREATE TABLE public.savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('deposit', 'withdrawal')) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for batches
CREATE POLICY "Users can view all batches" ON public.batches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create batches" ON public.batches
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Batch creators can update their batches" ON public.batches
  FOR UPDATE USING (auth.uid() = created_by);

-- Create RLS policies for batch_members
CREATE POLICY "Users can view batch members of their batches" ON public.batch_members
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.batches 
      WHERE id = batch_id AND created_by = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can join batches" ON public.batch_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for savings
CREATE POLICY "Users can view their own savings" ON public.savings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings records" ON public.savings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code() 
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.batches WHERE invite_code = code);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate invite codes for batches
CREATE OR REPLACE FUNCTION public.set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating invite codes
CREATE OR REPLACE TRIGGER batch_invite_code_trigger
  BEFORE INSERT ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.set_invite_code();
