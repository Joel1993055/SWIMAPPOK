'use client';

import { Badge } from '@/components/ui/badge';

export function DashboardHeader() {
  return (
    <div className='flex items-center justify-between space-y-2'>
      <div className='flex items-center space-x-2'>
        <Badge variant='outline' className='text-sm'>
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>
    </div>
  );
}
