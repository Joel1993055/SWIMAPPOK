'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, FileText, Filter, Search, Target, Trophy, X } from 'lucide-react';
import { MacrocycleFilters } from './hooks/useMacrocycleData';

interface MacrocycleFiltersProps {
  filters: MacrocycleFilters;
  onFiltersChange: (filters: MacrocycleFilters) => void;
}

export function MacrocycleFilters({ filters, onFiltersChange }: MacrocycleFiltersProps) {
  const handlePeriodChange = (period: string) => {
    onFiltersChange({
      ...filters,
      period: period as MacrocycleFilters['period']
    });
  };

  const handleTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      type: type as MacrocycleFilters['type']
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      period: 'all',
      type: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.period !== 'all' || filters.type !== 'all' || filters.search !== '';

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium text-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search weeks..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Period Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Training Period
          </Label>
          <Select value={filters.period} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  All Periods
                </div>
              </SelectItem>
              <SelectItem value="BASIC">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100"></div>
                  Basic Period
                </div>
              </SelectItem>
              <SelectItem value="SPECIFIC">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/20"></div>
                  Specific Period
                </div>
              </SelectItem>
              <SelectItem value="COMPETITION">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-destructive/20"></div>
                  Competition Period
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Event Type
          </Label>
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  All Events
                </div>
              </SelectItem>
              <SelectItem value="tests">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Tests
                </div>
              </SelectItem>
              <SelectItem value="competitions">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-destructive" />
                  Competitions
                </div>
              </SelectItem>
              <SelectItem value="registrations">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Registrations
                </div>
              </SelectItem>
              <SelectItem value="holidays">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-orange-600" />
                  Holidays
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Active Filters
            </Label>
            <div className="flex flex-wrap gap-2">
              {filters.period !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.period}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handlePeriodChange('all')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.type !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {filters.type === 'tests' && <Target className="h-3 w-3" />}
                  {filters.type === 'competitions' && <Trophy className="h-3 w-3" />}
                  {filters.type === 'registrations' && <FileText className="h-3 w-3" />}
                  {filters.type === 'holidays' && <CalendarDays className="h-3 w-3" />}
                  {filters.type}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleTypeChange('all')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  "{filters.search}"
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleSearchChange('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Export Calendar
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
