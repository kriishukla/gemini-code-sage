import { useState, useRef, useCallback, useEffect } from 'react';
import { AssemblyService } from '@/services/assemblyService';

interface UseAudioRecorderOptions {
  onTranscriptionStart?: () => void;
  onTranscriptionComplete?: (text: string) => void;
  onTranscriptionError?: (error: string) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
  audioUrl: string | null;
}

export const useAudioRecorder = (options: UseAudioRecorderOptions = {}): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setDuration(Math.floor(elapsed / 1000));
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Good for speech recognition
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];
      
      // Create MediaRecorder with optimal settings for speech
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus' // Good compression and quality
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert blob to File for transcription
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        
        setIsTranscribing(true);
        options.onTranscriptionStart?.();

        try {
          // Use AssemblyAI for transcription
          const transcription = await AssemblyService.transcribeBlob(audioFile);
          options.onTranscriptionComplete?.(transcription.text);
        } catch (error) {
          console.error('Transcription failed:', error);
          options.onTranscriptionError?.(error instanceof Error ? error.message : 'Transcription failed');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      startTimer();

    } catch (error) {
      console.error('Failed to start recording:', error);
      options.onTranscriptionError?.('Failed to access microphone. Please check permissions.');
    }
  }, [options, startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
    setIsPaused(false);
    stopTimer();
  }, [stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [startTimer]);

  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDuration(0);
    chunksRef.current = [];
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [stopRecording, audioUrl]);

  return {
    isRecording,
    isPaused,
    duration,
    isTranscribing,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    audioUrl,
  };
};