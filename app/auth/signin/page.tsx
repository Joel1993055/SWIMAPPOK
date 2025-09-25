'use client';

import { signInAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/forms/form-message';
import { SubmitButton } from '@/components/forms/submit-button';
import { SocialLogin } from '@/components/home/header/social-login';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function SignInPage() {
  const [message, setMessage] = useState<Message | null>(null);

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

        {/* Sign In Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email"
                name="email" 
                type="email"
                placeholder="you@example.com" 
                required 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              />
            </div>

            <SubmitButton 
              pendingText="Signing in..." 
              formAction={signInAction}
              className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors"
            >
              Sign in
            </SubmitButton>

            {message && <FormMessage message={message} />}
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLogin 
              onSuccess={() => window.location.href = '/dashboard'}
              onError={(error) => setMessage({ type: 'error', message: error })}
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                Sign up
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