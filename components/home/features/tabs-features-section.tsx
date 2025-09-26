'use client';

import { TabsSection } from '@/components/ui/tabs-section';
import { useState } from 'react';
import { DemoDataProvider } from './demo-data-provider';

export function TabsFeaturesSection() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'training', label: 'Training' },
    { id: 'analytics', label: 'Analytics', active: true }
  ];

  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Training Zone Analysis"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Technique Tracking"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Performance Reports"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Swimmer Comparison"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Metrics Export"
    }
  ];

  return (
    <DemoDataProvider>
      <TabsSection
        title="Optimize your swimmers' performance"
        subtitle="with professional real-time analysis"
        tabs={tabs}
        features={features}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="p-2 sm:p-4">
          {/* Dashboard content based on active tab */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 p-2 sm:p-3 w-full">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Overview Placeholder */}
                <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-700/30 rounded-lg border border-gray-600/30 p-4">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">📊</div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Overview Dashboard</h3>
                    <p className="text-xs sm:text-sm">Analytics overview coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-4">
                {/* Training Placeholder */}
                <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-700/30 rounded-lg border border-gray-600/30 p-4">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🏊‍♂️</div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Training Management</h3>
                    <p className="text-xs sm:text-sm">Training tools coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4">
                {/* Analytics Placeholder */}
                <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-700/30 rounded-lg border border-gray-600/30 p-4">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">📈</div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Advanced Analytics</h3>
                    <p className="text-xs sm:text-sm">Detailed analytics coming soon...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsSection>
    </DemoDataProvider>
  );
}
