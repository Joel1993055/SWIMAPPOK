'use client';

import { signInAction, signUpAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/forms/form-message';
import { SubmitButton } from '@/components/forms/submit-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';

interface AuthModalsProps {
  user: any;
}

export function AuthModals({ user }: AuthModalsProps) {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  if (user?.id) {
    return (
      <Button variant={"secondary"} asChild={true} size="lg" className="rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 font-medium px-6 py-2.5 transition-all duration-200">
        <a href={"/dashboard"}>Dashboard</a>
      </Button>
    );
  }

  return (
    <div className="flex space-x-3">
      {/* Sign In Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"} size="lg" className="rounded-full text-white hover:bg-white/10 backdrop-blur-sm font-medium px-6 py-2.5 transition-all duration-200">
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md !bg-white dark:!bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-2xl opacity-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium">Sign in</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <button 
                className="text-foreground font-medium underline hover:text-foreground/80"
                onClick={() => {
                  setIsSignInOpen(false);
                  setIsSignUpOpen(true);
                }}
              >
                Sign up
              </button>
            </p>
          </DialogHeader>
          <form className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="signin-email">Email</Label>
            <Input 
              id="signin-email"
              name="email" 
              placeholder="you@example.com" 
              required 
            />
            <div className="flex justify-between items-center">
              <Label htmlFor="signin-password">Password</Label>
              <Link
                className="text-xs text-foreground underline hover:text-foreground/80"
                href="/forgot-password"
                onClick={() => setIsSignInOpen(false)}
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="signin-password"
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
            <SubmitButton 
              pendingText="Signing In..." 
              formAction={signInAction}
            >
              Sign in
            </SubmitButton>
            {message && <FormMessage message={message} />}
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogTrigger asChild>
          <Button variant={"secondary"} size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 font-medium px-6 py-2.5 transition-all duration-200">
            Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md !bg-white dark:!bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-2xl opacity-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium">Sign up</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button 
                className="text-primary font-medium underline hover:text-primary/80"
                onClick={() => {
                  setIsSignUpOpen(false);
                  setIsSignInOpen(true);
                }}
              >
                Sign in
              </button>
            </p>
          </DialogHeader>
          <form className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="signup-email">Email</Label>
            <Input 
              id="signup-email"
              name="email" 
              placeholder="you@example.com" 
              required 
            />
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
            <SubmitButton 
              formAction={signUpAction} 
              pendingText="Signing up..."
            >
              Sign up
            </SubmitButton>
            {message && <FormMessage message={message} />}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}