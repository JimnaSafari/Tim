
-- Add phone number validation and formatting to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_reminder_method text DEFAULT 'sms' CHECK (preferred_reminder_method IN ('sms', 'whatsapp', 'both'));

-- Create table for reminder logs
CREATE TABLE IF NOT EXISTS public.reminder_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id uuid REFERENCES public.batches(id) NOT NULL,
  member_id uuid REFERENCES public.profiles(id) NOT NULL,
  reminder_type text NOT NULL CHECK (reminder_type IN ('contribution', 'payout', 'overdue')),
  message_content text NOT NULL,
  phone_number text NOT NULL,
  delivery_method text NOT NULL CHECK (delivery_method IN ('sms', 'whatsapp')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  sent_at timestamp with time zone,
  delivered_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for reminder schedules
CREATE TABLE IF NOT EXISTS public.reminder_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id uuid REFERENCES public.batches(id) NOT NULL,
  reminder_type text NOT NULL CHECK (reminder_type IN ('weekly_contribution', 'payout_notification', 'overdue_payment')),
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  time_of_day time NOT NULL DEFAULT '09:00:00',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for reminder_logs
CREATE POLICY "Users can view reminder logs for their batches" 
  ON public.reminder_logs 
  FOR SELECT 
  USING (
    batch_id IN (
      SELECT id FROM public.batches 
      WHERE created_by = auth.uid()
    ) OR 
    member_id = auth.uid()
  );

CREATE POLICY "Batch creators can insert reminder logs" 
  ON public.reminder_logs 
  FOR INSERT 
  WITH CHECK (
    batch_id IN (
      SELECT id FROM public.batches 
      WHERE created_by = auth.uid()
    )
  );

-- RLS policies for reminder_schedules
CREATE POLICY "Users can view reminder schedules for their batches" 
  ON public.reminder_schedules 
  FOR SELECT 
  USING (
    batch_id IN (
      SELECT id FROM public.batches 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Batch creators can manage reminder schedules" 
  ON public.reminder_schedules 
  FOR ALL 
  USING (
    batch_id IN (
      SELECT id FROM public.batches 
      WHERE created_by = auth.uid()
    )
  );

-- Enable realtime for reminder logs
ALTER TABLE public.reminder_logs REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.reminder_logs;
