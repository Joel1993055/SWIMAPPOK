# Paddle Integration Setup

This project includes a complete Paddle integration for subscription management and payments.

## 🚀 Features

- **Pricing Page** (`/pricing`) - Display 3 subscription plans with Paddle checkout
- **Checkout Page** (`/checkout`) - Secure payment processing with Paddle
- **Success/Cancel Pages** - Handle payment completion and cancellation
- **Webhook API** (`/api/webhooks/paddle`) - Process Paddle events and update database
- **Type Safety** - Full TypeScript support for Paddle integration

## 📋 Setup Instructions

### 1. Paddle Account Setup

1. Create a Paddle account at [paddle.com](https://paddle.com)
2. Set up your products in the Paddle dashboard
3. Get your Vendor ID from account settings
4. Generate API keys and webhook keys

### 2. Environment Variables

Add these variables to your `.env.local` file:

```env
# Paddle Configuration
NEXT_PUBLIC_PADDLE_VENDOR_ID=your_vendor_id_here
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
PADDLE_WEBHOOK_KEY=your_webhook_key_here
PADDLE_API_KEY=your_api_key_here

# Product IDs (get from Paddle dashboard)
PADDLE_PRODUCT_STARTER_ID=pro_01h1234567890abcdef
PADDLE_PRODUCT_PRO_ID=pro_01h1234567890abcdef
PADDLE_PRODUCT_ENTERPRISE_ID=pro_01h1234567890abcdef

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Schema

Create these tables in your Supabase database:

```sql
-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paddle_transaction_id TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  raw_data JSONB NOT NULL
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paddle_subscription_id TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  resumed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  raw_data JSONB NOT NULL
);

-- Update users table to include subscription info
ALTER TABLE users ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
```

### 4. Webhook Configuration

1. In your Paddle dashboard, go to Developer Tools > Webhooks
2. Add a new webhook with URL: `https://yourdomain.com/api/webhooks/paddle`
3. Select these events:
   - `transaction.completed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.paused`
   - `subscription.resumed`

## 🎯 Usage

### Pricing Page

Visit `/pricing` to see the subscription plans. Each plan has a "Get Started" button that opens the Paddle checkout.

### Checkout Flow

1. User clicks "Get Started" on pricing page
2. Redirects to `/checkout?plan=Pro&product=pro_01h1234567890abcdef`
3. Paddle checkout opens automatically
4. On success: redirects to `/checkout/success`
5. On cancel: redirects to `/checkout/cancel`

### Webhook Processing

The webhook endpoint automatically:
- Verifies Paddle signatures
- Stores transaction/subscription data in Supabase
- Updates user subscription status
- Handles all subscription lifecycle events

## 🔧 Customization

### Plan Details

Edit `config/paddle.ts` to modify:
- Plan names and prices
- Feature lists
- Product IDs
- Checkout options

### Styling

All pages use the same design system as the marketing pages:
- Consistent color scheme
- Responsive design
- shadcn/ui components
- Tailwind CSS styling

### Webhook Events

Add new event handlers in `app/api/webhooks/paddle/route.ts`:
- `transaction.payment_failed`
- `subscription.payment_failed`
- `subscription.past_due`
- Custom business logic

## 🧪 Testing

### Sandbox Mode

1. Set `NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox`
2. Use Paddle's test payment methods
3. Test webhook events with Paddle's webhook testing tool

### Production Mode

1. Set `NEXT_PUBLIC_PADDLE_ENVIRONMENT=production`
2. Use real payment methods
3. Monitor webhook delivery in Paddle dashboard

## 📚 Resources

- [Paddle Documentation](https://developer.paddle.com/)
- [Paddle Checkout SDK](https://developer.paddle.com/getting-started/checkout-sdk)
- [Paddle Webhooks](https://developer.paddle.com/webhooks)
- [Paddle API Reference](https://developer.paddle.com/api-reference)

## 🚨 Security Notes

- Always verify webhook signatures
- Use HTTPS in production
- Store sensitive keys in environment variables
- Implement rate limiting on webhook endpoints
- Log all webhook events for debugging
