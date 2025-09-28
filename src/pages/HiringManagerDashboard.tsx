import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { InterviewHistory } from '@/components/InterviewHistory';
import { InterviewStatsService } from '@/services/interviewStats';
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
  const [realStats, setRealStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    abandonedSessions: 0,
    averageScore: 0,
    averageDuration: 0,
    topCandidates: [] as any[],
    recentSessions: [] as any[]
  });

  // Load real statistics on component mount
  useEffect(() => {
    const stats = InterviewStatsService.getSessionsSummary();
    setRealStats(stats);
  }, []);

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
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
            <TabsTrigger value="history" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Interview History
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
                    <div className="text-2xl font-bold">{realStats.totalSessions}</div>
                    <p className="text-xs text-muted-foreground">Total interview sessions</p>
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
                    <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{realStats.completedSessions}</div>
                    <p className="text-xs text-muted-foreground">Successfully finished</p>
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
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{realStats.averageScore}%</div>
                    <p className="text-xs text-muted-foreground">Overall performance</p>
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
                    <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{Math.floor(realStats.averageDuration / 60)}m</div>
                    <p className="text-xs text-muted-foreground">Time per session</p>
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
                    <CardTitle className="text-sm font-medium">Abandoned Sessions</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{realStats.abandonedSessions}</div>
                    <p className="text-xs text-muted-foreground">Incomplete sessions</p>
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
                    {realStats.recentSessions.slice(0, 3).length > 0 ? realStats.recentSessions.slice(0, 3).map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{session.candidateName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{session.candidateName}</p>
                            <p className="text-sm text-gray-600">{session.candidateEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{session.performance.overallScore}%</span>
                          </div>
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent sessions</p>
                      </div>
                    )}
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
                    <CardTitle>Recent Interview Sessions ({realStats.recentSessions.length})</CardTitle>
                    <CardDescription>Latest candidate interview results</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realStats.recentSessions.length > 0 ? realStats.recentSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar>
                          <AvatarFallback>{session.candidateName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{session.candidateName}</p>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">{session.performance.overallScore}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{session.candidateEmail}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{new Date(session.timestamp).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 text-gray-400 ml-4" />
                            <span className="text-sm text-gray-600">{Math.floor(session.duration / 60)}m {session.duration % 60}s</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {session.problems.map((problem, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {problem.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No interview sessions yet</p>
                      <p className="text-sm">Sessions will appear here after candidates complete interviews</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Statistics</CardTitle>
                  <CardDescription>Overview of interview performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Completion Rate</span>
                        <span className="font-semibold">
                          {realStats.totalSessions > 0 
                            ? Math.round((realStats.completedSessions / realStats.totalSessions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={realStats.totalSessions > 0 
                          ? (realStats.completedSessions / realStats.totalSessions) * 100 
                          : 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{realStats.completedSessions}</div>
                        <div className="text-sm text-green-700">Completed</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{realStats.abandonedSessions}</div>
                        <div className="text-sm text-red-700">Abandoned</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span>Average Score</span>
                        <span className="font-semibold">{realStats.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Duration</span>
                        <span className="font-semibold">{Math.floor(realStats.averageDuration / 60)}m {realStats.averageDuration % 60}s</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Highest scoring candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realStats.topCandidates.length > 0 ? (
                      realStats.topCandidates.map((candidate, index) => (
                        <motion.div
                          key={candidate.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{candidate.candidateName}</p>
                              <p className="text-sm text-gray-600">{candidate.candidateEmail}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{candidate.performance.overallScore}%</p>
                            <p className="text-xs text-gray-500">{Math.floor(candidate.duration / 60)}m</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No interview data yet</p>
                        <p className="text-sm">Complete some interviews to see analytics</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <InterviewHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HiringManagerDashboard;