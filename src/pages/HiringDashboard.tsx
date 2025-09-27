import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart3, Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock candidate data
const mockCandidates = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    position: 'Frontend Developer',
    interviewDate: '2024-01-15',
    status: 'completed',
    score: 85,
    timeSpent: '45 min',
    problemsSolved: 2,
    totalProblems: 3,
    codeQuality: 'Good',
    complexity: 'O(n log n)',
    hints: 3
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    position: 'Full Stack Developer',
    interviewDate: '2024-01-16',
    status: 'in-progress',
    score: 72,
    timeSpent: '30 min',
    problemsSolved: 1,
    totalProblems: 2,
    codeQuality: 'Excellent',
    complexity: 'O(n)',
    hints: 1
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    position: 'Backend Developer',
    interviewDate: '2024-01-17',
    status: 'scheduled',
    score: 0,
    timeSpent: '0 min',
    problemsSolved: 0,
    totalProblems: 0,
    codeQuality: 'N/A',
    complexity: 'N/A',
    hints: 0
  }
];

export const HiringDashboard = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-status-success text-status-success';
      case 'in-progress': return 'bg-status-warning text-status-warning';
      case 'scheduled': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CS</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">CodeSage Dashboard</h1>
            <Badge variant="secondary" className="text-xs">Hiring Manager</Badge>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Candidate List */}
        <div className="w-80 border-r border-border/50 bg-card p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h2 className="font-semibold">Candidates</h2>
            </div>
            
            {mockCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCandidate(candidate)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCandidate.id === candidate.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{candidate.position}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                      {candidate.status === 'completed' && (
                        <span className="text-sm font-medium">{candidate.score}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Candidate Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-lg">
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                  <p className="text-muted-foreground">{selectedCandidate.email}</p>
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(selectedCandidate.status)}>
                {selectedCandidate.status}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Overall Score</span>
                </div>
                <p className="text-2xl font-bold mt-2">{selectedCandidate.score}%</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Time Spent</span>
                </div>
                <p className="text-2xl font-bold mt-2">{selectedCandidate.timeSpent}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-status-success" />
                  <span className="text-sm font-medium">Problems Solved</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {selectedCandidate.problemsSolved}/{selectedCandidate.totalProblems}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Code Quality</span>
                </div>
                <p className="text-2xl font-bold mt-2">{selectedCandidate.codeQuality}</p>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="code-analysis">Code Analysis</TabsTrigger>
                <TabsTrigger value="session-replay">Session Replay</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Performance Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Algorithmic Complexity</span>
                      <Badge variant="outline">{selectedCandidate.complexity}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hints Used</span>
                      <Badge variant="outline">{selectedCandidate.hints}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Interview Date</span>
                      <span className="text-sm text-muted-foreground">{selectedCandidate.interviewDate}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="code-analysis" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Code Quality Assessment</h3>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Strengths:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Clean, readable code structure</li>
                        <li>Proper variable naming conventions</li>
                        <li>Efficient algorithm implementation</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Could add more edge case handling</li>
                        <li>Consider adding comments for complex logic</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="session-replay" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Session Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">00:00</span>
                      <span>Interview started</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">05:30</span>
                      <span>Began coding solution</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">15:45</span>
                      <span>Requested hint about optimization</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-status-success rounded-full"></div>
                      <span className="text-muted-foreground">35:20</span>
                      <span>Completed solution successfully</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};