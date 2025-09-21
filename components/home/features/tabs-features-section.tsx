'use client';

import { ChartsSection } from '@/components/features/dashboard/charts-section';
import { DashboardCalendar } from '@/components/features/dashboard/dashboard-calendar';
import { KPICards } from '@/components/features/dashboard/kpi-cards';
import { VisitorsChart } from '@/components/features/dashboard/visitors-chart';
import { WeeklyTrainingSchedule } from '@/components/features/dashboard/weekly-training-schedule';
import { TabsSection } from '@/components/ui/tabs-section';
import { useState } from 'react';
import { DemoDataProvider } from './demo-data-provider';

export function TabsFeaturesSection() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  const tabs = [
    { id: 'overview', label: 'Resumen' },
    { id: 'training', label: 'Entrenamientos' },
    { id: 'analytics', label: 'Análisis', active: true }
  ];

  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Análisis de Zonas de Entrenamiento"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Seguimiento de Técnica"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Reportes de Rendimiento"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Comparación de Nadadores"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Exportación de Métricas"
    }
  ];

  return (
    <DemoDataProvider>
      <TabsSection
        title="Optimiza el rendimiento de tus nadadores"
        subtitle="con análisis profesional en tiempo real"
        tabs={tabs}
        features={features}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="p-4">
          {/* Dashboard content based on active tab */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 p-3 w-full">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* KPIs Cards reales */}
                <KPICards />
                
                {/* Charts Section - Gráfico de visitantes y calendario */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <VisitorsChart />
                  <DashboardCalendar />
                </div>
                
                {/* Weekly Training Schedule */}
                <WeeklyTrainingSchedule />
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-4">
                {/* KPIs Cards reales */}
                <KPICards />
                
                {/* Weekly Training Schedule */}
                <WeeklyTrainingSchedule />
                
                {/* Charts Section */}
                <ChartsSection />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4">
                {/* Charts Section - Los dos gráficos debajo uno del otro */}
                <div className="space-y-4">
                  <ChartsSection />
                </div>
                
                {/* Gráfico de visitantes y calendario */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <VisitorsChart />
                  <DashboardCalendar />
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsSection>
    </DemoDataProvider>
  );
}
