import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Building2, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'candidate' | 'hiring-manager') => {
    navigate('/login', { state: { selectedRole: role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Welcome to Gemini Code Sage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose your role to get started with our advanced coding interview platform
          </motion.p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Candidate Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="transform transition-all duration-300"
          >
            <Card className="h-full border-2 hover:border-blue-300 hover:shadow-lg cursor-pointer group">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Code2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I'm a Candidate</CardTitle>
                <CardDescription className="text-lg">
                  Take coding interviews and showcase your skills
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-3 mb-8 text-gray-600">
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Interactive coding environment
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Real-time AI interviewer chat
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Comprehensive code analysis
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Multiple programming languages
                  </li>
                </ul>
                <Button
                  onClick={() => handleRoleSelect('candidate')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  size="lg"
                >
                  Continue as Candidate
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hiring Manager Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="transform transition-all duration-300"
          >
            <Card className="h-full border-2 hover:border-purple-300 hover:shadow-lg cursor-pointer group">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I'm a Hiring Manager</CardTitle>
                <CardDescription className="text-lg">
                  Access analytics and manage interview processes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-3 mb-8 text-gray-600">
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Candidate performance analytics
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Interview session management
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Detailed assessment reports
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Team collaboration tools
                  </li>
                </ul>
                <Button
                  onClick={() => handleRoleSelect('hiring-manager')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                  size="lg"
                >
                  Continue as Hiring Manager
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12 text-gray-500"
        >
          <p>Powered by Google Gemini AI • Secure • Reliable</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;