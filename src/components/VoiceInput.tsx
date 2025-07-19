
import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscription: (text: string, language?: string) => void;
  isListening: boolean;
  className?: string;
}

export function VoiceInput({ onTranscription, isListening, className }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscription(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant={isRecording ? "destructive" : "outline"}
      size="sm"
      onClick={toggleRecording}
      className={cn(
        "flex items-center gap-2 transition-all",
        isRecording && "animate-pulse",
        className
      )}
      disabled={isListening}
    >
      {isRecording ? (
        <>
          <MicOff className="h-4 w-4" />
          Stop
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Voice
        </>
      )}
    </Button>
  );
}
