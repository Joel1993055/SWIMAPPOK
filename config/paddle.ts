// Paddle configuration and utilities
export const PADDLE_CONFIG = {
  vendorId: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '',
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox',
  webhookKey: process.env.PADDLE_WEBHOOK_KEY || '',
  apiKey: process.env.PADDLE_API_KEY || '',
};

// Product IDs mapping
export const PADDLE_PRODUCTS = {
  SWIM_PRO_MONTHLY: process.env.PADDLE_PRODUCT_MONTHLY_ID || 'swim_pro_monthly_id',
  SWIM_PRO_ANNUAL: process.env.PADDLE_PRODUCT_ANNUAL_ID || 'swim_pro_annual_id',
};

// Plan details for display
export const PLAN_DETAILS = {
  SWIM_PRO: {
    name: 'Swim Pro',
    monthlyPrice: '€6',
    annualPrice: '€60',
    monthlyPeriod: '/month',
    annualPeriod: '/year',
    description: 'Complete training planning and analysis platform for swimming coaches',
    features: [
      'Unlimited swimmers and groups',
      'Advanced training planning with phases',
      'AI-powered automatic zone analysis',
      'Integrated calendar for sessions and competitions',
      'Detailed PDF reports',
      'Dashboard with key metrics',
      'Email support',
      '7-day free trial'
    ],
    monthlyProductId: PADDLE_PRODUCTS.SWIM_PRO_MONTHLY,
    annualProductId: PADDLE_PRODUCTS.SWIM_PRO_ANNUAL
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
