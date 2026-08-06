'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { fetchApi } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface CopilotInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  fieldName: string;
  courseId?: string;
  value: string;
  onValueChange: (val: string) => void;
}

export function CopilotInput({ fieldName, courseId, value, onValueChange, className, ...props }: CopilotInputProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (value && typeof value === 'string' && value.trim().length > 3) {
      debounceTimer.current = setTimeout(async () => {
        setIsFetching(true);
        try {
          const response = await fetchApi('/api/chat/autocomplete/', {
            method: 'POST',
            body: JSON.stringify({
              text: value,
              field: fieldName,
              course_id: courseId
            })
          });
          if (response && response.completion) {
            setSuggestion(response.completion);
          } else {
            setSuggestion('');
          }
        } catch (err) {
          console.error("Erreur Copilot:", err);
          setSuggestion('');
        } finally {
          setIsFetching(false);
        }
      }, 1000); 
    } else {
      setSuggestion('');
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, fieldName, courseId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault(); 
      const newValue = `${value}${suggestion}`;
      onValueChange(newValue);
      setSuggestion('');
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuggestion('');
    onValueChange(e.target.value);
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      const newValue = `${value}${suggestion}`;
      onValueChange(newValue);
      setSuggestion('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div 
        className={`absolute inset-0 pointer-events-none px-4 py-3 text-sm flex items-center overflow-hidden whitespace-nowrap`}
        style={{ fontFamily: 'inherit' }}
      >
        <span className="opacity-0">{(value as string) || ''}</span>
        <span className="text-slate-500 opacity-60 ml-0">{suggestion}</span>
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D1FF] transition-colors relative z-10 bg-transparent ${className || ''}`}
        {...props}
      />
      
      {isFetching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D1FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D1FF]"></span>
          </span>
        </div>
      )}
      {!isFetching && suggestion && (
        <button 
          type="button"
          onClick={acceptSuggestion}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#00D1FF] bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 px-2 py-1 rounded-md z-20 transition-colors pointer-events-auto"
        >
          <Sparkles className="w-3 h-3" /> Accepter
        </button>
      )}
    </div>
  );
}
