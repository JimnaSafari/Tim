
-- Add new fields to the batches table for merry-go-round functionality
ALTER TABLE public.batches 
ADD COLUMN weekly_contribution DECIMAL(10,2),
ADD COLUMN service_fee_per_member DECIMAL(10,2) DEFAULT 100.00,
ADD COLUMN payout_start_date DATE,
ADD COLUMN current_week INTEGER DEFAULT 0,
ADD COLUMN total_weeks INTEGER,
ADD COLUMN agreement_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN payout_schedule_generated BOOLEAN DEFAULT FALSE;

-- Create payout schedules table to track who gets paid when
CREATE TABLE public.payout_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  payout_amount DECIMAL(10,2) NOT NULL,
  payout_date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(batch_id, week_number),
  UNIQUE(batch_id, member_id)
);

-- Create weekly contributions table to track payments per member per week
CREATE TABLE public.weekly_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(batch_id, member_id, week_number)
);

-- Create batch agreements table to store generated legal agreements
CREATE TABLE public.batch_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  agreement_content TEXT NOT NULL,
  member_signatures JSONB DEFAULT '[]',
  organizer_signature BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contribution reminders table for tracking reminder templates and schedules
CREATE TABLE public.contribution_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  template_type TEXT CHECK (template_type IN ('weekly_reminder', 'overdue_notice', 'payout_notification')) NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.payout_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for payout_schedules
CREATE POLICY "Users can view payout schedules for their batches" ON public.payout_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.batch_members bm 
      WHERE bm.batch_id = payout_schedules.batch_id AND bm.user_id = auth.uid()
    )
  );

-- RLS policies for weekly_contributions
CREATE POLICY "Users can view contributions for their batches" ON public.weekly_contributions
  FOR SELECT USING (
    member_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.batches b 
      WHERE b.id = batch_id AND b.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own contributions" ON public.weekly_contributions
  FOR UPDATE USING (member_id = auth.uid());

-- RLS policies for batch_agreements
CREATE POLICY "Users can view agreements for their batches" ON public.batch_agreements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.batch_members bm 
      WHERE bm.batch_id = batch_agreements.batch_id AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "Batch creators can manage agreements" ON public.batch_agreements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.batches b 
      WHERE b.id = batch_id AND b.created_by = auth.uid()
    )
  );

-- RLS policies for contribution_reminders
CREATE POLICY "Batch creators can manage reminders" ON public.contribution_reminders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.batches b 
      WHERE b.id = batch_id AND b.created_by = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_payout_schedules_batch_week ON public.payout_schedules(batch_id, week_number);
CREATE INDEX idx_weekly_contributions_batch_member_week ON public.weekly_contributions(batch_id, member_id, week_number);
CREATE INDEX idx_weekly_contributions_status ON public.weekly_contributions(status);

-- Function to automatically generate payout schedule when batch is full
CREATE OR REPLACE FUNCTION public.generate_payout_schedule()
RETURNS TRIGGER AS $$
DECLARE
  member_record RECORD;
  week_counter INTEGER := 1;
  weekly_payout DECIMAL(10,2);
BEGIN
  -- Only trigger when batch becomes full (status changes to 'active')
  IF NEW.status = 'active' AND OLD.status = 'recruiting' AND NEW.payout_schedule_generated = FALSE THEN
    
    -- Calculate weekly payout amount (total contributions minus service fees)
    weekly_payout := NEW.weekly_contribution * NEW.max_members;
    
    -- Generate payout schedule for each member
    FOR member_record IN 
      SELECT user_id FROM public.batch_members 
      WHERE batch_id = NEW.id 
      ORDER BY position ASC
    LOOP
      INSERT INTO public.payout_schedules (
        batch_id, 
        member_id, 
        week_number, 
        payout_amount, 
        payout_date
      ) VALUES (
        NEW.id,
        member_record.user_id,
        week_counter,
        weekly_payout,
        NEW.payout_start_date + (week_counter - 1) * INTERVAL '7 days'
      );
      
      week_counter := week_counter + 1;
    END LOOP;
    
    -- Generate weekly contribution records for all members for all weeks
    FOR member_record IN 
      SELECT user_id FROM public.batch_members 
      WHERE batch_id = NEW.id
    LOOP
      FOR week_counter IN 1..NEW.max_members LOOP
        INSERT INTO public.weekly_contributions (
          batch_id,
          member_id,
          week_number,
          amount_due
        ) VALUES (
          NEW.id,
          member_record.user_id,
          week_counter,
          NEW.weekly_contribution + NEW.service_fee_per_member
        );
      END LOOP;
    END LOOP;
    
    -- Mark payout schedule as generated
    NEW.payout_schedule_generated := TRUE;
    NEW.total_weeks := NEW.max_members;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic payout schedule generation
CREATE OR REPLACE TRIGGER generate_payout_schedule_trigger
  BEFORE UPDATE ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.generate_payout_schedule();
