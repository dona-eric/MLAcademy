'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { fetchApi } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface CopilotTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  fieldName: string;
  courseId?: string;
  value: string;
  onValueChange: (val: string) => void;
}

export function CopilotTextarea({ fieldName, courseId, value, onValueChange, className, ...props }: CopilotTextareaProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (value && typeof value === 'string' && value.trim().length > 10) {
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
          console.error("Erreur Copilot Textarea:", err);
          setSuggestion('');
        } finally {
          setIsFetching(false);
        }
      }, 1500);
    } else {
      setSuggestion('');
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, fieldName, courseId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSuggestion('');
    onValueChange(e.target.value);
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      const newValue = `${value}${suggestion}`;
      onValueChange(newValue);
      setSuggestion('');
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div 
        className={`absolute inset-0 pointer-events-none px-4 py-3 text-sm whitespace-pre-wrap break-words overflow-hidden`}
        style={{ fontFamily: 'inherit' }}
      >
        <span className="opacity-0">{(value as string) || ''}</span>
        <span className="text-slate-500 opacity-60 bg-[#0A192F]/50">{suggestion}</span>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D1FF] transition-colors relative z-10 bg-transparent resize-none ${className || ''}`}
        {...props}
      />
      
      <div className="absolute right-3 bottom-3 z-20 pointer-events-none flex items-center gap-2">
        {isFetching && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D1FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D1FF]"></span>
          </span>
        )}
        {!isFetching && suggestion && (
          <button 
            type="button"
            onClick={acceptSuggestion}
            className="flex items-center gap-1 text-[10px] font-bold text-[#00D1FF] bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 px-2 py-1 rounded-md transition-colors pointer-events-auto"
          >
            <Sparkles className="w-3 h-3" /> Accepter
          </button>
        )}
      </div>
    </div>
  );
}
