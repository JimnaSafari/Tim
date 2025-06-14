
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { 
      name, 
      description, 
      weeklyContribution, 
      serviceFeePerMember, 
      maxMembers, 
      payoutStartDate 
    } = await req.json();

    console.log('Creating TiM batch:', { name, weeklyContribution, serviceFeePerMember, maxMembers });

    // Validate inputs
    if (!name || !weeklyContribution || !maxMembers || !payoutStartDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (weeklyContribution < 100) {
      return new Response(JSON.stringify({ error: 'Weekly contribution must be at least KES 100' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (maxMembers < 2 || maxMembers > 20) {
      return new Response(JSON.stringify({ error: 'Members must be between 2 and 20' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create the batch
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .insert({
        name,
        description,
        created_by: user.id,
        weekly_contribution: weeklyContribution,
        service_fee_per_member: serviceFeePerMember,
        max_members: maxMembers,
        current_members: 1,
        status: 'recruiting',
        payout_start_date: payoutStartDate
      })
      .select()
      .single();

    if (batchError) {
      console.error('Error creating batch:', batchError);
      return new Response(JSON.stringify({ error: 'Failed to create batch' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
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
      console.error('Error adding creator as member:', memberError);
      // Don't fail the entire operation, just log the error
    }

    // Generate default reminder templates
    const reminderTemplates = [
      {
        batch_id: batch.id,
        template_type: 'weekly_reminder',
        message_template: `🏦 TiM Chama Reminder\n\nHi {member_name}!\n\nYour weekly contribution of KES ${weeklyContribution + serviceFeePerMember} is due for ${batch.name}.\n\nContribution: KES ${weeklyContribution}\nService Fee: KES ${serviceFeePerMember}\nTotal: KES ${weeklyContribution + serviceFeePerMember}\n\nPlease make your payment before the deadline.\n\nThank you!`
      },
      {
        batch_id: batch.id,
        template_type: 'overdue_notice',
        message_template: `⚠️ TiM Chama Overdue Notice\n\nHi {member_name},\n\nYour contribution for ${batch.name} is overdue.\n\nAmount Due: KES ${weeklyContribution + serviceFeePerMember}\n\nPlease make your payment immediately to avoid penalties.\n\nThank you for your cooperation.`
      },
      {
        batch_id: batch.id,
        template_type: 'payout_notification',
        message_template: `🎉 TiM Chama Payout Notification\n\nCongratulations {member_name}!\n\nYou are receiving this week's payout from ${batch.name}.\n\nAmount: KES ${weeklyContribution * maxMembers}\n\nThe funds will be transferred to your M-Pesa shortly.\n\nEnjoy your payout! 💰`
      }
    ];

    const { error: templatesError } = await supabase
      .from('contribution_reminders')
      .insert(reminderTemplates);

    if (templatesError) {
      console.error('Error creating reminder templates:', templatesError);
    }

    console.log('TiM batch created successfully:', batch.id);

    return new Response(JSON.stringify({ 
      success: true, 
      batch,
      message: 'TiM Chama batch created successfully! Merry-go-round will start automatically when full.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in create-tim-batch function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
