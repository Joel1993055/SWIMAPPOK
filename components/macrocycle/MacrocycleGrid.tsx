'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { periodColors, type MacrocycleWeek } from '@/data/macrocycle';
import { CalendarDays, Clock, Edit, FileText, Plus, Target, Trophy } from 'lucide-react';
import { useState } from 'react';

interface MacrocycleGridProps {
  data: MacrocycleWeek[];
  selectedWeek: number | null;
  onWeekSelect: (week: number) => void;
}

export function MacrocycleGrid({ 
  data, 
  selectedWeek, 
  onWeekSelect 
}: MacrocycleGridProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');

  const getPeriodStyle = (period: MacrocycleWeek['period']) => {
    return periodColors[period];
  };

  if (viewMode === 'cards') {
    return (
      <div className="space-y-4">
        {/* Grid Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'cards' ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button 
              variant={viewMode === 'compact' ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode('compact')}
            >
              Compact
            </Button>
          </div>
          <Badge variant="secondary">
            {data.length} weeks
          </Badge>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((week) => (
            <Card 
              key={week.week}
              className={`cursor-pointer transition-all hover:shadow-md bg-muted/50 border-muted ${
                selectedWeek === week.week ? 'ring-2 ring-primary/30 bg-primary/5' : 'hover:bg-muted/30'
              }`}
              onClick={() => onWeekSelect(week.week)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Week {week.week}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{week.date}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getPeriodStyle(week.period).text} ${getPeriodStyle(week.period).bg}`}
                  >
                    {week.period}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Period Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mesocycle:</span>
                    <span className="font-medium">{week.meso}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Microcycle:</span>
                    <span className="font-medium">{week.micro}</span>
                  </div>

                  {/* Events Summary */}
                  <div className="space-y-2">
                    {week.tests.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary">{week.tests.join(', ')}</span>
                      </div>
                    )}
                    
                    {week.competitions.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-destructive">{week.competitions.join(', ')}</span>
                      </div>
                    )}
                    
                    {week.registrations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{week.registrations.join(', ')}</span>
                      </div>
                    )}
                    
                    {week.holidays.length > 0 && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3 w-3 text-orange-600" />
                        <span className="text-xs text-orange-600">{week.holidays.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Event
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Compact view
  return (
    <div className="space-y-4">
      {/* Compact Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'cards' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
          <Button 
            variant={viewMode === 'compact' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('compact')}
          >
            Compact
          </Button>
        </div>
        <Badge variant="secondary">
          {data.length} weeks
        </Badge>
      </div>

      {/* Compact Table */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 text-left font-semibold text-foreground">Week</th>
                  <th className="p-3 text-left font-semibold text-foreground">Date</th>
                  <th className="p-3 text-left font-semibold text-foreground">Period</th>
                  <th className="p-3 text-left font-semibold text-foreground">Mesocycle</th>
                  <th className="p-3 text-left font-semibold text-foreground">Events</th>
                  <th className="p-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((week) => (
                  <tr 
                    key={week.week}
                    className={`border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                      selectedWeek === week.week ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => onWeekSelect(week.week)}
                  >
                    <td className="p-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {week.week}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{week.date}</td>
                    <td className="p-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getPeriodStyle(week.period).text} ${getPeriodStyle(week.period).bg}`}
                      >
                        {week.period}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{week.meso}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {week.tests.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {week.tests.length}
                          </Badge>
                        )}
                        {week.competitions.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <Trophy className="h-3 w-3 mr-1" />
                            {week.competitions.length}
                          </Badge>
                        )}
                        {week.registrations.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {week.registrations.length}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
