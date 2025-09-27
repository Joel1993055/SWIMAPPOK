'use client';

import { ArrowRight, BarChart3, CheckCircle, Download, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
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

        {/* Success Message */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome to {siteConfig.name}!
            </h1>
            <p className="text-gray-400">
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center p-3 bg-gray-800/50 rounded-lg">
              <Users className="w-5 h-5 text-blue-400 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">Set Up Your Team</h3>
                <p className="text-xs text-gray-400">Add swimmers and coaches</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/team">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center p-3 bg-gray-800/50 rounded-lg">
              <Download className="w-5 h-5 text-green-400 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">Download Mobile App</h3>
                <p className="text-xs text-gray-400">Access on the go</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/download" target="_blank">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center p-3 bg-gray-800/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">View Analytics</h3>
                <p className="text-xs text-gray-400">Track progress</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/analytics">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Main CTA */}
          <Button 
            className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors"
            asChild
          >
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              You will receive a confirmation email shortly. Need help?{' '}
              <Link href="/support" className="text-white hover:text-gray-300">
                Contact Support
              </Link>
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
