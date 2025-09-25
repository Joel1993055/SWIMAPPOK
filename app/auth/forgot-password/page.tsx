'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
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
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-2">Check your email</h2>
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors"
              >
                Send another email
              </Button>
              
              <Link href="/auth/signin">
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Forgot Password Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Reset password</h2>
            <p className="text-gray-400">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email"
                name="email" 
                type="email"
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Remember your password?{' '}
              <Link 
                href="/auth/signin" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                Sign in
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
