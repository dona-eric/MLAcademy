'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { fetchApi } from '@/lib/api';

interface CopilotTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldName: string;
  courseId?: string;
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
      }, 1500); // 1.5s debounce pour textarea
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
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="relative w-full">
      {/* Overlay pour la suggestion */}
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
      
      {/* Indicateur de chargement/suggestion */}
      <div className="absolute right-3 bottom-3 z-20 pointer-events-none flex items-center gap-2">
        {isFetching && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D1FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D1FF]"></span>
          </span>
        )}
        {!isFetching && suggestion && (
          <div className="text-[10px] font-bold text-slate-500 border border-slate-700 rounded px-1 bg-[#0A192F]">
            TAB pour accepter
          </div>
        )}
      </div>
    </div>
  );
}
