
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const { inviteCode } = await req.json();

    console.log('User attempting to join batch with code:', inviteCode);

    // Find the batch by invite code
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (batchError || !batch) {
      throw new Error('Invalid invite code');
    }

    // Check if batch is still recruiting
    if (batch.status !== 'recruiting') {
      throw new Error('This batch is no longer accepting new members');
    }

    // Check if batch is full
    if (batch.current_members >= batch.max_members) {
      throw new Error('This batch is full');
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('batch_members')
      .select('id')
      .eq('batch_id', batch.id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      throw new Error('You are already a member of this batch');
    }

    // Add user to the batch
    const nextPosition = batch.current_members + 1;
    
    const { error: memberError } = await supabase
      .from('batch_members')
      .insert({
        batch_id: batch.id,
        user_id: user.id,
        position: nextPosition,
        joined_at: new Date().toISOString()
      });

    if (memberError) {
      console.error('Member addition error:', memberError);
      throw memberError;
    }

    // Update batch member count
    const { error: updateError } = await supabase
      .from('batches')
      .update({ 
        current_members: nextPosition,
        status: nextPosition >= batch.max_members ? 'active' : 'recruiting'
      })
      .eq('id', batch.id);

    if (updateError) {
      console.error('Batch update error:', updateError);
      throw updateError;
    }

    console.log('User successfully joined batch');

    return new Response(
      JSON.stringify({ message: 'Successfully joined batch', batch }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error joining batch:', error);
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
