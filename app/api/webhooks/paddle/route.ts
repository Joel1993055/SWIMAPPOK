import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Paddle webhook verification
function verifyPaddleWebhook(payload: string, signature: string): boolean {
  const PADDLE_WEBHOOK_KEY = process.env.PADDLE_WEBHOOK_KEY;
  
  if (!PADDLE_WEBHOOK_KEY) {
    console.error('PADDLE_WEBHOOK_KEY not configured');
    return false;
  }

  try {
    // In a real implementation, you would verify the signature using Paddle's webhook verification
    // For now, we'll do a basic check
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', PADDLE_WEBHOOK_KEY)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('paddle-signature') || '';
    
    // Verify webhook signature
    if (!verifyPaddleWebhook(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Paddle webhook received:', event.event_type);

    // Handle different event types
    switch (event.event_type) {
      case 'transaction.completed':
        await handleTransactionCompleted(event.data);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;
      
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.data);
        break;
      
      case 'subscription.paused':
        await handleSubscriptionPaused(event.data);
        break;
      
      case 'subscription.resumed':
        await handleSubscriptionResumed(event.data);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleTransactionCompleted(data: any) {
  console.log('Transaction completed:', data);
  
  try {
    // Store transaction data in Supabase
    const { error } = await supabase
      .from('transactions')
      .insert({
        paddle_transaction_id: data.id,
        customer_id: data.customer_id,
        amount: data.details.totals.total,
        currency: data.details.totals.currency_code,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        raw_data: data
      });

    if (error) {
      console.error('Error storing transaction:', error);
    } else {
      console.log('Transaction stored successfully');
    }
  } catch (error) {
    console.error('Error handling transaction completed:', error);
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data);
  
  try {
    // Store subscription data in Supabase
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        paddle_subscription_id: data.id,
        customer_id: data.customer_id,
        product_id: data.items[0]?.price?.product_id,
        status: data.status,
        current_period_start: data.current_billing_period?.starts_at,
        current_period_end: data.current_billing_period?.ends_at,
        cancel_at_period_end: data.cancel_at_period_end,
        created_at: data.created_at,
        updated_at: data.updated_at,
        raw_data: data
      });

    if (error) {
      console.error('Error storing subscription:', error);
    } else {
      console.log('Subscription stored successfully');
      
      // Update user's subscription status
      await updateUserSubscriptionStatus(data.customer_id, 'active');
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  console.log('Subscription updated:', data);
  
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: data.status,
        current_period_start: data.current_billing_period?.starts_at,
        current_period_end: data.current_billing_period?.ends_at,
        cancel_at_period_end: data.cancel_at_period_end,
        updated_at: data.updated_at,
        raw_data: data
      })
      .eq('paddle_subscription_id', data.id);

    if (error) {
      console.error('Error updating subscription:', error);
    } else {
      console.log('Subscription updated successfully');
      
      // Update user's subscription status
      await updateUserSubscriptionStatus(data.customer_id, data.status);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCanceled(data: any) {
  console.log('Subscription canceled:', data);
  
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: data.canceled_at,
        updated_at: data.updated_at,
        raw_data: data
      })
      .eq('paddle_subscription_id', data.id);

    if (error) {
      console.error('Error updating canceled subscription:', error);
    } else {
      console.log('Subscription canceled successfully');
      
      // Update user's subscription status
      await updateUserSubscriptionStatus(data.customer_id, 'canceled');
    }
  } catch (error) {
    console.error('Error handling subscription canceled:', error);
  }
}

async function handleSubscriptionPaused(data: any) {
  console.log('Subscription paused:', data);
  
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'paused',
        paused_at: data.paused_at,
        updated_at: data.updated_at,
        raw_data: data
      })
      .eq('paddle_subscription_id', data.id);

    if (error) {
      console.error('Error updating paused subscription:', error);
    } else {
      console.log('Subscription paused successfully');
      
      // Update user's subscription status
      await updateUserSubscriptionStatus(data.customer_id, 'paused');
    }
  } catch (error) {
    console.error('Error handling subscription paused:', error);
  }
}

async function handleSubscriptionResumed(data: any) {
  console.log('Subscription resumed:', data);
  
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        resumed_at: data.resumed_at,
        updated_at: data.updated_at,
        raw_data: data
      })
      .eq('paddle_subscription_id', data.id);

    if (error) {
      console.error('Error updating resumed subscription:', error);
    } else {
      console.log('Subscription resumed successfully');
      
      // Update user's subscription status
      await updateUserSubscriptionStatus(data.customer_id, 'active');
    }
  } catch (error) {
    console.error('Error handling subscription resumed:', error);
  }
}

async function updateUserSubscriptionStatus(customerId: string, status: string) {
  try {
    // Find user by customer ID and update their subscription status
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('paddle_customer_id', customerId);

    if (error) {
      console.error('Error updating user subscription status:', error);
    } else {
      console.log(`User subscription status updated to: ${status}`);
    }
  } catch (error) {
    console.error('Error updating user subscription status:', error);
  }
}
