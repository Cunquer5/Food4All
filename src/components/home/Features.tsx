
import React from 'react';
import { Utensils, Building, ClipboardList, BarChart3, Map, MessageSquare, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import BlurContainer from '../ui/BlurContainer';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const Feature = ({ icon, title, description, color, delay }: FeatureProps) => {
  return (
    <BlurContainer 
      className={cn(
        'p-6 h-full opacity-0 animate-scale-in',
        `animation-delay-${delay}`
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        color
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </BlurContainer>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Utensils size={24} className="text-green-600" />,
      title: "Report Leftover Food",
      description: "Easily log excess food with details on quantity, type, and location for efficient pickup and distribution.",
      color: "bg-green-50 dark:bg-green-900/20",
      delay: 0
    },
    {
      icon: <Building size={24} className="text-blue-600" />,
      title: "NGO Registration",
      description: "Simple onboarding process for organizations to join the platform and receive food donations.",
      color: "bg-blue-50 dark:bg-blue-900/20",
      delay: 100
    },
    {
      icon: <ClipboardList size={24} className="text-purple-600" />,
      title: "Food Request Management",
      description: "Intelligent system that manages and prioritizes food requests based on need and availability.",
      color: "bg-purple-50 dark:bg-purple-900/20",
      delay: 200
    },
    {
      icon: <PackageCheck size={24} className="text-amber-600" />,
      title: "Donation Tracking",
      description: "Comprehensive tracking of all donated food items from source to distribution.",
      color: "bg-amber-50 dark:bg-amber-900/20",
      delay: 300
    },
    {
      icon: <Map size={24} className="text-teal-600" />,
      title: "Map-Based Delivery",
      description: "Interactive map visualization for efficient pickup and delivery route planning.",
      color: "bg-teal-50 dark:bg-teal-900/20",
      delay: 400
    },
    {
      icon: <MessageSquare size={24} className="text-red-600" />,
      title: "Communication Tools",
      description: "Built-in messaging system for seamless coordination between donors and recipients.",
      color: "bg-red-50 dark:bg-red-900/20",
      delay: 500
    },
    {
      icon: <BarChart3 size={24} className="text-indigo-600" />,
      title: "Analytics & Reporting",
      description: "Detailed insights into donation patterns, distribution efficiency, and overall impact.",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      delay: 600
    }
  ];

  return (
    <section id="features" className="py-24 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Comprehensive Platform Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our intelligent system connects food donors with NGOs through an intuitive, feature-rich platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
