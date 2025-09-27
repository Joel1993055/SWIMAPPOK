'use client';

import { Check, Star } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individual swimmers and small teams',
    price: '$29',
    period: '/month',
    features: [
      'Up to 5 swimmers',
      'Basic training plans',
      'Progress tracking',
      'Mobile app access',
      'Email support',
      'Basic analytics'
    ],
    paddleProductId: 'starter_plan_id', // Replace with actual Paddle product ID
    popular: false
  },
  {
    name: 'Pro',
    description: 'Ideal for swimming clubs and competitive teams',
    price: '$79',
    period: '/month',
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
    paddleProductId: 'pro_plan_id', // Replace with actual Paddle product ID
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For large organizations and federations',
    price: '$199',
    period: '/month',
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
    paddleProductId: 'enterprise_plan_id', // Replace with actual Paddle product ID
    popular: false
  }
];

export default function PricingPage() {
  const handleGetStarted = (planName: string, paddleProductId: string) => {
    // Redirect to checkout page with plan information
    window.location.href = `/checkout?plan=${encodeURIComponent(planName)}&product=${encodeURIComponent(paddleProductId)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of swimming training with our comprehensive platform. 
            Start with any plan and upgrade as your team grows.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={cn(
                "relative transition-all duration-300 hover:shadow-xl",
                plan.popular && "border-blue-500 shadow-lg scale-105"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="px-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <Button 
                  className={cn(
                    "w-full py-3 text-lg font-semibold transition-all duration-300",
                    plan.popular 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  )}
                  onClick={() => handleGetStarted(plan.name, plan.paddleProductId)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for all plans. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers through our secure payment processor.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all new subscriptions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Swimming Training?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of coaches and swimmers who trust our platform.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-blue-600 bg-white hover:bg-gray-100"
              onClick={() => handleGetStarted('Pro', 'pro_plan_id')}
            >
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
