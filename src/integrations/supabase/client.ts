// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://azbgycysjnhvuyjftuib.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Ymd5Y3lzam5odnV5amZ0dWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDIwNTQsImV4cCI6MjA2NTQ3ODA1NH0.x1hd4WoAjZUCWBRDbExJFPTzJ4mxcCod3UATVsFkdFo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);