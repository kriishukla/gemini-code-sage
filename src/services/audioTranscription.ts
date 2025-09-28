import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: "61740bf680414884ac942ff3dda23a07",
});

export class AudioTranscriptionService {
  static async transcribeAudio(audioFile: File): Promise<string> {
    try {
      // Convert File to ArrayBuffer, then to Buffer for AssemblyAI
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioData = new Uint8Array(arrayBuffer);
      
      const params = {
        audio: audioData,
        speech_model: "nano" as const, // Use nano model for faster processing
        format_text: true,
        punctuate: true,
        language_code: "en"
      };

      console.log('Starting transcription...');
      const transcript = await client.transcripts.transcribe(params);
      
      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }
      
      return transcript.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  static async transcribeAudioFromUrl(audioUrl: string): Promise<string> {
    try {
      const params = {
        audio: audioUrl,
        speech_model: "nano" as const,
        format_text: true,
        punctuate: true,
        language_code: "en"
      };

      console.log('Starting transcription from URL...');
      const transcript = await client.transcripts.transcribe(params);
      
      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }
      
      return transcript.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  // Real-time transcription (streaming)
  static async startRealTimeTranscription(
    onTranscript: (transcript: string) => void,
    onError: (error: Error) => void
  ) {
    try {
      // Note: Real-time transcription requires WebSocket connection
      // This is a simplified implementation
      console.log('Real-time transcription not yet implemented');
      throw new Error('Real-time transcription not yet supported');
    } catch (error) {
      console.error('Real-time transcription error:', error);
      onError(error as Error);
    }
  }
}