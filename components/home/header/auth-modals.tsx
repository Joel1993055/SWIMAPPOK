'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthModalsProps {
  user: any;
}

export function AuthModals({ user }: AuthModalsProps) {
  if (user?.id) {
    return (
      <Button variant={"secondary"} asChild={true} size="lg" className="rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 font-medium px-6 py-2.5 transition-all duration-200">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  return (
    <div className="flex space-x-3">
      <Button variant={"ghost"} size="lg" className="rounded-full text-white hover:bg-white/10 backdrop-blur-sm font-medium px-6 py-2.5 transition-all duration-200" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      
      <Button variant={"secondary"} size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 font-medium px-6 py-2.5 transition-all duration-200" asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}