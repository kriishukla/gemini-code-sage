import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  BarChart3,
  Activity,
  LogOut,
  Filter,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';

// Mock data
const dashboardStats = {
  totalCandidates: 247,
  activeInterviews: 12,
  completedToday: 8,
  averageScore: 7.2,
  passRate: 68
};

const recentCandidates = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    position: 'Frontend Developer',
    score: 8.5,
    status: 'completed',
    duration: '45 min',
    date: '2025-09-28',
    skills: ['React', 'TypeScript', 'CSS'],
    avatar: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    position: 'Full Stack Developer',
    score: 6.8,
    status: 'in-progress',
    duration: '32 min',
    date: '2025-09-28',
    skills: ['Node.js', 'Python', 'MongoDB'],
    avatar: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    position: 'Backend Developer',
    score: 9.1,
    status: 'completed',
    duration: '38 min',
    date: '2025-09-27',
    skills: ['Java', 'Spring Boot', 'PostgreSQL'],
    avatar: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'd.kim@email.com',
    position: 'DevOps Engineer',
    score: 7.3,
    status: 'scheduled',
    duration: '-',
    date: '2025-09-29',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    avatar: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Anna Williams',
    email: 'anna.w@email.com',
    position: 'Mobile Developer',
    score: 8.0,
    status: 'completed',
    duration: '41 min',
    date: '2025-09-27',
    skills: ['React Native', 'Swift', 'Flutter'],
    avatar: '/placeholder.svg'
  }
];

const skillsAnalytics = [
  { skill: 'JavaScript', avgScore: 7.8, candidates: 142 },
  { skill: 'Python', avgScore: 8.1, candidates: 98 },
  { skill: 'React', avgScore: 7.5, candidates: 87 },
  { skill: 'Java', avgScore: 8.3, candidates: 76 },
  { skill: 'Node.js', avgScore: 7.2, candidates: 65 }
];

const HiringManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default', className: 'bg-green-100 text-green-700', label: 'Completed' },
      'in-progress': { variant: 'secondary', className: 'bg-blue-100 text-blue-700', label: 'In Progress' },
      scheduled: { variant: 'outline', className: 'bg-yellow-100 text-yellow-700', label: 'Scheduled' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hiring Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your interview processes</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalCandidates}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{dashboardStats.activeInterviews}</div>
                    <p className="text-xs text-muted-foreground">In progress now</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{dashboardStats.completedToday}</div>
                    <p className="text-xs text-muted-foreground">+3 from yesterday</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{dashboardStats.averageScore}/10</div>
                    <p className="text-xs text-muted-foreground">+0.3 this week</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{dashboardStats.passRate}%</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Interview Sessions</CardTitle>
                  <CardDescription>Latest candidate activities and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCandidates.slice(0, 3).map((candidate, index) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{candidate.name}</p>
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{candidate.score}</span>
                          </div>
                          {getStatusBadge(candidate.status)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Candidates</CardTitle>
                    <CardDescription>Manage and review candidate performances</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCandidates.map((candidate, index) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar>
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{candidate.name}</p>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">{candidate.score}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{candidate.email} • {candidate.position}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{candidate.date}</span>
                            <Clock className="h-4 w-4 text-gray-400 ml-4" />
                            <span className="text-sm text-gray-600">{candidate.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusBadge(candidate.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Performance</CardTitle>
                  <CardDescription>Average scores by technology</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillsAnalytics.map((skill, index) => (
                      <motion.div
                        key={skill.skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{skill.skill}</p>
                            <p className="text-sm text-gray-600">{skill.candidates} candidates</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{skill.avgScore}/10</p>
                          </div>
                        </div>
                        <Progress value={skill.avgScore * 10} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interview Insights</CardTitle>
                  <CardDescription>Key metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Average Interview Duration</p>
                      <p className="text-2xl font-bold text-blue-600">42 minutes</p>
                      <p className="text-sm text-gray-500">3 min faster than last month</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Completion Rate</p>
                      <p className="text-2xl font-bold text-green-600">92%</p>
                      <Progress value={92} className="h-2 mt-2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">AI Accuracy Score</p>
                      <p className="text-2xl font-bold text-purple-600">96.5%</p>
                      <p className="text-sm text-gray-500">Gemini AI assessment accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HiringManagerDashboard;