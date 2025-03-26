
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BlurContainer from '../ui/BlurContainer';

const Hero = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-foodall-blue rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-foodall-green rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-foodall-cyan rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="inline-block animate-fade-in px-3 py-1 text-sm font-medium rounded-full bg-foodall-teal/10 text-foodall-teal mb-6">
            Fighting Hunger. Reducing Waste.
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance animate-slide-up">
            Connect Excess Food<br className="hidden sm:block" /> With Those In Need
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl text-pretty animate-slide-up animation-delay-200">
            FoodForAll bridges the gap between surplus food and hunger, creating an ecosystem 
            where nothing goes to waste and everyone has access to nutritious meals.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
            <Link to="/register">
              <Button size="lg" className="bg-foodall-teal hover:bg-foodall-teal/90 text-white font-medium rounded-full px-8">
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/#how-it-works">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full animate-scale-in animation-delay-600">
          <BlurContainer className="overflow-hidden rounded-2xl shadow-lg">
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-foodall-green/40 via-foodall-blue/30 to-foodall-cyan/40 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="p-10">
                  <h3 className="text-2xl font-semibold mb-4">Interactive Dashboard Preview</h3>
                  <p className="text-muted-foreground">
                    Visualize food donations, requests, and impact in real-time through our intuitive interface
                  </p>
                </div>
              </div>
              {/* This would be replaced with an actual app screenshot/mockup */}
            </div>
          </BlurContainer>
        </div>
      </div>
    </section>
  );
};

export default Hero;
