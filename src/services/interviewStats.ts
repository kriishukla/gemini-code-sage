export interface InterviewSession {
  id: string;
  candidateEmail: string;
  candidateName: string;
  timestamp: string;
  duration: number; // in seconds
  startTime: string;
  endTime: string;
  performance: {
    overallScore: number;
    problemsAttempted: number;
    problemsSolved: number;
    codeExecutions: number;
    testsPassed: number;
    testsTotal: number;
  };
  problems: {
    title: string;
    difficulty: string;
    timeSpent: number;
    solved: boolean;
    codeSubmitted: string;
    testResults: Array<{
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
    }>;
  }[];
  aiInteractions: number;
  averageResponseTime: number;
  strengths: string[];
  improvements: string[];
  status: 'completed' | 'abandoned' | 'in-progress';
}

const STORAGE_KEY = 'interview_sessions';

export class InterviewStatsService {
  // Save a new interview session
  static saveSession(session: InterviewSession): void {
    try {
      const existingSessions = this.getAllSessions();
      const updatedSessions = [...existingSessions, session];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      
      // Also save to a downloadable JSON file format for persistence
      this.exportSessionToFile(session);
    } catch (error) {
      console.error('Failed to save interview session:', error);
    }
  }

  // Get all saved interview sessions
  static getAllSessions(): InterviewSession[] {
    try {
      const sessions = localStorage.getItem(STORAGE_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Failed to retrieve interview sessions:', error);
      return [];
    }
  }

  // Get sessions for a specific candidate
  static getSessionsByCandidate(email: string): InterviewSession[] {
    return this.getAllSessions().filter(session => session.candidateEmail === email);
  }

  // Get session by ID
  static getSessionById(id: string): InterviewSession | null {
    return this.getAllSessions().find(session => session.id === id) || null;
  }

  // Generate session statistics summary
  static getSessionsSummary() {
    const sessions = this.getAllSessions();
    const total = sessions.length;
    const completed = sessions.filter(s => s.status === 'completed').length;
    const averageScore = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.performance.overallScore, 0) / sessions.length 
      : 0;
    
    const averageDuration = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
      : 0;

    return {
      totalSessions: total,
      completedSessions: completed,
      abandonedSessions: sessions.filter(s => s.status === 'abandoned').length,
      averageScore: Math.round(averageScore),
      averageDuration: Math.round(averageDuration),
      topCandidates: sessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => b.performance.overallScore - a.performance.overallScore)
        .slice(0, 5),
      recentSessions: sessions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
    };
  }

  // Export session to downloadable file
  static exportSessionToFile(session: InterviewSession): void {
    try {
      const dataStr = JSON.stringify(session, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create filename with timestamp and candidate email
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `interview_${session.candidateEmail.replace('@', '_at_')}_${timestamp}.json`;
      
      // For browser environments, we can create a download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`Interview session exported as ${filename}`);
    } catch (error) {
      console.error('Failed to export session to file:', error);
    }
  }

  // Export all sessions
  static exportAllSessions(): void {
    try {
      const allSessions = this.getAllSessions();
      const dataStr = JSON.stringify(allSessions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `all_interview_sessions_${timestamp}.json`;
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`All interview sessions exported as ${filename}`);
    } catch (error) {
      console.error('Failed to export all sessions:', error);
    }
  }

  // Clear all sessions (for testing/admin purposes)
  static clearAllSessions(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('All interview sessions cleared');
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  }

  // Generate unique session ID
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}