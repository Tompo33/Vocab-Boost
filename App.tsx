
import React, { useState, useEffect } from 'react';
import { fetchRandomQuestion } from './services/sheetService';
import { getFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);

  const handleGenerateQuestion = async () => {
    setIsLoadingQuestion(true);
    setFeedback('');
    setUserInput('');
    const q = await fetchRandomQuestion();
    setQuestion(q);
    setIsLoadingQuestion(false);
  };

  const handleBoost = async () => {
    if (!userInput.trim()) return;
    setIsBoosting(true);
    const result = await getFeedback(userInput);
    setFeedback(result);
    setIsBoosting(false);
  };

  useEffect(() => {
    handleGenerateQuestion();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="w-full text-center mt-8">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Len pár viet</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          Reaguj na otázku 3-5 vetami. Dostaneš feedback na text, na tvoju achilovku + upgrade textu o úroveň. Nezabudni si to následne screenshotnúť ;)
        </p>
      </header>

      {/* Question Section */}
      <section className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col items-center space-y-6">
        <div className="min-h-[4rem] flex items-center justify-center text-center">
          {isLoadingQuestion ? (
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            </div>
          ) : (
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed italic">
              {question || "Klikni na tlačidlo nižšie pre otázku..."}
            </h2>
          )}
        </div>
        
        <button
          onClick={handleGenerateQuestion}
          disabled={isLoadingQuestion}
          className="bg-blue-900 hover:bg-blue-800 text-gray-200 px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 disabled:opacity-50 shadow-md"
        >
          {isLoadingQuestion ? 'Chvíľku strpenia...' : 'Vypľuj ďalšiu otázku'}
        </button>
      </section>

      {/* Input Section */}
      <section className="w-full space-y-4">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Sem píš a počkaj na zázrak..."
            className="w-full min-h-[250px] p-6 bg-gray-800 text-gray-100 rounded-2xl border-2 border-transparent focus:border-blue-900 outline-none resize-none text-lg leading-relaxed shadow-inner placeholder-gray-500"
          />
          <div className="absolute bottom-4 right-4 text-gray-500 text-sm font-medium">
            {userInput.length} znakov
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBoost}
            disabled={isBoosting || !userInput.trim()}
            className="bg-blue-900 hover:bg-blue-800 text-gray-200 px-10 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
          >
            {isBoosting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Boostujem...</span>
              </>
            ) : (
              'Boostni moju angličtinu'
            )}
          </button>
        </div>
      </section>

      {/* Feedback Section */}
      {feedback && (
        <section className="w-full bg-blue-50 rounded-2xl p-8 border border-blue-200 shadow-sm animate-fade-in animate-[fadeIn_0.5s_ease-out]">
          <h3 className="text-blue-900 font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Feedback
          </h3>
          <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
            {renderFeedback(feedback)}
          </div>
        </section>
      )}

      {/* Footer Spacer */}
      <footer className="h-16"></footer>
    </div>
  );
};

// Helper to highlight bold parts in the feedback string
const renderFeedback = (text: string) => {
  const parts = text.split(/(\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={i} className="text-blue-700">{part.slice(1, -1)}</strong>;
    }
    return part;
  });
};

export default App;
