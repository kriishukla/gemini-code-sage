import { AssemblyAI } from 'assemblyai';

// Initialize AssemblyAI client with API key
const client = new AssemblyAI({
  apiKey: '61740bf680414884ac942ff3dda23a07'
});

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export interface TranscriptionOptions {
  speech_model?: 'universal' | 'nano';
  language_code?: string;
  punctuate?: boolean;
  format_text?: boolean;
}

export class AssemblyService {
  /**
   * Transcribe audio from a blob (recorded audio)
   */
  static async transcribeBlob(
    audioBlob: Blob, 
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      // Convert blob to base64 for upload
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte), 
          ''
        )
      );

      // Upload audio and get transcript
      const transcript = await client.transcripts.transcribe({
        audio: `data:audio/wav;base64,${base64Audio}`,
        speech_model: options.speech_model || 'universal',
        language_code: options.language_code || 'en',
        punctuate: options.punctuate !== false,
        format_text: options.format_text !== false,
      });

      if (transcript.status === 'error') {
        throw new Error(transcript.error || 'Transcription failed');
      }

      return {
        text: transcript.text || '',
        confidence: transcript.confidence,
        words: transcript.words
      };
    } catch (error) {
      console.error('AssemblyAI transcription error:', error);
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transcribe audio from a URL
   */
  static async transcribeUrl(
    audioUrl: string, 
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      const transcript = await client.transcripts.transcribe({
        audio: audioUrl,
        speech_model: options.speech_model || 'universal',
        language_code: options.language_code || 'en',
        punctuate: options.punctuate !== false,
        format_text: options.format_text !== false,
      });

      if (transcript.status === 'error') {
        throw new Error(transcript.error || 'Transcription failed');
      }

      return {
        text: transcript.text || '',
        confidence: transcript.confidence,
        words: transcript.words
      };
    } catch (error) {
      console.error('AssemblyAI transcription error:', error);
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if the service is available
   */
  static isAvailable(): boolean {
    try {
      return typeof navigator !== 'undefined' && 
             'mediaDevices' in navigator && 
             'getUserMedia' in navigator.mediaDevices;
    } catch {
      return false;
    }
  }
}

export default AssemblyService;