'use client';

import { Mail, Phone, RefreshCw, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
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

        {/* Cancel Message */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Checkout Cancelled
            </h1>
            <p className="text-gray-400">
              No worries! Your payment was not processed and you haven't been charged. 
              You can try again anytime or contact us if you need assistance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button 
              className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors"
              asChild
            >
              <Link href="/pricing">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                asChild
              >
                <Link href="/support" target="_blank">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                asChild
              >
                <Link href="/contact" target="_blank">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Common Issues */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Common Issues:</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div>• Ensure your card has sufficient funds</div>
              <div>• Check that your billing address matches</div>
              <div>• Try a different payment method</div>
              <div>• Clear browser cache and try again</div>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-300 mb-2">
              Not Ready to Subscribe Yet?
            </h3>
            <p className="text-xs text-blue-200 mb-3">
              No problem! You can still explore our platform with a free trial.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-blue-800 border-blue-700 text-blue-200 hover:bg-blue-700"
              asChild
            >
              <Link href="/trial">
                Start Free Trial
              </Link>
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              If you continue to experience issues, please contact our support team. 
              We're committed to helping you get started with {siteConfig.name}.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
