'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

interface Choice {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  choices: Choice[];
  order: number;
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
  
  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  
  // Results state
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await fetchApi(`/api/learning/lessons/${lessonId}/quiz/`);
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
      const response = await fetchApi(`/api/learning/lessons/${lessonId}/quiz/`, {
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

  if (loading) return <div className="text-center p-8 text-muted">Chargement du quiz...</div>;
  if (error && !result) return <div className="alert-error text-center">{error}</div>;
  if (questions.length === 0) return <div className="text-center p-8 text-muted">Ce quiz n'a pas encore de questions.</div>;

  // View: Results
  if (result) {
    return (
      <div className="quiz-results glass-panel p-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            {result.passed ? 'Félicitations !' : 'Échec'}
          </h2>
          <div className="score-circle" style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: result.passed ? '#10b981' : '#ef4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto', border: `4px solid ${result.passed ? '#10b981' : '#ef4444'}`
          }}>
            {result.score}%
          </div>
          <p className="mt-4 text-muted">
            Score requis : 85% <br/>
            Tentatives : {result.attempts_used} / {result.max_attempts}
          </p>
          
          {error && <div className="alert-error mt-4">{error}</div>}
        </div>

        <div className="results-breakdown">
          <h3 className="mb-4">Correction détaillée :</h3>
          {questions.map((q, i) => {
            const qResult = result.results.find(r => r.question_id === q.id);
            const isCorrect = qResult?.is_correct;
            return (
              <div key={q.id} className="mb-6 p-4 rounded-lg" style={{ background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}` }}>
                <p className="font-semibold mb-2">Question {i + 1} : {q.text}</p>
                <p className="text-sm mb-2">
                  <span style={{ color: isCorrect ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {isCorrect ? 'Bonne réponse' : 'Mauvaise réponse'}
                  </span>
                </p>
                {qResult?.explanation && (
                  <div className="text-sm text-muted mt-2 p-3 bg-black/20 rounded">
                    <strong>Explication :</strong> {qResult.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          {!result.passed && result.attempts_used < result.max_attempts && (
            <button onClick={resetQuiz} className="btn btn-primary">
              Réessayer le Quiz
            </button>
          )}
          {!result.passed && result.attempts_used >= result.max_attempts && (
            <p className="text-error font-bold">Vous avez épuisé toutes vos tentatives.</p>
          )}
        </div>
      </div>
    );
  }

  // View: Interactive Card (One question at a time)
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="quiz-card glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
      <div className="quiz-header flex justify-between items-center mb-6 text-sm text-muted">
        <span>Question {currentIndex + 1} sur {questions.length}</span>
        <div className="quiz-progress-bar" style={{ flex: 1, margin: '0 1rem', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <h2 className="question-text text-xl font-semibold mb-6 leading-relaxed">
        {currentQuestion.text}
      </h2>

      <div className="choices-list flex flex-col gap-3 mb-8">
        {currentQuestion.choices.map(choice => (
          <label 
            key={choice.id} 
            className="choice-item"
            style={{
              display: 'flex', alignItems: 'center', padding: '1rem', 
              border: `2px solid ${answers[currentQuestion.id] === choice.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              borderRadius: '8px', cursor: 'pointer', background: answers[currentQuestion.id] === choice.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <input 
              type="radio" 
              name={`q-${currentQuestion.id}`} 
              checked={answers[currentQuestion.id] === choice.id}
              onChange={() => handleSelect(choice.id)}
              style={{ marginRight: '1rem', accentColor: 'var(--accent-primary)' }}
            />
            <span>{choice.text}</span>
          </label>
        ))}
      </div>

      <div className="quiz-footer flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          ← Précédent
        </button>

        {!isLastQuestion ? (
          <button 
            onClick={handleNext} 
            className="btn btn-primary"
          >
            Suivant →
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            className="btn btn-primary"
            style={{ background: allAnswered ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-secondary)' }}
            disabled={!allAnswered || submitting}
          >
            {submitting ? 'Validation...' : 'Soumettre le Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
