
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import BlurContainer from '../ui/BlurContainer';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-16 pb-8 mt-auto">
      <BlurContainer className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="bg-foodall-teal text-white font-bold text-xl px-3 py-1 rounded-md">F4A</span>
              <span className="font-bold text-xl">FoodForAll</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Connecting excess food with those who need it most. Join our mission to reduce food waste and fight hunger.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="#" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="#" icon={<Github size={18} />} label="GitHub" />
              <SocialLink href="#" icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          <FooterLinksColumn title="Platform" links={[
            { name: 'How It Works', href: '/#how-it-works' },
            { name: 'Features', href: '/#features' },
            { name: 'Impact', href: '/#impact' },
            { name: 'Partners', href: '/#partners' },
            { name: 'Testimonials', href: '/#testimonials' },
          ]} />

          <FooterLinksColumn title="Resources" links={[
            { name: 'Blog', href: '/blog' },
            { name: 'Support', href: '/support' },
            { name: 'Documentation', href: '/docs' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
          ]} />

          <FooterLinksColumn title="Company" links={[
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Contact', href: '/contact' },
            { name: 'Press', href: '/press' },
            { name: 'Investors', href: '/investors' },
          ]} />
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} FoodForAll. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0 flex items-center">
              Made with <Heart size={14} className="mx-1 text-foodall-teal" /> for a better world
            </p>
          </div>
        </div>
      </BlurContainer>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a 
    href={href} 
    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-foodall-teal hover:text-white transition-colors duration-200"
    aria-label={label}
  >
    {icon}
  </a>
);

interface FooterLinksColumnProps {
  title: string;
  links: { name: string; href: string }[];
}

const FooterLinksColumn = ({ title, links }: FooterLinksColumnProps) => (
  <div className="col-span-1">
    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
      {title}
    </h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.name}>
          <Link 
            to={link.href} 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-foodall-teal dark:hover:text-foodall-teal transition-colors duration-200"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
