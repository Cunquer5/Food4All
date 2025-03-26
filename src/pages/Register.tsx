
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlurContainer from '@/components/ui/BlurContainer';
import { User, Mail, Lock, Building, UserPlus } from 'lucide-react';
import { signUp, AuthFormData } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') === 'ngo' ? 'ngo' : 'donor';
  const navigate = useNavigate();
  
  // Donor form state
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPassword, setDonorPassword] = useState('');
  const [donorTerms, setDonorTerms] = useState(false);
  const [isDonorLoading, setIsDonorLoading] = useState(false);
  
  // NGO form state
  const [ngoName, setNgoName] = useState('');
  const [ngoEmail, setNgoEmail] = useState('');
  const [ngoPassword, setNgoPassword] = useState('');
  const [ngoTerms, setNgoTerms] = useState(false);
  const [isNgoLoading, setIsNgoLoading] = useState(false);

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorName || !donorEmail || !donorPassword || !donorTerms) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields and accept the terms',
        variant: 'destructive',
      });
      return;
    }
    
    setIsDonorLoading(true);
    
    try {
      const formData: AuthFormData = {
        email: donorEmail,
        password: donorPassword,
        full_name: donorName,
        user_type: 'donor',
      };
      
      await signUp(formData);
      toast({
        title: 'Registration successful!',
        description: 'Please check your email to confirm your account.',
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
    } finally {
      setIsDonorLoading(false);
    }
  };

  const handleNgoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ngoName || !ngoEmail || !ngoPassword || !ngoTerms) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields and accept the terms',
        variant: 'destructive',
      });
      return;
    }
    
    setIsNgoLoading(true);
    
    try {
      const formData: AuthFormData = {
        email: ngoEmail,
        password: ngoPassword,
        full_name: ngoName,
        user_type: 'ngo',
      };
      
      await signUp(formData);
      toast({
        title: 'Registration successful!',
        description: 'Please check your email to confirm your account.',
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
    } finally {
      setIsNgoLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <BlurContainer className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground mt-2">Join FoodForAll to start making a difference</p>
            </div>

            <Tabs defaultValue={defaultType} className="mb-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="donor">Food Donor</TabsTrigger>
                <TabsTrigger value="ngo">NGO / Charity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="donor">
                <form className="space-y-6" onSubmit={handleDonorSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="donor-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="donor-name" 
                        placeholder="John Doe" 
                        className="pl-10"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donor-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="donor-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donor-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="donor-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={donorPassword}
                        onChange={(e) => setDonorPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="donor-terms" 
                      checked={donorTerms}
                      onCheckedChange={(checked) => setDonorTerms(checked === true)}
                      required 
                    />
                    <Label htmlFor="donor-terms" className="text-sm font-normal">
                      I agree to the{' '}
                      <Link to="/terms" className="text-foodall-teal hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-foodall-teal hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-foodall-teal hover:bg-foodall-teal/90 text-white"
                    disabled={isDonorLoading}
                  >
                    {isDonorLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Creating account...
                      </span>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Donor Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="ngo">
                <form className="space-y-6" onSubmit={handleNgoSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="ngo-name">Organization Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ngo-name" 
                        placeholder="Organization Name" 
                        className="pl-10"
                        value={ngoName}
                        onChange={(e) => setNgoName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ngo-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ngo-email" 
                        type="email" 
                        placeholder="organization@email.com" 
                        className="pl-10"
                        value={ngoEmail}
                        onChange={(e) => setNgoEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ngo-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="ngo-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={ngoPassword}
                        onChange={(e) => setNgoPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ngo-terms" 
                      checked={ngoTerms}
                      onCheckedChange={(checked) => setNgoTerms(checked === true)}
                      required 
                    />
                    <Label htmlFor="ngo-terms" className="text-sm font-normal">
                      I agree to the{' '}
                      <Link to="/terms" className="text-foodall-teal hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-foodall-teal hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-foodall-teal hover:bg-foodall-teal/90 text-white"
                    disabled={isNgoLoading}
                  >
                    {isNgoLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Creating account...
                      </span>
                    ) : (
                      <>
                        <Building className="mr-2 h-4 w-4" />
                        Register Organization
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-foodall-teal hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </BlurContainer>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
