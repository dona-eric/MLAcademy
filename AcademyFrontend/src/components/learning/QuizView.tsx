'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, HelpCircle, Loader2, RotateCcw } from 'lucide-react';

interface Choice {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  choices: Choice[];
  order: number;
  explanation?: string;
}

interface QuizResult {
  question_id: number;
  is_correct: boolean;
  explanation: string;
}

interface QuizSubmissionResponse {
  score: number;
  passed: boolean;
  attempts_used: number;
  max_attempts: number;
  results: QuizResult[];
  error?: string;
}

export default function QuizView({ lessonId, onComplete }: { lessonId: number | string, onComplete: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await fetchApi("/api/learning/lessons/${lessonId}/quiz/");
        setQuestions(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger le quiz.");
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [lessonId]);

  const handleSelect = (choiceId: number) => {
    if (result) return;
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: choiceId
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchApi("/api/learning/lessons/${lessonId}/quiz/", {
        method: 'POST',
        body: JSON.stringify({ answers })
      });
      setResult(response);
      if (response.passed) {
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la soumission du quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-10 h-10 text-[#00D1FF] animate-spin" />
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest animate-pulse">Chargement du quiz...</p>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center space-y-4">
        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
        <p className="text-red-400 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm">Réessayer</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-[#112240] rounded-[40px] p-12 text-center space-y-4 border border-white/5">
        <HelpCircle className="w-12 h-12 text-gray-600 mx-auto" />
        <p className="text-gray-400">Ce quiz n'a pas encore de questions.</p>
      </div>
    );
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <div className={"rounded-[40px] p-10 text-center border shadow-2xl ${result.passed ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}"}>
          <h2 className={"text-3xl font-black mb-6 ${result.passed ? 'text-green-400' : 'text-red-400'}"}>
            {result.passed ? 'Félicitations !' : 'Continue tes efforts !'}
          </h2>

          <div className="relative inline-block">
            <div className={"w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black border-4 shadow-2xl mb-4 mx-auto ${result.passed ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-red-500 text-red-400 bg-red-500/10'}"}>
              {result.score}%
            </div>
          </div>

          <p className="text-gray-400 font-medium max-w-xs mx-auto">
            {result.passed
              ? "Tu as brillamment réussi ce quiz et validé tes acquis !"
              : "Il te faut 85% pour valider. Tentative ${result.attempts_used}/${result.max_attempts}."}
          </p>

          <div className="flex justify-center gap-4 mt-8">
            {!result.passed && result.attempts_used < result.max_attempts && (
              <button onClick={resetQuiz} className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all">
                <RotateCcw className="w-4 h-4" />
                Réessayer le Quiz
              </button>
            )}
            {result.passed && (
              <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-6 py-3 rounded-2xl">
                <CheckCircle2 className="w-5 h-5" />
                Leçon validée
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest ml-4">Correction détaillée</h3>
          {questions.map((q, i) => {
            const qResult = result.results.find(r => r.question_id === q.id);
            const isCorrect = qResult?.is_correct;
            return (
              <div key={q.id} className={"p-6 rounded-[30px] border transition-all ${isCorrect ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}"}>
                <div className="flex items-start gap-4">
                  <div className={"mt-1 shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-500'}"}>
                    {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className="space-y-3">
                    <p className="font-bold text-white">Question {i + 1}: {q.text}</p>
                    {qResult?.explanation && (
                      <div className="text-sm text-gray-400 bg-black/20 p-4 rounded-2xl border border-white/5 italic">
                        {qResult.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="bg-[#112240] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">

      {/* Quiz Progress */}
      <div className="px-10 pt-10 flex items-center justify-between gap-6">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "${((currentIndex + 1) / questions.length) * 100}%" }}
            className="h-full bg-[#00D1FF] shadow-[0_0_15px_rgba(0,209,255,0.5)]"
          />
        </div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest shrink-0">
          Question {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="p-10 lg:p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <h2 className="text-2xl font-bold text-white leading-tight">
              {currentQuestion.text}
            </h2>

            <div className="grid gap-3">
              {currentQuestion.choices.map((choice) => {
                const isSelected = answers[currentQuestion.id] === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelect(choice.id)}
                    className={"group flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${isSelected ? 'bg-[#00D1FF]/10 border-[#00D1FF] shadow-[0_0_20px_rgba(0,209,255,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}"}
                  >
                    <div className={"w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-[#00D1FF] bg-[#00D1FF]' : 'border-gray-600'}"}>
                      {isSelected && <div className="w-2 h-2 bg-[#0A192F] rounded-full" />}
                    </div>
                    <span className={"font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}"}>
                      {choice.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-12 pt-10 border-t border-white/5">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={"flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}"}
          >
            <ChevronLeft className="w-5 h-5" />
            Précédent
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={"flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${answers[currentQuestion.id] ? 'bg-white/10 text-white hover:bg-white/20' : 'text-gray-600 cursor-not-allowed'}"}
            >
              Suivant
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className={"flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-sm transition-all ${allAnswered && !submitting ? 'bg-[#00D1FF] text-[#0A192F] shadow-lg shadow-[#00D1FF]/20 hover:scale-105 active:scale-95' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}"}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {submitting ? 'Validation...' : 'Soumettre le Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
