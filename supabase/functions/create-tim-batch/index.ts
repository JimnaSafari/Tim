
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

    const requestBody = await req.json();
    const { 
      name, 
      description, 
      batchType = 'weekly',
      weeklyContribution, 
      oneTimeContribution,
      serviceFeePerMember, 
      maxMembers, 
      payoutStartDate 
    } = requestBody;

    console.log('Creating TiM batch:', { name, batchType, weeklyContribution, oneTimeContribution, serviceFeePerMember, maxMembers });

    // Validate inputs
    if (!name || !maxMembers || !payoutStartDate || !batchType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate based on batch type
    if (batchType === 'weekly') {
      if (!weeklyContribution || weeklyContribution < 100) {
        return new Response(JSON.stringify({ error: 'Weekly contribution must be at least KES 100' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (maxMembers < 2 || maxMembers > 20) {
        return new Response(JSON.stringify({ error: 'Weekly batch members must be between 2 and 20' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else if (batchType === 'daily') {
      if (!oneTimeContribution || oneTimeContribution < 1000) {
        return new Response(JSON.stringify({ error: 'One-time contribution must be at least KES 1,000' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (maxMembers !== 10) {
        return new Response(JSON.stringify({ error: 'Daily batch must have exactly 10 members' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Create the batch
    const batchData = {
      name,
      description,
      created_by: user.id,
      batch_type: batchType,
      service_fee_per_member: serviceFeePerMember,
      max_members: maxMembers,
      current_members: 1,
      status: 'recruiting',
      payout_start_date: payoutStartDate,
      cycle_duration_days: batchType === 'weekly' ? 7 * maxMembers : 10,
      ...(batchType === 'weekly' 
        ? { weekly_contribution: weeklyContribution }
        : { 
            one_time_contribution: oneTimeContribution,
            daily_payout_amount: oneTimeContribution * maxMembers
          }
      )
    };

    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .insert(batchData)
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
    }

    // Generate reminder templates based on batch type
    const reminderTemplates = [];

    if (batchType === 'weekly') {
      reminderTemplates.push(
        {
          batch_id: batch.id,
          template_type: 'weekly_reminder',
          batch_type: 'weekly',
          message_template: `🏦 TiM Chama Weekly Reminder\n\nHi {member_name}!\n\nYour weekly contribution of KES ${weeklyContribution + serviceFeePerMember} is due for ${batch.name}.\n\nContribution: KES ${weeklyContribution}\nService Fee: KES ${serviceFeePerMember}\nTotal: KES ${weeklyContribution + serviceFeePerMember}\n\nPlease make your payment before the deadline.\n\nThank you!`
        },
        {
          batch_id: batch.id,
          template_type: 'overdue_notice',
          batch_type: 'weekly',
          message_template: `⚠️ TiM Chama Overdue Notice\n\nHi {member_name},\n\nYour contribution for ${batch.name} is overdue.\n\nAmount Due: KES ${weeklyContribution + serviceFeePerMember}\n\nPlease make your payment immediately to avoid penalties.\n\nThank you for your cooperation.`
        },
        {
          batch_id: batch.id,
          template_type: 'payout_notification',
          batch_type: 'weekly',
          message_template: `🎉 TiM Chama Payout Notification\n\nCongratulations {member_name}!\n\nYou are receiving this week's payout from ${batch.name}.\n\nAmount: KES ${weeklyContribution * maxMembers}\n\nThe funds will be transferred to your M-Pesa shortly.\n\nEnjoy your payout! 💰`
        }
      );
    } else {
      reminderTemplates.push(
        {
          batch_id: batch.id,
          template_type: 'one_time_reminder',
          batch_type: 'daily',
          message_template: `🏦 TiM Chama Daily - One-Time Payment\n\nHi {member_name}!\n\nYour one-time contribution of KES ${oneTimeContribution + serviceFeePerMember} is due for ${batch.name}.\n\nContribution: KES ${oneTimeContribution}\nService Fee: KES ${serviceFeePerMember}\nTotal: KES ${oneTimeContribution + serviceFeePerMember}\n\nPay once and receive KES ${oneTimeContribution * maxMembers} on your scheduled day!\n\nThank you!`
        },
        {
          batch_id: batch.id,
          template_type: 'daily_payout_notification',
          batch_type: 'daily',
          message_template: `🎉 TiM Chama Daily Payout\n\nCongratulations {member_name}!\n\nToday is your payout day from ${batch.name}.\n\nAmount: KES ${oneTimeContribution * maxMembers}\n\nThe funds will be transferred to your M-Pesa shortly.\n\nEnjoy your payout! 💰`
        },
        {
          batch_id: batch.id,
          template_type: 'overdue_notice',
          batch_type: 'daily',
          message_template: `⚠️ TiM Chama Payment Overdue\n\nHi {member_name},\n\nYour one-time contribution for ${batch.name} is overdue.\n\nAmount Due: KES ${oneTimeContribution + serviceFeePerMember}\n\nPlease make your payment immediately to secure your spot.\n\nThank you for your cooperation.`
        }
      );
    }

    const { error: templatesError } = await supabase
      .from('contribution_reminders')
      .insert(reminderTemplates);

    if (templatesError) {
      console.error('Error creating reminder templates:', templatesError);
    }

    console.log('TiM batch created successfully:', batch.id);

    const successMessage = batchType === 'weekly' 
      ? 'Weekly TiM Chama batch created successfully! Merry-go-round will start automatically when full.'
      : 'Daily TiM Chama batch created successfully! 10-day cycle will start automatically when full.';

    return new Response(JSON.stringify({ 
      success: true, 
      batch,
      message: successMessage
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
