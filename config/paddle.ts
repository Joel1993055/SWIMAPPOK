// Paddle configuration and utilities
export const PADDLE_CONFIG = {
  vendorId: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '',
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox',
  webhookKey: process.env.PADDLE_WEBHOOK_KEY || '',
  apiKey: process.env.PADDLE_API_KEY || '',
};

// Product IDs mapping
export const PADDLE_PRODUCTS = {
  STARTER: process.env.PADDLE_PRODUCT_STARTER_ID || 'starter_plan_id',
  PRO: process.env.PADDLE_PRODUCT_PRO_ID || 'pro_plan_id',
  ENTERPRISE: process.env.PADDLE_PRODUCT_ENTERPRISE_ID || 'enterprise_plan_id',
};

// Plan details for display
export const PLAN_DETAILS = {
  STARTER: {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individual swimmers and small teams',
    features: [
      'Up to 5 swimmers',
      'Basic training plans',
      'Progress tracking',
      'Mobile app access',
      'Email support',
      'Basic analytics'
    ],
    paddleProductId: PADDLE_PRODUCTS.STARTER
  },
  PRO: {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'Ideal for swimming clubs and competitive teams',
    features: [
      'Up to 25 swimmers',
      'Advanced training plans',
      'AI-powered zone detection',
      'Custom workout builder',
      'Team management tools',
      'Advanced analytics & reports',
      'Priority support',
      'API access'
    ],
    paddleProductId: PADDLE_PRODUCTS.PRO
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For large organizations and federations',
    features: [
      'Unlimited swimmers',
      'Custom training methodologies',
      'Advanced AI coaching',
      'White-label options',
      'Multi-club management',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom reporting'
    ],
    paddleProductId: PADDLE_PRODUCTS.ENTERPRISE
  }
};

// Paddle checkout options
export const CHECKOUT_OPTIONS = {
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
  closeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`,
  allowLogout: false,
  frameTarget: 'checkout-container',
  frameInitialHeight: 366,
  frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;'
};

// Utility functions
export const getPlanByProductId = (productId: string) => {
  return Object.values(PLAN_DETAILS).find(plan => plan.paddleProductId === productId);
};

export const getPlanByName = (name: string) => {
  return Object.values(PLAN_DETAILS).find(plan => plan.name === name);
};

// Paddle SDK initialization
export const initializePaddle = () => {
  if (typeof window !== 'undefined' && window.Paddle) {
    window.Paddle.Setup({
      vendor: PADDLE_CONFIG.vendorId,
      environment: PADDLE_CONFIG.environment,
      eventCallback: (data: any) => {
        console.log('Paddle event:', data);
        if (data.name === 'checkout.completed') {
          window.location.href = CHECKOUT_OPTIONS.successUrl;
        } else if (data.name === 'checkout.closed') {
          window.location.href = CHECKOUT_OPTIONS.closeUrl;
        }
      }
    });
    return true;
  }
  return false;
};

// Open Paddle checkout
export const openPaddleCheckout = (productId: string, customOptions: any = {}) => {
  if (typeof window !== 'undefined' && window.Paddle) {
    const options = {
      product: productId,
      ...CHECKOUT_OPTIONS,
      ...customOptions
    };
    
    window.Paddle.Checkout.open(options);
    return true;
  }
  return false;
};
