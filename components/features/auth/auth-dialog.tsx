'use client';

import { useState } from 'react';
import { signInAction, signUpAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubmitButton } from '@/components/forms/submit-button';
import { FormMessage, Message } from '@/components/forms/form-message';
import Link from 'next/link';

interface AuthDialogProps {
  trigger: React.ReactNode;
  mode: 'signin' | 'signup';
}

export function AuthDialog({ trigger, mode }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(mode);
  const [message, setMessage] = useState<Message | null>(null);

  const handleSignIn = async (formData: FormData) => {
    try {
      const result = await signInAction(formData);
      if (
        result &&
        typeof result === 'object' &&
        ('error' in result || 'message' in result)
      ) {
        setMessage(result as Message);
      } else {
        // Successful sign in - redirect will happen automatically
        setIsOpen(false);
        setMessage(null);
      }
    } catch {
      setMessage({ error: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleSignUp = async (formData: FormData) => {
    try {
      const result = await signUpAction(formData);
      if (
        result &&
        typeof result === 'object' &&
        ('error' in result || 'success' in result || 'message' in result)
      ) {
        setMessage(result as Message);
      } else {
        setIsOpen(false);
        setMessage(null);
      }
    } catch {
      setMessage({ error: 'An unexpected error occurred. Please try again.' });
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setMessage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </DialogTitle>
          <DialogDescription>
            {authMode === 'signin'
              ? 'Enter your credentials to access your account.'
              : 'Create a new account to get started.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {authMode === 'signin' ? (
            <form action={handleSignIn} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  required
                />
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <Link
                    href='/forgot-password'
                    className='text-xs text-muted-foreground underline hover:text-foreground'
                    onClick={() => setIsOpen(false)}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Your password'
                  required
                />
              </div>
              <SubmitButton pendingText='Signing In...' className='w-full'>
                Sign In
              </SubmitButton>
            </form>
          ) : (
            <form action={handleSignUp} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Your password'
                  minLength={6}
                  required
                />
              </div>
              <SubmitButton pendingText='Signing Up...' className='w-full'>
                Sign Up
              </SubmitButton>
            </form>
          )}

          {message && <FormMessage message={message} />}

          <div className='text-center text-sm'>
            {authMode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type='button'
                  onClick={toggleMode}
                  className='text-primary font-medium underline hover:no-underline'
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type='button'
                  onClick={toggleMode}
                  className='text-primary font-medium underline hover:no-underline'
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
