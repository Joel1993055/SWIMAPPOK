'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import { periodColors, type MacrocycleWeek } from '@/data/macrocycle';
import { addDays, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Target, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';

interface MacrocycleTimelineProps {
  data: MacrocycleWeek[];
  selectedWeek: number | null;
  onWeekSelect: (week: number) => void;
}

export function MacrocycleTimeline({
  data,
  selectedWeek,
  onWeekSelect
}: MacrocycleTimelineProps) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeksPerView, setWeeksPerView] = useState(12);
  const { sessions } = useSessionsData();

  const getPeriodStyle = (period: MacrocycleWeek['period']) => {
    return periodColors[period];
  };

  // Calculate real training data for each week including zone volumes
  const getWeekTrainingData = useMemo(() => {
    const trainingData: { 
      [weekNumber: number]: { 
        sessions: number; 
        distance: number; 
        avgRPE: number;
        zones: { Z1: number; Z2: number; Z3: number; Z4: number; Z5: number };
      } 
    } = {};
    
    // Demo data for testing
    const demoData = {
      1: { sessions: 4, distance: 12000, avgRPE: 6.5, zones: { Z1: 3000, Z2: 4000, Z3: 3000, Z4: 1500, Z5: 500 } },
      2: { sessions: 5, distance: 15000, avgRPE: 7.0, zones: { Z1: 3500, Z2: 5000, Z3: 4000, Z4: 2000, Z5: 500 } },
      3: { sessions: 6, distance: 18000, avgRPE: 7.2, zones: { Z1: 4000, Z2: 6000, Z3: 5000, Z4: 2500, Z5: 500 } },
      4: { sessions: 5, distance: 16000, avgRPE: 6.8, zones: { Z1: 3800, Z2: 5500, Z3: 4500, Z4: 1800, Z5: 400 } },
      5: { sessions: 7, distance: 22000, avgRPE: 7.5, zones: { Z1: 5000, Z2: 7000, Z3: 6000, Z4: 3000, Z5: 1000 } },
      6: { sessions: 6, distance: 19000, avgRPE: 7.1, zones: { Z1: 4500, Z2: 6500, Z3: 5000, Z4: 2500, Z5: 500 } },
      7: { sessions: 8, distance: 25000, avgRPE: 7.8, zones: { Z1: 6000, Z2: 8000, Z3: 7000, Z4: 3000, Z5: 1000 } },
      8: { sessions: 4, distance: 14000, avgRPE: 6.0, zones: { Z1: 4000, Z2: 5000, Z3: 3000, Z4: 1500, Z5: 500 } },
      9: { sessions: 6, distance: 20000, avgRPE: 7.3, zones: { Z1: 5000, Z2: 7000, Z3: 6000, Z4: 1500, Z5: 500 } },
      10: { sessions: 7, distance: 23000, avgRPE: 7.6, zones: { Z1: 5500, Z2: 8000, Z3: 6500, Z4: 2500, Z5: 500 } },
      11: { sessions: 8, distance: 26000, avgRPE: 7.9, zones: { Z1: 6000, Z2: 9000, Z3: 7000, Z4: 3000, Z5: 1000 } },
      12: { sessions: 5, distance: 17000, avgRPE: 6.5, zones: { Z1: 4000, Z2: 6000, Z3: 5000, Z4: 1500, Z5: 500 } },
      13: { sessions: 6, distance: 21000, avgRPE: 7.4, zones: { Z1: 5000, Z2: 7500, Z3: 6000, Z4: 2000, Z5: 500 } },
      14: { sessions: 7, distance: 24000, avgRPE: 7.7, zones: { Z1: 5500, Z2: 8500, Z3: 6500, Z4: 2500, Z5: 1000 } },
      15: { sessions: 8, distance: 27000, avgRPE: 8.0, zones: { Z1: 6000, Z2: 9500, Z3: 7500, Z4: 3000, Z5: 1000 } },
      16: { sessions: 4, distance: 15000, avgRPE: 6.2, zones: { Z1: 4000, Z2: 6000, Z3: 4000, Z4: 800, Z5: 200 } },
    };
    
    data.forEach(week => {
      // Use demo data if available, otherwise calculate from real sessions
      if (demoData[week.week as keyof typeof demoData]) {
        trainingData[week.week] = demoData[week.week as keyof typeof demoData];
      } else {
      const now = new Date();
      const weeksFromNow = data.length - week.week;
      const weekStart = subWeeks(now, weeksFromNow);
      const weekEnd = addDays(weekStart, 6);
      
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      const totalDistance = weekSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
      const avgRPE = weekSessions.length > 0 
        ? weekSessions.reduce((sum, s) => sum + (s.rpe || 0), 0) / weekSessions.length 
        : 0;
      
        // Calculate zone volumes
        const zones = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0 };
        weekSessions.forEach(session => {
          if (session.zone_volumes) {
            zones.Z1 += session.zone_volumes.z1 || 0;
            zones.Z2 += session.zone_volumes.z2 || 0;
            zones.Z3 += session.zone_volumes.z3 || 0;
            zones.Z4 += session.zone_volumes.z4 || 0;
            zones.Z5 += session.zone_volumes.z5 || 0;
          }
        });
      
      trainingData[week.week] = {
        sessions: weekSessions.length,
        distance: totalDistance,
          avgRPE: avgRPE,
          zones: zones
      };
      }
    });
    
    return trainingData;
  }, [data, sessions]);

  const visibleWeeks = data.slice(currentWeek - 1, currentWeek - 1 + weeksPerView);

  const getEventCount = (week: MacrocycleWeek) => {
    return week.tests.length + week.competitions.length + week.registrations.length + week.holidays.length;
  };

  const handleWeekSelect = (weekNumber: number) => {
    onWeekSelect(weekNumber);
  };

  const selectedWeekData = selectedWeek ? data.find(w => w.week === selectedWeek) : null;

  // Chart configuration
  const chartConfig = {
    volume: {
      label: "Volume (km)",
      color: "#3b82f6",
    },
  } satisfies ChartConfig;

  // Prepare data for bar chart
  const chartData = visibleWeeks.map(week => {
    const trainingData = getWeekTrainingData[week.week];
    return {
      week: `W${week.week}`,
      volume: trainingData ? (trainingData.distance / 1000).toFixed(1) : 0,
      sessions: trainingData?.sessions || 0,
    };
  });

  return (
    <div className="space-y-3">
      {/* Compact Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - weeksPerView))}
            disabled={currentWeek <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentWeek}-{Math.min(data.length, currentWeek + weeksPerView - 1)} of {data.length}
          </span>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentWeek(Math.min(data.length - weeksPerView + 1, currentWeek + weeksPerView))}
            disabled={currentWeek >= data.length - weeksPerView + 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant={weeksPerView === 6 ? "default" : "outline"} 
            size="sm"
            onClick={() => setWeeksPerView(6)}
            className="text-xs px-2"
          >
            6W
          </Button>
          <Button 
            variant={weeksPerView === 12 ? "default" : "outline"} 
            size="sm"
            onClick={() => setWeeksPerView(12)}
            className="text-xs px-2"
          >
            12W
          </Button>
          <Button 
            variant={weeksPerView === 24 ? "default" : "outline"} 
            size="sm"
            onClick={() => setWeeksPerView(24)}
            className="text-xs px-2"
          >
            24W
          </Button>
          <Button 
            variant={weeksPerView === 48 ? "default" : "outline"} 
            size="sm"
            onClick={() => setWeeksPerView(48)}
            className="text-xs px-2"
          >
            All
          </Button>
        </div>
      </div>

      {/* Complete Timeline */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Week Numbers Row */}
              <div className="bg-muted/30 border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-primary" />
                      <span className="text-xs font-semibold">Week</span>
                    </div>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedWeek === week.week ? 'bg-primary/10 ring-1 ring-primary/30' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      <div className="text-sm font-bold text-foreground">
                        {week.week}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Week Dates Row */}
              <div className="bg-muted/20 border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border">
                    <span className="text-xs font-medium text-muted-foreground">Date</span>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                        selectedWeek === week.week ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      <div className="text-xs text-muted-foreground">
                        {week.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Test</span>
                    </div>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                        selectedWeek === week.week ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      {week.tests.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary">{week.tests.length}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Competition Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-destructive" />
                      <span className="text-xs font-medium text-muted-foreground">Competición</span>
                    </div>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                        selectedWeek === week.week ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      {week.competitions.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-destructive" />
                          <span className="text-xs text-destructive">{week.competitions.length}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Macrocycles Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Macrocycle</span>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors bg-blue-100 dark:bg-blue-900/30 ${
                        selectedWeek === week.week ? 'ring-1 ring-primary/30' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        MACRO I
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Period Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Period</span>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:opacity-80 transition-opacity ${getPeriodStyle(week.period).bg} ${
                        selectedWeek === week.week ? 'ring-1 ring-primary/30' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      <span className={`text-xs font-bold ${getPeriodStyle(week.period).text}`}>
                        {week.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mesocycle Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Mesocycle</span>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:opacity-80 transition-opacity ${getPeriodStyle(week.period).bg} ${
                        selectedWeek === week.week ? 'ring-1 ring-primary/30' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      <span className="text-xs font-semibold">{week.meso}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Microcycle Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Microcycle</span>
                  </div>
                  {visibleWeeks.map((week) => (
                    <div 
                      key={week.week}
                      className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:opacity-80 transition-opacity ${getPeriodStyle(week.period).bg} ${
                        selectedWeek === week.week ? 'ring-1 ring-primary/30' : ''
                      }`}
                      onClick={() => handleWeekSelect(week.week)}
                    >
                      <span className="text-xs font-semibold">{week.micro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Data Row - Sessions */}
                     <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                         <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Sessions</span>
                         </div>
                         {visibleWeeks.map((week) => {
                           const trainingData = getWeekTrainingData[week.week];
                           return (
                             <div
                               key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                                 selectedWeek === week.week ? 'bg-primary/5' : ''
                               }`}
                        onClick={() => handleWeekSelect(week.week)}
                             >
                        <div className="text-sm font-semibold text-primary">
                                 {trainingData?.sessions || 0}
                               </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Training Data Row - Volume */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Volume</span>
                  </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    return (
                      <div
                        key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedWeek === week.week ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="text-sm font-semibold text-primary">
                                 {trainingData ? `${(trainingData.distance / 1000).toFixed(1)}km` : '0km'}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </div>

              {/* Zone 1 Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-blue-600">Z1</span>
                  </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    return (
                      <div
                        key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedWeek === week.week ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="text-sm font-semibold text-blue-600">
                          {trainingData ? `${(trainingData.zones.Z1 / 1000).toFixed(1)}km` : '0km'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone 2 Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-green-600">Z2</span>
                  </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    return (
                      <div
                        key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedWeek === week.week ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="text-sm font-semibold text-green-600">
                          {trainingData ? `${(trainingData.zones.Z2 / 1000).toFixed(1)}km` : '0km'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone 3 Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-yellow-600">Z3</span>
                  </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    return (
                      <div
                        key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedWeek === week.week ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="text-sm font-semibold text-yellow-600">
                          {trainingData ? `${(trainingData.zones.Z3 / 1000).toFixed(1)}km` : '0km'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone 4 Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-red-600">Z4</span>
                  </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    return (
                      <div
                        key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedWeek === week.week ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="text-sm font-semibold text-red-600">
                          {trainingData ? `${(trainingData.zones.Z4 / 1000).toFixed(1)}km` : '0km'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone 5 Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                         <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-purple-600">Z5</span>
                         </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    return (
                           <div
                             key={week.week}
                        className={`w-[80px] h-[40px] flex items-center justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                               selectedWeek === week.week ? 'bg-primary/5' : ''
                             }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="text-sm font-semibold text-purple-600">
                          {trainingData ? `${(trainingData.zones.Z5 / 1000).toFixed(1)}km` : '0km'}
                        </div>
                      </div>
                    );
                  })}
                                 </div>
                                 </div>

              {/* Integrated Chart Row */}
              <div className="border-b border-border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weeksPerView}, 80px)` }}>
                  <div className="p-2 border-r border-border bg-muted/20">
                    <span className="text-xs font-medium text-muted-foreground">Gráfico</span>
                                 </div>
                  {visibleWeeks.map((week) => {
                    const trainingData = getWeekTrainingData[week.week];
                    const volume = trainingData ? (trainingData.distance / 1000) : 0;
                    
                    // Calculate relative heights for visualization
                    const maxVolume = Math.max(...visibleWeeks.map(w => {
                      const data = getWeekTrainingData[w.week];
                      return data ? (data.distance / 1000) : 0;
                    }));
                    
                    const barHeight = maxVolume > 0 ? (volume / maxVolume) * 50 : 0;
                    
                    return (
                      <div
                        key={week.week}
                        className={`w-[80px] h-[100px] flex items-end justify-center border-r border-border cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedWeek === week.week ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleWeekSelect(week.week)}
                      >
                        <div className="flex flex-col items-center justify-end h-full relative">
                          {/* Volume bar */}
                          <div 
                            className="w-6 bg-primary rounded-t-sm mb-2 transition-all duration-300"
                            style={{ height: `${barHeight}px` }}
                          />
                          
                          {/* Volume value */}
                          <div className="text-xs text-center">
                            <div className="text-primary font-semibold">{volume.toFixed(1)}km</div>
                                 </div>
                             </div>
                           </div>
                    );
                  })}
                       </div>
                     </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combined Chart */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Volume and Sessions per Week</h3>
            <p className="text-sm text-muted-foreground">Bars: Volume (km) | Line: Sessions</p>
          </div>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ComposedChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="week" 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false} 
              />
              <YAxis
                yAxisId="volume"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={v => `${v}km`}
              />
              <YAxis
                yAxisId="sessions"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Bar 
                yAxisId="volume"
                dataKey="volume" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="sessions"
                type="monotone"
                dataKey="sessions" 
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
