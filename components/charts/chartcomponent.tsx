'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSessions, type Session } from '@/infra/config/actions/sessions';
import {
  calculateZoneVolumes,
  metersToKm,
  zoneColors,
  zoneLabels,
} from '@/core/utils/zone-detection';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

// Function to generate real data based on sessions using unified zone system
const generateRealData = (sessions: Session[], period: string) => {
  const now = new Date();

  if (period === '7days') {
    // Last 7 days
    const days: {
      date: string;
      Z1: number;
      Z2: number;
      Z3: number;
      Z4: number;
      Z5: number;
    }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const daySessions = sessions.filter((s) => s.date === dateString);
      const zoneVolumes = calculateZoneVolumes(daySessions);

      days.push({
        date: dateString,
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
      });
    }
    return days;
  } else if (period === '30days') {
    // Last 30 days
    const days: {
      date: string;
      Z1: number;
      Z2: number;
      Z3: number;
      Z4: number;
      Z5: number;
    }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const daySessions = sessions.filter((s) => s.date === dateString);
      const zoneVolumes = calculateZoneVolumes(daySessions);

      days.push({
        date: dateString,
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
      });
    }
    return days;
  } else {
    // Whole year - by months
    const months: {
      date: string;
      Z1: number;
      Z2: number;
      Z3: number;
      Z4: number;
      Z5: number;
    }[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const zoneVolumes = calculateZoneVolumes(monthSessions);

      months.push({
        date: date.toISOString().split('T')[0],
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
      });
    }
    return months;
  }
};

// Function to generate sample data (fallback)
const generateDataUntilToday = () => {
  const data = [
    { date: '2024-04-01', Z1: 222, Z2: 150, Z3: 180, Z4: 120, Z5: 90 },
    { date: '2024-04-02', Z1: 97, Z2: 180, Z3: 140, Z4: 110, Z5: 80 },
    { date: '2024-04-03', Z1: 167, Z2: 120, Z3: 160, Z4: 130, Z5: 100 },
    { date: '2024-04-04', Z1: 242, Z2: 260, Z3: 200, Z4: 150, Z5: 120 },
    { date: '2024-04-05', Z1: 373, Z2: 290, Z3: 220, Z4: 180, Z5: 140 },
    { date: '2024-04-06', Z1: 301, Z2: 340, Z3: 240, Z4: 200, Z5: 160 },
    { date: '2024-04-07', Z1: 245, Z2: 180, Z3: 160, Z4: 120, Z5: 90 },
    { date: '2024-04-08', Z1: 409, Z2: 320, Z3: 280, Z4: 220, Z5: 180 },
    { date: '2024-04-09', Z1: 59, Z2: 110, Z3: 100, Z4: 80, Z5: 60 },
    { date: '2024-04-10', Z1: 261, Z2: 190, Z3: 160, Z4: 130, Z5: 100 },
    { date: '2024-04-11', Z1: 327, Z2: 350, Z3: 280, Z4: 240, Z5: 200 },
    { date: '2024-04-12', Z1: 292, Z2: 210, Z3: 180, Z4: 150, Z5: 120 },
    { date: '2024-04-13', Z1: 342, Z2: 380, Z3: 300, Z4: 260, Z5: 220 },
    { date: '2024-04-14', Z1: 137, Z2: 220, Z3: 180, Z4: 140, Z5: 110 },
    { date: '2024-04-15', Z1: 120, Z2: 170, Z3: 140, Z4: 110, Z5: 90 },
    { date: '2024-04-16', Z1: 138, Z2: 190, Z3: 160, Z4: 130, Z5: 100 },
    { date: '2024-04-17', Z1: 446, Z2: 360, Z3: 300, Z4: 260, Z5: 220 },
    { date: '2024-04-18', Z1: 364, Z2: 410, Z3: 340, Z4: 300, Z5: 260 },
    { date: '2024-04-19', Z1: 243, Z2: 180, Z3: 160, Z4: 130, Z5: 100 },
    { date: '2024-04-20', Z1: 89, Z2: 150, Z3: 120, Z4: 100, Z5: 80 },
    { date: '2024-04-21', Z1: 137, Z2: 200, Z3: 160, Z4: 130, Z5: 100 },
    { date: '2024-04-22', Z1: 224, Z2: 170, Z3: 140, Z4: 120, Z5: 90 },
    { date: '2024-04-23', Z1: 138, Z2: 230, Z3: 180, Z4: 150, Z5: 120 },
    { date: '2024-04-24', Z1: 387, Z2: 290, Z3: 240, Z4: 200, Z5: 160 },
    { date: '2024-04-25', Z1: 215, Z2: 250, Z3: 200, Z4: 170, Z5: 140 },
    { date: '2024-04-26', Z1: 75, Z2: 130, Z3: 110, Z4: 90, Z5: 70 },
    { date: '2024-04-27', Z1: 383, Z2: 420, Z3: 340, Z4: 300, Z5: 260 },
    { date: '2024-04-28', Z1: 122, Z2: 180, Z3: 150, Z4: 120, Z5: 100 },
    { date: '2024-04-29', Z1: 315, Z2: 240, Z3: 200, Z4: 170, Z5: 140 },
    { date: '2024-04-30', Z1: 454, Z2: 380, Z3: 300, Z4: 260, Z5: 220 },
    { date: '2024-05-01', Z1: 165, Z2: 220, Z3: 180, Z4: 150, Z5: 120 },
    { date: '2024-05-02', Z1: 293, Z2: 310, Z3: 260, Z4: 220, Z5: 180 },
    { date: '2024-05-03', Z1: 247, Z2: 190, Z3: 160, Z4: 130, Z5: 100 },
    { date: '2024-05-04', Z1: 385, Z2: 420, Z3: 340, Z4: 300, Z5: 260 },
    { date: '2024-05-05', Z1: 481, Z2: 390, Z3: 320, Z4: 280, Z5: 240 },
    { date: '2024-05-06', Z1: 498, Z2: 520, Z3: 420, Z4: 380, Z5: 340 },
    { date: '2024-05-07', Z1: 388, Z2: 300, Z3: 250, Z4: 220, Z5: 180 },
    { date: '2024-05-08', Z1: 149, Z2: 210, Z3: 180, Z4: 150, Z5: 120 },
    { date: '2024-05-09', Z1: 227, Z2: 180, Z3: 150, Z4: 130, Z5: 100 },
    { date: '2024-05-10', Z1: 293, Z2: 330, Z3: 280, Z4: 240, Z5: 200 },
    { date: '2024-05-11', Z1: 335, Z2: 270, Z3: 220, Z4: 190, Z5: 160 },
    { date: '2024-05-12', Z1: 197, Z2: 240, Z3: 200, Z4: 170, Z5: 140 },
    { date: '2024-05-13', Z1: 197, Z2: 160, Z3: 140, Z4: 120, Z5: 100 },
    { date: '2024-05-14', Z1: 448, Z2: 490, Z3: 400, Z4: 360, Z5: 320 },
    { date: '2024-05-15', Z1: 473, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
    { date: '2024-05-16', Z1: 338, Z2: 400, Z3: 340, Z4: 300, Z5: 260 },
    { date: '2024-05-17', Z1: 499, Z2: 420, Z3: 360, Z4: 320, Z5: 280 },
    { date: '2024-05-18', Z1: 315, Z2: 350, Z3: 300, Z4: 260, Z5: 220 },
    { date: '2024-05-19', Z1: 235, Z2: 180, Z3: 150, Z4: 130, Z5: 100 },
    { date: '2024-05-20', Z1: 177, Z2: 230, Z3: 190, Z4: 160, Z5: 130 },
    { date: '2024-05-21', Z1: 82, Z2: 140, Z3: 120, Z4: 100, Z5: 80 },
    { date: '2024-05-22', Z1: 81, Z2: 120, Z3: 100, Z4: 90, Z5: 70 },
    { date: '2024-05-23', Z1: 252, Z2: 290, Z3: 240, Z4: 200, Z5: 170 },
    { date: '2024-05-24', Z1: 294, Z2: 220, Z3: 180, Z4: 160, Z5: 130 },
    { date: '2024-05-25', Z1: 201, Z2: 250, Z3: 200, Z4: 180, Z5: 150 },
    { date: '2024-05-26', Z1: 213, Z2: 170, Z3: 150, Z4: 130, Z5: 110 },
    { date: '2024-05-27', Z1: 420, Z2: 460, Z3: 380, Z4: 340, Z5: 300 },
    { date: '2024-05-28', Z1: 233, Z2: 190, Z3: 160, Z4: 140, Z5: 120 },
    { date: '2024-05-29', Z1: 78, Z2: 130, Z3: 110, Z4: 100, Z5: 80 },
    { date: '2024-05-30', Z1: 340, Z2: 280, Z3: 240, Z4: 200, Z5: 170 },
    { date: '2024-05-31', Z1: 178, Z2: 230, Z3: 190, Z4: 160, Z5: 130 },
    { date: '2024-06-01', Z1: 178, Z2: 200, Z3: 170, Z4: 150, Z5: 120 },
    { date: '2024-06-02', Z1: 470, Z2: 410, Z3: 340, Z4: 300, Z5: 260 },
    { date: '2024-06-03', Z1: 103, Z2: 160, Z3: 140, Z4: 120, Z5: 100 },
    { date: '2024-06-04', Z1: 439, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
    { date: '2024-06-05', Z1: 88, Z2: 140, Z3: 120, Z4: 100, Z5: 80 },
    { date: '2024-06-06', Z1: 294, Z2: 250, Z3: 210, Z4: 180, Z5: 150 },
    { date: '2024-06-07', Z1: 323, Z2: 370, Z3: 300, Z4: 260, Z5: 220 },
    { date: '2024-06-08', Z1: 385, Z2: 320, Z3: 260, Z4: 230, Z5: 190 },
    { date: '2024-06-09', Z1: 438, Z2: 480, Z3: 400, Z4: 360, Z5: 320 },
    { date: '2024-06-10', Z1: 155, Z2: 200, Z3: 170, Z4: 150, Z5: 120 },
    { date: '2024-06-11', Z1: 92, Z2: 150, Z3: 130, Z4: 110, Z5: 90 },
    { date: '2024-06-12', Z1: 492, Z2: 420, Z3: 360, Z4: 320, Z5: 280 },
    { date: '2024-06-13', Z1: 81, Z2: 130, Z3: 110, Z4: 100, Z5: 80 },
    { date: '2024-06-14', Z1: 426, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
    { date: '2024-06-15', Z1: 307, Z2: 350, Z3: 300, Z4: 260, Z5: 220 },
    { date: '2024-06-16', Z1: 371, Z2: 310, Z3: 260, Z4: 230, Z5: 190 },
    { date: '2024-06-17', Z1: 475, Z2: 520, Z3: 440, Z4: 400, Z5: 360 },
    { date: '2024-06-18', Z1: 107, Z2: 170, Z3: 150, Z4: 130, Z5: 110 },
    { date: '2024-06-19', Z1: 341, Z2: 290, Z3: 250, Z4: 220, Z5: 190 },
    { date: '2024-06-20', Z1: 408, Z2: 450, Z3: 380, Z4: 340, Z5: 300 },
    { date: '2024-06-21', Z1: 169, Z2: 210, Z3: 180, Z4: 160, Z5: 130 },
    { date: '2024-06-22', Z1: 317, Z2: 270, Z3: 230, Z4: 200, Z5: 170 },
    { date: '2024-06-23', Z1: 480, Z2: 530, Z3: 450, Z4: 410, Z5: 370 },
    { date: '2024-06-24', Z1: 132, Z2: 180, Z3: 150, Z4: 130, Z5: 110 },
    { date: '2024-06-25', Z1: 141, Z2: 190, Z3: 160, Z4: 140, Z5: 120 },
    { date: '2024-06-26', Z1: 434, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
    { date: '2024-06-27', Z1: 448, Z2: 490, Z3: 400, Z4: 360, Z5: 320 },
    { date: '2024-06-28', Z1: 149, Z2: 200, Z3: 170, Z4: 150, Z5: 120 },
    { date: '2024-06-29', Z1: 103, Z2: 160, Z3: 140, Z4: 120, Z5: 100 },
    { date: '2024-06-30', Z1: 446, Z2: 400, Z3: 340, Z4: 300, Z5: 260 },
  ];

  // Extend data up to the current date
  const lastDate = new Date('2024-06-30');
  const today = new Date();

  // Generate data from July 1, 2024 to today
  const currentDate = new Date(lastDate);
  currentDate.setDate(currentDate.getDate() + 1);

  while (currentDate <= today) {
    // Generate realistic random values based on existing data
    const baseZ1 = 200 + Math.random() * 300;
    const baseZ2 = 150 + Math.random() * 250;
    const baseZ3 = 120 + Math.random() * 200;
    const baseZ4 = 100 + Math.random() * 150;
    const baseZ5 = 80 + Math.random() * 120;

    data.push({
      date: currentDate.toISOString().split('T')[0],
      Z1: Math.round(baseZ1),
      Z2: Math.round(baseZ2),
      Z3: Math.round(baseZ3),
      Z4: Math.round(baseZ4),
      Z5: Math.round(baseZ5),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

// Generate complete data (done dynamically in component)

// Chart configuration with 5 zones
const chartConfig = {
  Z1: {
    label: zoneLabels.Z1,
    color: zoneColors.Z1,
  },
  Z2: {
    label: zoneLabels.Z2,
    color: zoneColors.Z2,
  },
  Z3: {
    label: zoneLabels.Z3,
    color: zoneColors.Z3,
  },
  Z4: {
    label: zoneLabels.Z4,
    color: zoneColors.Z4,
  },
  Z5: {
    label: zoneLabels.Z5,
    color: zoneColors.Z5,
  },
} satisfies ChartConfig;

export default function ChartComponent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = React.useState('30days');

  // Load real sessions from Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error loading sessions:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Generate real data based on range
  const realData = generateRealData(sessions, timeRange);
  const chartData = realData.length > 0 ? realData : generateDataUntilToday();

  // Function to group data by months
  const groupDataByMonths = (data: typeof chartData) => {
    const monthlyData: Record<
      string,
      {
        Z1: number;
        Z2: number;
        Z3: number;
        Z4: number;
        Z5: number;
        count: number;
        month: string;
      }
    > = {};

    // First, process existing data
    data.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          Z1: 0,
          Z2: 0,
          Z3: 0,
          Z4: 0,
          Z5: 0,
          count: 0,
          month: monthName,
        };
      }

      monthlyData[monthKey].Z1 += item.Z1;
      monthlyData[monthKey].Z2 += item.Z2;
      monthlyData[monthKey].Z3 += item.Z3;
      monthlyData[monthKey].Z4 += item.Z4;
      monthlyData[monthKey].Z5 += item.Z5;
      monthlyData[monthKey].count += 1;
    });

    // Generate missing months according to range
    if (timeRange === '1y') {
      // Whole year - generate all months from January 2024 to current month 2025
      const currentDate = new Date();
      const startYear = 2024;
      const endYear = currentDate.getFullYear();

      for (let year = startYear; year <= endYear; year++) {
        const monthsInYear = year === endYear ? currentDate.getMonth() + 1 : 12;

        for (let month = 0; month < monthsInYear; month++) {
          const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
          const monthName = new Date(year, month, 1).toLocaleDateString(
            'en-US',
            { month: 'short', year: 'numeric' }
          );

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              Z1: 0,
              Z2: 0,
              Z3: 0,
              Z4: 0,
              Z5: 0,
              count: 1,
              month: monthName,
            };
          }
        }
      }
    } else if (timeRange === '180d' || timeRange === '90d') {
      // For 6 and 3 months, generate the months in the range
      const currentDate = new Date();
      const monthsToGenerate = timeRange === '180d' ? 6 : 3;

      for (let i = 0; i < monthsToGenerate; i++) {
        const targetDate = new Date(currentDate);
        targetDate.setMonth(targetDate.getMonth() - i);

        const monthKey = `${targetDate.getFullYear()}-${String(
          targetDate.getMonth() + 1
        ).padStart(2, '0')}`;
        const monthName = targetDate.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            Z1: 0,
            Z2: 0,
            Z3: 0,
            Z4: 0,
            Z5: 0,
            count: 1,
            month: monthName,
          };
        }
      }
    }

    // Convert to array and compute averages
    return Object.entries(monthlyData)
      .map(([, data]) => ({
        month: data.month,
        Z1: data.count > 0 ? Math.round(data.Z1 / data.count) : 0,
        Z2: data.count > 0 ? Math.round(data.Z2 / data.count) : 0,
        Z3: data.count > 0 ? Math.round(data.Z3 / data.count) : 0,
        Z4: data.count > 0 ? Math.round(data.Z4 / data.count) : 0,
        Z5: data.count > 0 ? Math.round(data.Z5 / data.count) : 0,
      }))
      .sort((a, b) => {
        // Sort by real date - extract year and month correctly
        const parseMonth = (monthStr: string) => {
          const [monthName, year] = monthStr.split(' ');
          const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
          return new Date(parseInt(year), monthIndex, 1);
        };

        const dateA = parseMonth(a.month);
        const dateB = parseMonth(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Function to format daily data
  const formatDailyData = (data: typeof chartData) => {
    return data.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      Z1: item.Z1,
      Z2: item.Z2,
      Z3: item.Z3,
      Z4: item.Z4,
      Z5: item.Z5,
    }));
  };

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);

    if (timeRange === '1y') {
      // Whole year - show all data
      return true;
    }

    // Use the current date as a reference
    const referenceDate = new Date();

    if (timeRange === '180d') {
      // Last 6 months - subtract 6 months
      const startDate = new Date(referenceDate);
      startDate.setMonth(startDate.getMonth() - 6);
      return date >= startDate;
    } else if (timeRange === '90d') {
      // Last 3 months - subtract 3 months
      const startDate = new Date(referenceDate);
      startDate.setMonth(startDate.getMonth() - 3);
      return date >= startDate;
    } else if (timeRange === '30d') {
      // Last 30 days
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 30);
      return date >= startDate;
    } else if (timeRange === '7d') {
      // Last 7 days
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 7);
      return date >= startDate;
    }

    return true;
  });

  // Decide whether to show data by months or by days
  const shouldGroupByMonths = timeRange === 'year';
  const finalChartData = shouldGroupByMonths
    ? groupDataByMonths(filteredData)
    : formatDailyData(filteredData);

  // Loading state
  if (isLoading) {
    return (
      <Card className='bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle>Zone Distribution</CardTitle>
          <CardDescription>
            Training volume by intensity zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[400px] flex items-center justify-center'>
            <div className='animate-pulse text-muted-foreground'>
              Loading data...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-muted/50 border-muted'>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>
            {timeRange === '7days'
              ? '7-Day Volume'
              : timeRange === '30days'
              ? '30-Day Volume'
              : 'Annual Volume'}{' '}
            - Zone Distribution
          </CardTitle>
          <CardDescription>
            {timeRange === 'year'
              ? 'Showing the whole year'
              : timeRange === '30days'
              ? 'Showing the last 30 days'
              : 'Showing the last 7 days'}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className='w-[160px] rounded-lg sm:ml-auto'
            aria-label='Select a range'
          >
            <SelectValue placeholder='Last 30 days' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='year' className='rounded-lg'>
              Whole year
            </SelectItem>
            <SelectItem value='30days' className='rounded-lg'>
              Last 30 days
            </SelectItem>
            <SelectItem value='7days' className='rounded-lg'>
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart data={finalChartData}>
            <defs>
              <linearGradient id='fillZ1' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-Z1)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-Z1)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillZ2' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-Z2)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-Z2)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillZ3' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-Z3)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-Z3)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillZ4' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-Z4)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-Z4)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillZ5' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-Z5)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-Z5)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={shouldGroupByMonths ? 'month' : 'date'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='Z5'
              type='natural'
              fill='url(#fillZ5)'
              stroke='var(--color-Z5)'
              stackId='a'
            />
            <Area
              dataKey='Z4'
              type='natural'
              fill='url(#fillZ4)'
              stroke='var(--color-Z4)'
              stackId='a'
            />
            <Area
              dataKey='Z3'
              type='natural'
              fill='url(#fillZ3)'
              stroke='var(--color-Z3)'
              stackId='a'
            />
            <Area
              dataKey='Z2'
              type='natural'
              fill='url(#fillZ2)'
              stroke='var(--color-Z2)'
              stackId='a'
            />
            <Area
              dataKey='Z1'
              type='natural'
              fill='url(#fillZ1)'
              stroke='var(--color-Z1)'
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
