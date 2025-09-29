'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { FormMessage, Message } from '@/components/forms/form-message';
import { SubmitButton } from '@/components/forms/submit-button';
import { SocialLogin } from '@/components/home/header/social-login';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAction } from '@/infra/config/actions';

const Login = () => {
  const [message, setMessage] = useState<Message | null>(null);

  return (
    <section className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0">
      <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray relative container border px-4 py-16 md:px-28 md:py-28 lg:px-32 lg:py-32">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image 
                className="w-auto h-16 mx-auto mb-4" 
                src="/DECKapp.svg" 
                width={200} 
                height={64} 
                alt="DECKapp" 
                priority
              />
            </Link>
          </div>

          <Card className="border-dark-gray bg-obsidian mx-auto w-full max-w-sm border">
            <CardHeader className="flex flex-col items-center space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
              <p className="text-muted-foreground mt-1 text-center text-sm">
                Sign in to your DECKapp account
              </p>
              
              {/* Social Login */}
              <SocialLogin 
                onSuccess={() => window.location.href = '/dashboard'}
                onError={(error) => setMessage({ type: 'error', message: error })}
              />
              
              <div className="text-muted-foreground flex w-full items-center text-sm">
                <span className="border-dark-gray w-full flex-grow border-t" />
                <span className="px-2 whitespace-nowrap">OR</span>
                <span className="border-dark-gray w-full flex-grow border-t" />
              </div>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="border-dark-gray bg-jet text-white placeholder-gray-400 focus:border-gray-600"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
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
                    className="border-dark-gray bg-jet text-white placeholder-gray-400 focus:border-gray-600"
                  />
                </div>

                <SubmitButton 
                  pendingText="Signing in..." 
                  formAction={signInAction}
                  className="mt-2 w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg transition-colors"
                >
                  Sign in
                </SubmitButton>

                {message && <FormMessage message={message} />}
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <Link 
                    href="/auth/signup" 
                    className="text-white hover:text-gray-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

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
    </section>
  );
};

export default Login;
