import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const [userType, setUserType] = useState<'hiring' | 'candidate' | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = () => {
    // Dummy login - accept any credentials
    if (credentials.username && credentials.password) {
      localStorage.setItem('userType', userType!);
      localStorage.setItem('isLoggedIn', 'true');
      
      if (userType === 'hiring') {
        navigate('/hiring-dashboard');
      } else {
        navigate('/interview');
      }
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">CS</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">CodeSage</h1>
            <p className="text-muted-foreground">AI Technical Interviewer</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setUserType('hiring')}
              variant="outline"
              size="lg"
              className="w-full h-16 justify-start gap-4 hover:bg-secondary/50"
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Hiring Manager</div>
                <div className="text-sm text-muted-foreground">View candidate stats and manage interviews</div>
              </div>
            </Button>

            <Button
              onClick={() => setUserType('candidate')}
              variant="outline"
              size="lg"
              className="w-full h-16 justify-start gap-4 hover:bg-secondary/50"
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                <UserCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Candidate</div>
                <div className="text-sm text-muted-foreground">Take technical interview</div>
              </div>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {userType === 'hiring' ? 'Hiring Manager' : 'Candidate'} Login
            </Badge>
            <h2 className="text-xl font-semibold">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">Enter any credentials to continue</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={!credentials.username || !credentials.password}
              className="w-full"
            >
              Login
            </Button>

            <Button
              onClick={() => setUserType(null)}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};