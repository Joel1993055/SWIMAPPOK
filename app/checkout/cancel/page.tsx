'use client';

import { XCircle, ArrowLeft, RefreshCw, Mail, Phone } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Cancel Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Checkout Cancelled
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No worries! Your payment was not processed and you haven't been charged. 
            You can try again anytime or contact us if you need assistance.
          </p>
        </div>

        {/* Action Cards */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Try Again */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Try Again</CardTitle>
                <CardDescription>
                  Ready to get started? Return to our pricing page and select your plan.
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

            {/* Get Help */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Need Help?</CardTitle>
                <CardDescription>
                  Having trouble with checkout? Our support team is here to help.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <Button variant="outline" asChild className="w-full">
                  <a href="/support" target="_blank">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/contact" target="_blank">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Us
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Common Issues */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Common Checkout Issues</CardTitle>
              <CardDescription className="text-center">
                Here are some solutions to common problems you might encounter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Method Issues</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ensure your card has sufficient funds</li>
                    <li>• Check that your billing address matches</li>
                    <li>• Try a different payment method</li>
                    <li>• Contact your bank if blocked</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Issues</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Clear your browser cache and cookies</li>
                    <li>• Try a different browser</li>
                    <li>• Disable ad blockers temporarily</li>
                    <li>• Check your internet connection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alternative Options */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Not Ready to Subscribe Yet?
                </h3>
                <p className="text-blue-800 mb-4">
                  No problem! You can still explore our platform with a free trial or contact us 
                  to discuss custom solutions for your organization.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="outline" asChild>
                    <a href="/trial">
                      Start Free Trial
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/demo">
                      Schedule Demo
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/enterprise">
                      Enterprise Solutions
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            asChild
          >
            <a href="/pricing">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Pricing
            </a>
          </Button>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-gray-500 text-sm">
            If you continue to experience issues, please contact our support team. 
            We're committed to helping you get started with {siteConfig.name}.
          </p>
        </div>
      </div>
    </div>
  );
}
