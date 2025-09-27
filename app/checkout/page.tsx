'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Paddle configuration
const PADDLE_VENDOR_ID = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || 'your_vendor_id';
const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox';

const planDetails = {
  'Starter': {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individual swimmers and small teams',
    features: ['Up to 5 swimmers', 'Basic training plans', 'Progress tracking', 'Mobile app access']
  },
  'Pro': {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'Ideal for swimming clubs and competitive teams',
    features: ['Up to 25 swimmers', 'Advanced training plans', 'AI-powered zone detection', 'Team management tools']
  },
  'Enterprise': {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For large organizations and federations',
    features: ['Unlimited swimmers', 'Custom training methodologies', 'Advanced AI coaching', 'White-label options']
  }
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  const planName = searchParams.get('plan');
  const productId = searchParams.get('product');

  const plan = planName ? planDetails[planName as keyof typeof planDetails] : null;

  useEffect(() => {
    // Load Paddle SDK
    const loadPaddle = async () => {
      try {
        // Load Paddle script
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/paddle.js';
        script.async = true;
        script.onload = () => {
          // Initialize Paddle
          if (window.Paddle) {
            window.Paddle.Setup({
              vendor: PADDLE_VENDOR_ID,
              environment: PADDLE_ENVIRONMENT,
              eventCallback: (data: any) => {
                console.log('Paddle event:', data);
                if (data.name === 'checkout.completed') {
                  window.location.href = '/checkout/success';
                } else if (data.name === 'checkout.closed') {
                  window.location.href = '/checkout/cancel';
                }
              }
            });
            setPaddleLoaded(true);
          }
        };
        script.onerror = () => {
          setError('Failed to load payment processor');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to initialize payment system');
        setIsLoading(false);
      }
    };

    loadPaddle();
  }, []);

  useEffect(() => {
    if (paddleLoaded && plan && productId) {
      // Open Paddle checkout
      const openCheckout = () => {
        try {
          window.Paddle.Checkout.open({
            product: productId,
            successUrl: `${window.location.origin}/checkout/success`,
            closeUrl: `${window.location.origin}/checkout/cancel`,
            allowLogout: false,
            frameTarget: 'checkout-container',
            frameInitialHeight: 366,
            frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;'
          });
          setIsLoading(false);
        } catch (err) {
          setError('Failed to open checkout');
          setIsLoading(false);
        }
      };

      // Small delay to ensure Paddle is fully loaded
      const timer = setTimeout(openCheckout, 1000);
      return () => clearTimeout(timer);
    }
  }, [paddleLoaded, plan, productId]);

  if (!plan || !productId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Invalid Plan</CardTitle>
            <CardDescription>
              The selected plan is not valid. Please go back to pricing and try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <a href="/pricing">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <a href="/pricing">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            asChild 
            className="mb-4"
          >
            <a href="/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </a>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Secure checkout powered by Paddle
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Summary</span>
                <Badge variant="secondary">{plan.name}</Badge>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{plan.name} Plan</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {plan.price}<span className="text-sm text-gray-500">{plan.period}</span>
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">What's included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{plan.price}<span className="text-sm text-gray-500">{plan.period}</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Container */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Your payment is processed securely by Paddle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">Loading secure checkout...</p>
                </div>
              ) : (
                <div 
                  id="checkout-container" 
                  className="min-h-[400px] flex items-center justify-center"
                >
                  <div className="text-center text-gray-500">
                    <p>Checkout form will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center p-4">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <div className="text-sm text-green-800">
                <strong>Secure Payment:</strong> Your payment information is encrypted and processed securely by Paddle. 
                We never store your payment details.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
