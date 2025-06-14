
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

    const { batchId } = await req.json();

    // Get batch details
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select(`
        *,
        batch_members (
          user_id,
          position,
          profiles (
            full_name
          )
        )
      `)
      .eq('id', batchId)
      .single();

    if (batchError || !batch) {
      return new Response(JSON.stringify({ error: 'Batch not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify user is the batch creator
    if (batch.created_by !== user.id) {
      return new Response(JSON.stringify({ error: 'Only batch creator can generate agreement' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate the legal agreement
    const agreementContent = generateTiMAgreement(batch);

    // Save or update the agreement
    const { data: agreement, error: agreementError } = await supabase
      .from('batch_agreements')
      .upsert({
        batch_id: batchId,
        agreement_content: agreementContent,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (agreementError) {
      console.error('Error saving agreement:', agreementError);
      return new Response(JSON.stringify({ error: 'Failed to save agreement' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Mark agreement as generated
    await supabase
      .from('batches')
      .update({ agreement_generated: true })
      .eq('id', batchId);

    return new Response(JSON.stringify({ 
      success: true, 
      agreement,
      message: 'TiM Chama agreement generated successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in generate-tim-agreement function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateTiMAgreement(batch: any): string {
  const totalContribution = batch.weekly_contribution + batch.service_fee_per_member;
  const weeklyPayout = batch.weekly_contribution * batch.max_members;
  const totalServiceFees = batch.service_fee_per_member * batch.max_members * batch.max_members;

  return `
# TiM CHAMA AGREEMENT

**Chama Name:** ${batch.name}
**Agreement Date:** ${new Date().toLocaleDateString()}
**Duration:** ${batch.max_members} weeks
**Organizer:** [To be signed by organizer]

## 1. MEMBER DETAILS

${batch.batch_members.map((member: any, index: number) => 
  `**Member ${index + 1}:** ${member.profiles?.full_name || `Member ${index + 1}`} - Position ${member.position}`
).join('\n')}

## 2. CONTRIBUTION STRUCTURE

- **Weekly Contribution per Member:** KES ${batch.weekly_contribution.toLocaleString()}
- **Weekly Service Fee per Member:** KES ${batch.service_fee_per_member.toLocaleString()}
- **Total Weekly Payment per Member:** KES ${totalContribution.toLocaleString()}
- **Total One-time Payment per Member:** KES ${(totalContribution * batch.max_members).toLocaleString()}

## 3. PAYOUT SCHEDULE

- **Weekly Payout Amount:** KES ${weeklyPayout.toLocaleString()}
- **Payout Start Date:** ${new Date(batch.payout_start_date).toLocaleDateString()}
- **Total Payout Weeks:** ${batch.max_members} weeks
- **Payout Order:** According to member position (Member 1 gets Week 1, Member 2 gets Week 2, etc.)

## 4. SERVICE FEE POLICY

- Service fees totaling KES ${totalServiceFees.toLocaleString()} will be collected by the organizer
- Service fees cover:
  - Administrative costs
  - M-Pesa transaction fees
  - Default risk management
  - Record keeping and communication

## 5. MEMBER OBLIGATIONS

### 5.1 Payment Requirements
- All members must pay their weekly contribution on or before the due date
- Payments must be made through the designated M-Pesa system
- Late payments will incur a penalty of 5% of the contribution amount per day

### 5.2 Communication
- Members must maintain updated contact information
- Respond to group communications within 24 hours
- Attend virtual or physical meetings as scheduled

### 5.3 Commitment
- Members commit to the full ${batch.max_members}-week cycle
- No voluntary exit allowed once the merry-go-round starts
- Full payment obligation remains even if missing meetings

## 6. DEFAULT HANDLING

### 6.1 Late Payment
- 1-3 days late: 5% penalty per day
- 4-7 days late: 10% penalty + formal warning
- Over 7 days late: Member forfeits payout turn and may be excluded

### 6.2 Non-Payment
- Members who fail to contribute forfeit their payout
- Their position is redistributed among remaining active members
- Legal action may be pursued for recovery

### 6.3 Emergency Situations
- Medical emergencies or genuine hardship will be considered
- Requires majority member vote and organizer approval
- Alternative payment arrangements may be made

## 7. EARLY EXIT TERMS

### 7.1 Before Payout Starts
- 50% penalty of total contribution if exiting before start date
- Replacement member must be found and approved

### 7.2 After Payout Starts
- No voluntary exit allowed
- Full payment obligation continues
- Forfeiture of future payout if contributions stop

## 8. PAYOUT ORDER AGREEMENT

All members agree to the following payout order:
${batch.batch_members.map((member: any, index: number) => 
  `Week ${index + 1}: ${member.profiles?.full_name || `Member ${index + 1}`}`
).join('\n')}

This order is binding and cannot be changed without unanimous consent.

## 9. ORGANIZER RESPONSIBILITIES

### 9.1 Financial Management
- Collect and track all contributions
- Process weekly payouts promptly
- Maintain transparent financial records
- Provide monthly statements to all members

### 9.2 Communication
- Send weekly payment reminders
- Coordinate group meetings
- Handle disputes and conflicts
- Maintain group cohesion

### 9.3 Legal Compliance
- Ensure all activities comply with local laws
- Maintain proper documentation
- Handle tax implications if any

## 10. DISPUTE RESOLUTION

### 10.1 Internal Resolution
- All disputes to be resolved through group discussion first
- Majority vote decides on contentious issues
- Organizer has casting vote in deadlocks

### 10.2 External Mediation
- Unresolved disputes may be taken to community elders
- Legal action as last resort
- All parties agree to honor mediation outcomes

## 11. TERMINATION CONDITIONS

The agreement terminates when:
- All ${batch.max_members} weeks are completed
- All members have received their payouts
- Unanimous vote to dissolve (before completion)
- Legal intervention requiring dissolution

## 12. AMENDMENTS

- Changes require 75% member approval
- Organizer must approve all amendments
- Written notice required 7 days before implementation
- Major changes may trigger early termination option

## 13. SIGNATURES

By signing below, all parties agree to abide by the terms and conditions outlined in this agreement.

**ORGANIZER:**
Name: ________________________
Signature: ____________________
Date: _________________________

**MEMBERS:**
${batch.batch_members.map((member: any, index: number) => 
  `Member ${index + 1}: ${member.profiles?.full_name || `Member ${index + 1}`}
Signature: ____________________
Date: _________________________`
).join('\n\n')}

---

**IMPORTANT LEGAL NOTICE:**
This agreement is legally binding under Kenyan law. All parties are advised to seek independent legal counsel before signing. The TiM platform facilitates this agreement but is not liable for disputes between members.

**Generated by TiM Platform on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}**
`;
}
