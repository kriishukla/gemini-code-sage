import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogIn, User, Lock, Building2, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const selectedRole = location.state?.selectedRole as 'candidate' | 'hiring-manager' | undefined;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no role selected
  if (!selectedRole) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      // Create user data
      const userData = {
        email,
        role: selectedRole,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };

      // Use auth context to log in
      login(userData);

      toast({
        title: "Login Successful!",
        description: `Welcome back! Redirecting to your ${selectedRole === 'candidate' ? 'coding environment' : 'dashboard'}...`,
      });

      // Navigate based on role
      if (selectedRole === 'candidate') {
        navigate('/candidate');
      } else {
        navigate('/hiring-manager');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const roleConfig = {
    candidate: {
      title: 'Candidate Login',
      description: 'Access your coding interview environment',
      icon: Code2,
      color: 'blue',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    'hiring-manager': {
      title: 'Hiring Manager Login',
      description: 'Access your management dashboard',
      icon: Building2,
      color: 'purple',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  };

  const config = roleConfig[selectedRole];
  const IconComponent = config.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </Button>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                config.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <IconComponent className={`h-8 w-8 ${
                  config.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                }`} />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                {config.title}
              </CardTitle>
              <CardDescription className="text-base">
                {config.description}
              </CardDescription>
              <Badge 
                variant="secondary" 
                className={`mt-2 w-fit mx-auto ${
                  config.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}
              >
                {selectedRole === 'candidate' ? 'Candidate Portal' : 'HR Dashboard'}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full text-white py-3 ${
                    config.color === 'blue' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <LogIn className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <LogIn className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          <p>Your session is secure and encrypted</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;