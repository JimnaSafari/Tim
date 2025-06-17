
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get the user from the auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const { name, description, monthlyContribution, maxMembers } = await req.json();

    console.log('Creating batch for user:', user.id);

    // Create the batch
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .insert({
        name,
        description,
        created_by: user.id,
        monthly_contribution: monthlyContribution,
        max_members: maxMembers,
        current_members: 1,
        status: 'recruiting'
      })
      .select()
      .single();

    if (batchError) {
      console.error('Batch creation error:', batchError);
      throw batchError;
    }

    // Add the creator as the first member
    const { error: memberError } = await supabase
      .from('batch_members')
      .insert({
        batch_id: batch.id,
        user_id: user.id,
        position: 1,
        joined_at: new Date().toISOString()
      });

    if (memberError) {
      console.error('Member addition error:', memberError);
      throw memberError;
    }

    console.log('Batch created successfully:', batch.id);

    return new Response(
      JSON.stringify({ batch }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error creating batch:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
