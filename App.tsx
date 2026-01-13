
import React, { useState, useEffect } from 'react';
import { fetchRandomQuestion } from './services/sheetService';
import { getFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleCopy = () => {
    if (!feedback) return;
    const footerText = "Nezabudni si tento feedback screenshotnúť, lebo zmizne. ;)";
    const textToCopy = feedback.replace(footerText, "").trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  useEffect(() => {
    handleGenerateQuestion();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8 max-w-4xl mx-auto font-serif">
      {/* Header */}
      <header className="w-full text-center mt-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Take Away English: Tvoja denná porcia angličtiny 🍱</h1>
        <p className="text-gray-600 mt-4 text-base font-medium max-w-2xl mx-auto leading-relaxed">
          Ponúkam ti otázku. Priprav si na ňu rýchlu odpoveď, 3-5 viet. Snaž sa 😉 Potom požiadaj o feedback. Opravím tvoj text, naservírujem ti o stupeň lepšiu verziu, nech vidíš, aké máš možnosti do budúcna. Pochválim to pozitívne a zároveň si posvietim na tvoju achilovku. Všetko si to následne môžeš jedným klikom skopírovať a uložiť do vlastných materiálov. Let's go!
        </p>
      </header>

      {/* Question Section */}
      <section className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col items-center space-y-6">
        <div className="min-h-[4rem] flex items-center justify-center text-center">
          {isLoadingQuestion ? (
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-[#5bc0ec] rounded-full"></div>
              <div className="h-2 w-2 bg-[#5bc0ec] rounded-full"></div>
              <div className="h-2 w-2 bg-[#5bc0ec] rounded-full"></div>
            </div>
          ) : (
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
              {question || "Klikni na tlačidlo nižšie pre otázku..."}
            </h2>
          )}
        </div>
        
        <button
          onClick={handleGenerateQuestion}
          disabled={isLoadingQuestion}
          className="bg-[#5bc0ec] hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 disabled:opacity-50 shadow-md"
        >
          {isLoadingQuestion ? 'Chvíľku strpenia...' : 'Naservíruj mi ďalšiu otázku'}
        </button>
      </section>

      {/* Input Section */}
      <section className="w-full space-y-4">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Sem píš a počkaj na zázrak..."
            className="w-full min-h-[250px] p-6 bg-[#204453] text-white rounded-2xl border-2 border-transparent focus:border-[#5bc0ec] outline-none resize-none text-lg leading-relaxed shadow-inner placeholder-gray-400"
          />
          <div className="absolute bottom-4 right-4 text-gray-300 text-sm font-medium">
            {userInput.length} znakov
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBoost}
            disabled={isBoosting || !userInput.trim()}
            className="bg-[#5bc0ec] hover:opacity-90 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
          >
            {isBoosting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Pripravujem...</span>
              </>
            ) : (
              'Objednať feedback'
            )}
          </button>
        </div>
      </section>

      {/* Feedback Section */}
      {feedback && (
        <section className="w-full bg-blue-50 rounded-2xl p-8 border border-blue-200 shadow-sm animate-fade-in mb-12 flex flex-col">
          <h3 className="text-[#204453] font-bold mb-6 flex items-center text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            ÚČET Z BISTRA TAKE AWAY ENGLISH 🥡
          </h3>
          <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap text-lg font-serif">
            {renderFeedback(feedback)}
          </div>
          
          <div className="mt-10 pt-6 border-t border-blue-200 flex justify-center">
            <button
              onClick={handleCopy}
              className="bg-[#5bc0ec] hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-md flex items-center space-x-2"
            >
              {isCopied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Skopírované!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Kopírovať text</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Footer Spacer */}
      <footer className="h-16"></footer>
    </div>
  );
};

// Helper to handle bold (**HEADLINE**) and italic (*correction*) formatting
const renderFeedback = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return (
        <span key={i} className="block mt-6 mb-2 text-[#204453] font-bold tracking-wide uppercase">
          {content}
        </span>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      const content = part.slice(1, -1);
      return (
        <em key={i} className="text-blue-700 font-bold not-italic underline decoration-blue-200 decoration-2 underline-offset-4">
          {content}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default App;
