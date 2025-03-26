
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import BlurContainer from '../ui/BlurContainer';

interface StatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
}

const Stat = ({ value, label, prefix = '', suffix = '', delay = 0, duration = 2000 }: StatProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const step = Math.ceil(value / (duration / 16));
      const timer = setInterval(() => {
        setCount(prevCount => {
          const nextCount = prevCount + step;
          if (nextCount >= value) {
            clearInterval(timer);
            return value;
          }
          return nextCount;
        });
      }, 16);
      
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, delay, duration]);

  return (
    <BlurContainer className="p-6 text-center transform transition-all h-full">
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-muted-foreground">{label}</p>
    </BlurContainer>
  );
};

const Stats = () => {
  const stats = [
    { value: 250000, label: "Meals Saved", suffix: "+", delay: 0 },
    { value: 500, label: "NGO Partners", suffix: "+", delay: 200 },
    { value: 1000, label: "Food Providers", suffix: "+", delay: 400 },
    { value: 120, label: "Cities Covered", suffix: "+", delay: 600 }
  ];

  return (
    <section id="impact" className="py-24 px-6 sm:px-8 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-foodall-blue rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 bg-foodall-green rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Together we're making a measurable difference in fighting hunger and reducing food waste
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Stat
              key={index}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
