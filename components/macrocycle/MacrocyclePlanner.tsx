'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Calendar, Filter, Grid3X3, Search } from 'lucide-react';
import { useState } from 'react';
import { MacrocycleGrid } from './MacrocycleGrid';
import { MacrocycleTimeline } from './MacrocycleTimeline';
import { WeekDetail } from './WeekDetail';
import { useMacrocycleData, useMacrocycleView } from './hooks/useMacrocycleData';

export function MacrocyclePlanner() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'timeline' | 'grid'>('timeline');

  const { data: macrocycleData, isLoading } = useMacrocycleData();
  const { currentView, setView } = useMacrocycleView();

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(selectedWeek === week ? null : week);
  };


  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Macrocycle Planner</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Loading your training plan...
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
       {/* Main Content */}
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'timeline' | 'grid')}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="timeline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="grid" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Grid
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <TabsContent value="timeline" className="mt-0">
              <MacrocycleTimeline 
                data={macrocycleData}
                selectedWeek={selectedWeek}
                onWeekSelect={handleWeekSelect}
              />
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <MacrocycleGrid 
                data={macrocycleData}
                selectedWeek={selectedWeek}
                onWeekSelect={handleWeekSelect}
              />
            </TabsContent>
           </Tabs>

      {/* Week Detail Dialog */}
      <Dialog open={!!selectedWeek} onOpenChange={() => setSelectedWeek(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-muted/50 border-muted">
          <DialogHeader>
            <DialogTitle>Week {selectedWeek} Details</DialogTitle>
          </DialogHeader>
          {selectedWeek && (
            <WeekDetail 
              week={macrocycleData.find(w => w.week === selectedWeek)!}
              onClose={() => setSelectedWeek(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
