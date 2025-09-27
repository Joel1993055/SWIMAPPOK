// Paddle SDK types
declare global {
  interface Window {
    Paddle?: {
      Setup: (config: PaddleConfig) => void;
      Checkout: {
        open: (options: PaddleCheckoutOptions) => void;
        close: () => void;
      };
    };
  }
}

export interface PaddleConfig {
  vendor: string;
  environment: 'sandbox' | 'production';
  eventCallback?: (data: PaddleEvent) => void;
}

export interface PaddleCheckoutOptions {
  product: string;
  successUrl?: string;
  closeUrl?: string;
  allowLogout?: boolean;
  frameTarget?: string;
  frameInitialHeight?: number;
  frameStyle?: string;
  customData?: Record<string, any>;
  quantity?: number;
  discountCode?: string;
  customer?: {
    email?: string;
    country?: string;
    postcode?: string;
  };
}

export interface PaddleEvent {
  name: string;
  data: any;
}

// Webhook event types
export interface PaddleWebhookEvent {
  event_type: string;
  data: PaddleWebhookData;
  created_at: string;
}

export interface PaddleWebhookData {
  id: string;
  customer_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface PaddleTransactionData extends PaddleWebhookData {
  details: {
    totals: {
      total: string;
      currency_code: string;
    };
  };
}

export interface PaddleSubscriptionData extends PaddleWebhookData {
  items: Array<{
    price: {
      product_id: string;
    };
  }>;
  current_billing_period?: {
    starts_at: string;
    ends_at: string;
  };
  cancel_at_period_end: boolean;
  canceled_at?: string;
  paused_at?: string;
  resumed_at?: string;
}

// Plan types
export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  paddleProductId: string;
  popular?: boolean;
}

export interface PlanDetails {
  STARTER: Plan;
  PRO: Plan;
  ENTERPRISE: Plan;
}

// Database types for Supabase
export interface Transaction {
  id?: string;
  paddle_transaction_id: string;
  customer_id: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  raw_data: any;
}

export interface Subscription {
  id?: string;
  paddle_subscription_id: string;
  customer_id: string;
  product_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  paused_at?: string;
  resumed_at?: string;
  created_at: string;
  updated_at: string;
  raw_data: any;
}

export interface User {
  id?: string;
  paddle_customer_id?: string;
  subscription_status?: string;
  created_at?: string;
  updated_at?: string;
}
