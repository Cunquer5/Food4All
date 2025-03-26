
import React from 'react';
import { cn } from "@/lib/utils";

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  border?: boolean;
}

const BlurContainer = ({ 
  children, 
  intensity = 'medium', 
  className,
  border = true,
  ...props 
}: BlurContainerProps) => {
  const blurIntensity = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
  };

  return (
    <div
      className={cn(
        'bg-white/70 dark:bg-black/70',
        blurIntensity[intensity],
        border ? 'border border-white/20 dark:border-white/10' : '',
        'shadow-sm rounded-xl transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
