import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const VoiceInput = ({ value, onChange, placeholder, className }: VoiceInputProps) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognitionClass();
      
      if (recognition.current) {
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.current.onstart = () => {
          setIsListening(true);
        };

        recognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onChange(value ? `${value} ${transcript}` : transcript);
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };

        recognition.current.onerror = () => {
          setIsListening(false);
        };
      }
    }
  }, [i18n.language, value, onChange]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window && value) {
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className={className}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-20 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      
      <div className="absolute right-1 top-1 flex space-x-1">
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={speakText}
            title="Listen to text"
            className="h-8 w-8 p-0"
          >
            <Volume2 className="h-3 w-3" />
          </Button>
        )}
        
        <Button
          type="button"
          variant={isListening ? "voice" : "ghost"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          title={isListening ? "Stop recording" : t('signup.voiceHint')}
          className={`h-8 w-8 p-0 ${isListening ? 'animate-pulse' : ''}`}
        >
          {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
};