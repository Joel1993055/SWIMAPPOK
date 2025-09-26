'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';

export default function WeekInput() {
  const [week, setWeek] = React.useState('1');
  const [kilometers, setKilometers] = React.useState('');
  const [trainingType, setTrainingType] = React.useState('general');

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏃‍♂️ Kilometers Plan</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Week Selection */}
        <div className='space-y-2'>
          <Label htmlFor='week'>Select week</Label>
          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Week' />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 52 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Week {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Training Type */}
        <div className='space-y-2'>
          <Label htmlFor='trainingType'>Training type</Label>
          <Select value={trainingType} onValueChange={setTrainingType}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>General</SelectItem>
              <SelectItem value='specific'>Specific</SelectItem>
              <SelectItem value='competitive'>Competitive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kilometers Input */}
        <div className='space-y-2'>
          <Label htmlFor='kilometers'>Kilometers</Label>
          <Input
            id='kilometers'
            type='number'
            min='0'
            placeholder='Enter kilometers'
            value={kilometers}
            onChange={e => setKilometers(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
