
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building, Heart } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';

const CallToAction = () => {
  return (
    <section className="py-20 px-6 sm:px-8">
      <BlurContainer className="max-w-6xl mx-auto py-16 px-6 sm:py-24 sm:px-12 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            Join our community today and be part of the movement to reduce food waste and fight hunger. Every meal shared is a step towards a better world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/select-type">
              <Button size="lg" className="bg-foodall-teal hover:bg-foodall-teal/90 text-white gap-2 text-base px-8">
                <Heart className="h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Link to="/#how-it-works">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                <Building className="h-5 w-5" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </BlurContainer>
    </section>
  );
};

export default CallToAction;
