'use client';

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  active?: boolean;
}

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface TabsSectionProps {
  title: string;
  subtitle: string;
  tabs: Tab[];
  features: Feature[];
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function TabsSection({ 
  title, 
  subtitle, 
  tabs, 
  features, 
  children, 
  activeTab: externalActiveTab,
  onTabChange,
  className 
}: TabsSectionProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs.find(tab => tab.active)?.id || tabs[0]?.id);
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  return (
    <section className={cn("py-20 px-4 sm:px-6 lg:px-8 relative z-[100]", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center bg-gray-900/30 rounded-lg p-1 backdrop-blur-sm border border-gray-800/30 w-full max-w-md sm:max-w-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex-1 sm:flex-none sm:px-4 min-w-0 touch-manipulation relative z-10",
                  activeTab === tab.id
                    ? "bg-gray-800/60 text-white border border-gray-700/50"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 active:bg-gray-800/50"
                )}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2 text-gray-400 px-2 py-1">
              <div className="text-green-400/80 text-sm sm:text-base">
                {feature.icon}
              </div>
              <span className="text-xs sm:text-sm whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-900/30 rounded-xl border border-gray-800/30 backdrop-blur-sm overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}

// Example component for demonstration
export function ExampleTabsSection() {
  const tabs = [
    { id: 'table', label: 'Table Editor' },
    { id: 'sql', label: 'SQL Editor' },
    { id: 'policies', label: 'RLS Policies', active: true }
  ];

  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Email Logins"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Magic Links"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "20+ Third-party Logins"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Custom Access Policies via RLS"
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      text: "Password Recovery"
    }
  ];

  return (
    <TabsSection
      title="Stay productive and manage your app"
      subtitle="without leaving the dashboard"
      tabs={tabs}
      features={features}
    >
      <div className="p-8">
        <div className="text-center text-gray-400">
          <p>Dashboard content would go here...</p>
        </div>
      </div>
    </TabsSection>
  );
}
