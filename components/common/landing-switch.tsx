'use client';

import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface LandingSwitchProps {
  onToggle: (showMarketing: boolean) => void;
  initialValue?: boolean;
}

export function LandingSwitch({
  onToggle,
  initialValue = false,
}: LandingSwitchProps) {
  const [showMarketing, setShowMarketing] = useState(initialValue);

  const handleToggle = (checked: boolean) => {
    setShowMarketing(checked);
    onToggle(checked);
  };

  return (
    <div className='flex items-center gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/20'>
      <span className='text-sm text-white'>
        {showMarketing ? 'Marketing' : 'Landing'}
      </span>
      <Switch
        checked={showMarketing}
        onCheckedChange={handleToggle}
        className='data-[state=checked]:bg-white data-[state=checked]:text-black'
      />
    </div>
  );
}
