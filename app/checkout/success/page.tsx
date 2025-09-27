'use client';

import { CheckCircle, ArrowRight, Download, Users, BarChart3 } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to {siteConfig.name}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your subscription has been activated successfully. You now have access to all premium features.
          </p>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">What's Next?</CardTitle>
              <CardDescription>
                Here are some recommended next steps to get the most out of your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Set Up Your Team</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add swimmers and coaches to your account
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/team">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>

                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Download Mobile App</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Access your training data on the go
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/download" target="_blank">
                      Download
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>

                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">View Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Track progress and performance metrics
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/analytics">
                      View Reports
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Information */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">?</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Need Help Getting Started?
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Our support team is here to help you make the most of your subscription. 
                    Check out our documentation or contact us directly.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/docs" target="_blank">
                        View Documentation
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/support" target="_blank">
                        Contact Support
                      </a>
                    </Button>
                  </div>
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
            <a href="/dashboard">
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-gray-500 text-sm">
            You will receive a confirmation email with your subscription details shortly. 
            If you have any questions, please don't hesitate to contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
