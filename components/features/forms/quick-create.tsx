'use client';

import { AIZoneDetection } from '@/components/features/training/ai-zone-detection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createSession } from '@/infra/config/actions/sessions';
import { Calendar, Plus, Save, X, Zap } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Data types
interface QuickSession {
  date: string;
  objective: string;
  time_slot: 'AM' | 'PM';
  content: string;
  zone_volumes: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
}

// Predefined options
const OBJECTIVE_OPTIONS = [
  { value: 'Endurance', label: 'Endurance', color: 'bg-blue-500' },
  { value: 'Speed', label: 'Speed', color: 'bg-red-500' },
  { value: 'Technique', label: 'Technique', color: 'bg-purple-500' },
  { value: 'Strength', label: 'Strength', color: 'bg-orange-500' },
  { value: 'Recovery', label: 'Recovery', color: 'bg-green-500' },
  { value: 'Competition', label: 'Competition', color: 'bg-yellow-500' },
];

interface QuickCreateProps {
  defaultDate?: string;
  defaultTimeSlot?: 'AM' | 'PM';
  trigger?: React.ReactNode;
}

export const QuickCreate = memo(function QuickCreate({ 
  defaultDate, 
  defaultTimeSlot = 'AM',
  trigger 
}: QuickCreateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<QuickSession>({
    date: defaultDate || new Date().toISOString().split('T')[0],
    objective: '',
    time_slot: defaultTimeSlot,
    content: '',
    zone_volumes: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
  });

  // Update session when props change
  useEffect(() => {
    setSession(prev => ({
      ...prev,
      date: defaultDate || prev.date,
      time_slot: defaultTimeSlot || prev.time_slot,
    }));
  }, [defaultDate, defaultTimeSlot]);

  const handleZoneVolumeChange = (
    zone: 'z1' | 'z2' | 'z3' | 'z4' | 'z5',
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;
    setSession(prev => ({
      ...prev,
      zone_volumes: {
        ...prev.zone_volumes,
        [zone]: numericValue,
      },
    }));
  };

  const calculateTotalMeters = () => {
    return Object.values(session.zone_volumes).reduce(
      (sum, volume) => sum + volume,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('date', session.date);
      formData.append('distance', totalMeters.toString()); // Use calculated total distance
      formData.append('stroke', 'Freestyle'); // Default stroke
      formData.append('rpe', '5'); // Default RPE
      formData.append('objective', session.objective);
      formData.append('time_slot', session.time_slot);
      formData.append('content', session.content);

      // Add volumes by zone
      formData.append('z1', session.zone_volumes.z1.toString());
      formData.append('z2', session.zone_volumes.z2.toString());
      formData.append('z3', session.zone_volumes.z3.toString());
      formData.append('z4', session.zone_volumes.z4.toString());
      formData.append('z5', session.zone_volumes.z5.toString());

      await createSession(formData);

      // Reset form
      setSession({
        date: new Date().toISOString().split('T')[0],
        distance: 0,
        objective: '',
        time_slot: 'AM',
        content: '',
        zone_volumes: { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 },
      });
      setIsOpen(false);

      // Reload page to show new training
      window.location.reload();
    } catch (error) {
      toast.error('Error saving training. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedObjective = OBJECTIVE_OPTIONS.find(
    s => s.value === session.objective
  );
  const totalMeters = calculateTotalMeters();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className='min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
            size='sm'
          >
            <Plus className='w-4 h-4 mr-2' />
            <span>Quick Create</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Zap className='w-5 h-5 text-primary' />
            Quick Create Training
          </DialogTitle>
          <DialogDescription>
            Add a new training session quickly and efficiently
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Main form */}
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold mb-3'>
                Training Details
              </h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Basic session information
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Date, Schedule and Objective */}
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='date' className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    Date
                  </Label>
                  <Input
                    id='date'
                    type='date'
                    value={session.date}
                    onChange={e =>
                      setSession({ ...session, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='time-slot'>Schedule</Label>
                  <Select
                    value={session.time_slot}
                    onValueChange={value =>
                      setSession({
                        ...session,
                        time_slot: value as 'AM' | 'PM',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select schedule' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='AM'>AM (Morning)</SelectItem>
                      <SelectItem value='PM'>PM (Afternoon/Evening)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label>Training Objective</Label>
                  <Select
                    value={session.objective}
                    onValueChange={value =>
                      setSession({ ...session, objective: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select objective' />
                    </SelectTrigger>
                    <SelectContent>
                      {OBJECTIVE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className='flex items-center gap-2'>
                            <div
                              className={`w-3 h-3 rounded-full ${option.color}`}
                            ></div>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Training content - LARGER */}
              <div className='space-y-2'>
                <Label htmlFor='content' className='text-base font-medium'>
                  Training Content
                </Label>
                <Textarea
                  id='content'
                  value={session.content}
                  onChange={e =>
                    setSession({ ...session, content: e.target.value })
                  }
                  placeholder='Write your training here... Example:&#10;&#10;Warm-up: 200m freestyle Z1&#10;Main set: 8x100m freestyle Z3 with 20s rest&#10;Cool-down: 200m backstroke Z1&#10;&#10;You can include:&#10;- Distances (200m, 1.5km)&#10;- Times (45min, 1h 30min)&#10;- Zones (Z1, Z2, Z3, Z4, Z5)&#10;- Styles (freestyle, backstroke, breaststroke, butterfly)'
                  rows={8}
                  className='min-h-[200px] resize-none'
                />
              </div>
            </form>
          </div>

          {/* Automatic AI detection */}
          <AIZoneDetection
            content={session.content}
            objective={session.objective}
            timeSlot={session.time_slot}
            onZonesDetected={(zones) => {
              setSession(prev => ({
                ...prev,
                zone_volumes: zones
              }));
            }}
            disabled={isLoading}
          />

          {/* Volumes by zone - Minimalist */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium text-muted-foreground'>
                Volumes by Zone
              </Label>
              <div className='text-xs text-muted-foreground'>
                Total:{' '}
                <span className='font-medium text-foreground'>
                  {totalMeters.toLocaleString()}m
                </span>
              </div>
            </div>

            {/* Compact zones grid */}
            <div className='grid grid-cols-5 gap-2'>
              {[
                {
                  zone: 'z1',
                  label: 'Z1',
                  color:
                    'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
                },
                {
                  zone: 'z2',
                  label: 'Z2',
                  color:
                    'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
                },
                {
                  zone: 'z3',
                  label: 'Z3',
                  color:
                    'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
                },
                {
                  zone: 'z4',
                  label: 'Z4',
                  color:
                    'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
                },
                {
                  zone: 'z5',
                  label: 'Z5',
                  color:
                    'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
                },
              ].map(({ zone, label, color }) => (
                <div key={zone} className={`p-2 rounded border ${color}`}>
                  <div className='text-xs text-muted-foreground text-center mb-1'>
                    {label}
                  </div>
                  <Input
                    id={zone}
                    type='number'
                    min='0'
                    step='50'
                    placeholder='0'
                    value={
                      session.zone_volumes[
                        zone as keyof typeof session.zone_volumes
                      ] || ''
                    }
                    onChange={e =>
                      handleZoneVolumeChange(
                        zone as 'z1' | 'z2' | 'z3' | 'z4' | 'z5',
                        e.target.value
                      )
                    }
                    className='text-center text-xs font-mono h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual summary */}
        {(session.distance > 0 || session.objective) && (
          <Card className='bg-muted/50 border-muted mt-6'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>
                Training Summary
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='flex items-center justify-between'>
                  <span>Total Distance:</span>
                  <Badge variant='outline'>{totalMeters}m</Badge>
                </div>
                {selectedObjective && (
                  <div className='flex items-center justify-between'>
                    <span>Objective:</span>
                    <Badge
                      variant='outline'
                      className={`${selectedObjective.color} text-white`}
                    >
                      {selectedObjective.label}
                    </Badge>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span>Schedule:</span>
                  <Badge variant='outline'>{session.time_slot}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span>Total Zones:</span>
                  <Badge variant='outline'>
                    {totalMeters.toLocaleString()}m
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
        <div className='flex justify-end gap-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsOpen(false)}
          >
            <X className='w-4 h-4 mr-2' />
            Cancel
          </Button>
          <Button type='submit' onClick={handleSubmit} disabled={isLoading}>
            <Save className='w-4 h-4 mr-2' />
            {isLoading ? 'Saving...' : 'Save Training'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
