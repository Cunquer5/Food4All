
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import BlurContainer from '../ui/BlurContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Impact', path: '/#impact' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/select-type');
    }
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'py-2' : 'py-4',
    )}>
      <BlurContainer className={cn(
        'max-w-7xl mx-auto px-4 sm:px-6',
        isScrolled ? 'rounded-none' : 'rounded-2xl mx-4 sm:mx-6 mt-4',
      )}>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="bg-foodall-teal text-white font-bold text-xl px-3 py-1 rounded-md">F4A</span>
              <span className="font-bold text-xl hidden sm:block">FoodForAll</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <NavLink key={item.name} href={item.path} isScrolled={isScrolled}>
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Get Started Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              size="sm" 
              className="flex items-center gap-1 bg-foodall-teal hover:bg-foodall-teal/90 text-white"
              onClick={handleGetStarted}
            >
              <UserPlus size={16} />
              <span>{user ? 'Dashboard' : 'Get Started'}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </BlurContainer>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && isMobile && (
        <BlurContainer className="md:hidden absolute top-[80px] left-0 right-0 mx-4 rounded-xl animation-delay-200 animate-slide-down">
          <div className="px-4 pt-2 pb-5 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button 
                className="w-full justify-center bg-foodall-teal hover:bg-foodall-teal/90 text-white"
                onClick={handleGetStarted}
              >
                <UserPlus size={16} className="mr-2" />
                {user ? 'Dashboard' : 'Get Started'}
              </Button>
            </div>
          </div>
        </BlurContainer>
      )}
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled?: boolean;
}

const NavLink = ({ href, children, isScrolled }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href || location.hash === href.substring(1);

  return (
    <Link
      to={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        isActive 
          ? 'text-foodall-teal' 
          : isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
