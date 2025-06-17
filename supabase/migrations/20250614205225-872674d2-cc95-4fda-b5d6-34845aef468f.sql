
-- Add support for daily TiM Chama batches
ALTER TABLE public.batches 
ADD COLUMN IF NOT EXISTS batch_type text DEFAULT 'weekly' CHECK (batch_type IN ('weekly', 'daily')),
ADD COLUMN IF NOT EXISTS cycle_duration_days integer DEFAULT 7,
ADD COLUMN IF NOT EXISTS one_time_contribution numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS daily_payout_amount numeric DEFAULT NULL;

-- Create table for one-time contributions (for daily batches)
CREATE TABLE IF NOT EXISTS public.one_time_contributions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id uuid REFERENCES public.batches(id) NOT NULL,
  member_id uuid REFERENCES public.profiles(id) NOT NULL,
  amount_due numeric NOT NULL,
  amount_paid numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  payment_date timestamp with time zone,
  reminder_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(batch_id, member_id)
);

-- Add payout frequency to payout schedules
ALTER TABLE public.payout_schedules 
ADD COLUMN IF NOT EXISTS payout_frequency text DEFAULT 'weekly' CHECK (payout_frequency IN ('weekly', 'daily'));

-- Update contribution reminders for daily batches
ALTER TABLE public.contribution_reminders 
ADD COLUMN IF NOT EXISTS batch_type text DEFAULT 'weekly' CHECK (batch_type IN ('weekly', 'daily'));

-- Enable RLS for one_time_contributions
ALTER TABLE public.one_time_contributions ENABLE ROW LEVEL SECURITY;

-- RLS policies for one_time_contributions
CREATE POLICY "Users can view contributions for their batches" 
  ON public.one_time_contributions 
  FOR SELECT 
  USING (
    batch_id IN (
      SELECT id FROM public.batches 
      WHERE created_by = auth.uid()
    ) OR 
    member_id = auth.uid()
  );

CREATE POLICY "Batch creators can manage contributions" 
  ON public.one_time_contributions 
  FOR ALL 
  USING (
    batch_id IN (
      SELECT id FROM public.batches 
      WHERE created_by = auth.uid()
    )
  );

-- Update the payout schedule generation function for daily batches
CREATE OR REPLACE FUNCTION public.generate_daily_payout_schedule()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  member_record RECORD;
  day_counter INTEGER := 1;
  daily_payout DECIMAL(10,2);
BEGIN
  -- Only trigger for daily batches when they become active
  IF NEW.batch_type = 'daily' AND NEW.status = 'active' AND OLD.status = 'recruiting' AND NEW.payout_schedule_generated = FALSE THEN
    
    -- Calculate daily payout amount
    daily_payout := NEW.one_time_contribution * NEW.max_members;
    
    -- Generate daily payout schedule
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
        payout_date,
        payout_frequency
      ) VALUES (
        NEW.id,
        member_record.user_id,
        day_counter,
        daily_payout,
        NEW.payout_start_date + (day_counter - 1) * INTERVAL '1 day',
        'daily'
      );
      
      day_counter := day_counter + 1;
    END LOOP;
    
    -- Generate one-time contribution records for all members
    FOR member_record IN 
      SELECT user_id FROM public.batch_members 
      WHERE batch_id = NEW.id
    LOOP
      INSERT INTO public.one_time_contributions (
        batch_id,
        member_id,
        amount_due
      ) VALUES (
        NEW.id,
        member_record.user_id,
        NEW.one_time_contribution + NEW.service_fee_per_member
      );
    END LOOP;
    
    -- Mark payout schedule as generated
    NEW.payout_schedule_generated := TRUE;
    NEW.total_weeks := NEW.cycle_duration_days;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for daily batch payout generation
DROP TRIGGER IF EXISTS generate_daily_payout_schedule_trigger ON public.batches;
CREATE TRIGGER generate_daily_payout_schedule_trigger
  BEFORE UPDATE ON public.batches
  FOR EACH ROW
  EXECUTE FUNCTION generate_daily_payout_schedule();

-- Add default reminder templates for daily batches
INSERT INTO public.contribution_reminders (batch_id, template_type, batch_type, message_template)
SELECT 
  b.id,
  'one_time_reminder',
  'daily',
  'TiM Chama Daily Reminder\n\nHi {member_name}!\n\nYour one-time contribution of KES ' || (b.one_time_contribution + b.service_fee_per_member) || ' is due for ' || b.name || '.\n\nContribution: KES ' || b.one_time_contribution || '\nService Fee: KES ' || b.service_fee_per_member || '\nTotal: KES ' || (b.one_time_contribution + b.service_fee_per_member) || '\n\nPay once and receive KES ' || (b.one_time_contribution * b.max_members) || ' on your scheduled day!\n\nThank you!'
FROM public.batches b
WHERE b.batch_type = 'daily' AND NOT EXISTS (
  SELECT 1 FROM public.contribution_reminders cr 
  WHERE cr.batch_id = b.id AND cr.template_type = 'one_time_reminder'
);
