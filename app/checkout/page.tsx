'use client';

import { ArrowLeft, CheckCircle, CreditCard, Loader2, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

function CheckoutContent() {
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
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-4">
            <Link href="/" className="inline-block">
              <Image 
                className="w-auto h-48 mx-auto mb-2" 
                src="/DECKapp.svg" 
                width={600} 
                height={192} 
                alt="DeckAPP" 
                priority
              />
            </Link>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Invalid Plan</h2>
              <p className="text-gray-400">The selected plan is not valid. Please go back to pricing and try again.</p>
            </div>
            <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors">
              <Link href="/pricing">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-4">
            <Link href="/" className="inline-block">
              <Image 
                className="w-auto h-48 mx-auto mb-2" 
                src="/DECKapp.svg" 
                width={600} 
                height={192} 
                alt="DeckAPP" 
                priority
              />
            </Link>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Error</h2>
              <p className="text-gray-400">{error}</p>
            </div>
            <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors">
              <Link href="/pricing">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image 
              className="w-auto h-32 mx-auto" 
              src="/DECKapp.svg" 
              width={400} 
              height={128} 
              alt="DeckAPP" 
              priority
            />
          </Link>
          <Button 
            variant="ghost" 
            asChild 
            className="mb-4 text-gray-400 hover:text-white"
          >
            <Link href="/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-400">
            Secure checkout powered by Paddle
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Order Summary</h2>
              <Badge variant="secondary" className="bg-gray-800 text-gray-200">{plan.name}</Badge>
            </div>
            <p className="text-gray-400 mb-6">{plan.description}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">{plan.name} Plan</span>
                <span className="text-2xl font-bold text-white">
                  {plan.price}<span className="text-sm text-gray-400">{plan.period}</span>
                </span>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-white mb-2">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-white">{plan.price}<span className="text-sm text-gray-400">{plan.period}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Container */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-5 h-5 mr-2 text-white" />
              <h2 className="text-xl font-semibold text-white">Payment Details</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Your payment is processed securely by Paddle
            </p>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
                <p className="text-gray-400">Loading secure checkout...</p>
              </div>
            ) : (
              <div 
                id="checkout-container" 
                className="min-h-[400px] flex items-center justify-center"
              >
                <div className="text-center text-gray-400">
                  <p>Checkout form will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8">
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-400 mr-3" />
              <div className="text-sm text-green-300">
                <strong>Secure Payment:</strong> Your payment information is encrypted and processed securely by Paddle. 
                We never store your payment details.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-4">
            <Link href="/" className="inline-block">
              <Image 
                className="w-auto h-48 mx-auto mb-2" 
                src="/DECKapp.svg" 
                width={600} 
                height={192} 
                alt="DeckAPP" 
                priority
              />
            </Link>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
            <div className="text-center mb-6">
              <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Loading Checkout</h2>
              <p className="text-gray-400">Please wait while we prepare your checkout...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
