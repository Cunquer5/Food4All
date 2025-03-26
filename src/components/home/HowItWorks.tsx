
import React from 'react';
import { AlertTriangle, Building2, Truck, Users } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';
import { cn } from '@/lib/utils';

const HowItWorks = () => {
  const steps = [
    {
      icon: <AlertTriangle size={24} className="text-amber-500" />,
      title: "Report Excess Food",
      description: "Restaurants, grocery stores, events, and individuals log their surplus food in the app, providing details about quantity, type, and freshness.",
      image: "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20",
      delay: 0
    },
    {
      icon: <Building2 size={24} className="text-blue-500" />,
      title: "NGOs Receive Notifications",
      description: "Registered NGOs in the vicinity are automatically notified about available food donations that match their needs and capacity.",
      image: "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20",
      delay: 200
    },
    {
      icon: <Truck size={24} className="text-green-500" />,
      title: "Coordinate Pickup & Delivery",
      description: "The platform facilitates scheduling and routing for efficient food collection and distribution to those in need.",
      image: "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20",
      delay: 400
    },
    {
      icon: <Users size={24} className="text-purple-500" />,
      title: "Food Reaches People In Need",
      description: "NGOs distribute the rescued food to communities, shelters, and individuals experiencing food insecurity.",
      image: "bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20",
      delay: 600
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 sm:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How FoodForAll Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process connects food surplus with those who need it most, creating a sustainable ecosystem for reducing waste and fighting hunger
          </p>
        </div>

        <div className="flex flex-col space-y-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={cn(
                "flex flex-col md:flex-row items-center gap-8",
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              )}
            >
              <div className="w-full md:w-1/2 opacity-0 animate-slide-up" style={{ animationDelay: `${step.delay}ms` }}>
                <BlurContainer className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </BlurContainer>
              </div>
              
              <div className="w-full md:w-1/2 opacity-0 animate-scale-in" style={{ animationDelay: `${step.delay + 100}ms` }}>
                <div className={cn(
                  "rounded-2xl w-full aspect-[4/3] flex items-center justify-center shadow-sm overflow-hidden", 
                  step.image
                )}>
                  <div className="text-center p-6">
                    <span className="text-lg font-medium">Step {index + 1} Visualization</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
