
const SHEET_ID = '1x-U8P5AlwJF6aKYK4exBhtLvLe0pfkZdl1IROSPEUlY';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Comprehensive fallback questions for English practice
const FALLBACK_QUESTIONS = [
  "If you could have dinner with any historical figure, who would it be and why?",
  "Tell me about a typical morning in your life from the moment you wake up.",
  "What is the most beautiful place you have ever visited, and what made it special?",
  "If you won a million dollars tomorrow, what is the first thing you would do?",
  "How has technology changed the way people connect with each other in your opinion?",
  "Describe your favorite hobby and explain why it brings you joy.",
  "What are three qualities you look for in a good friend?",
  "If you could live in any era of history, which one would you choose?",
  "What is a book or movie that significantly changed your way of thinking?",
  "Tell me about a skill you've always wanted to learn but haven't had the chance yet.",
  "How do you usually handle a very stressful day at work or school?",
  "What does 'success' mean to you personally?",
  "Describe a person who has had a major influence on your life.",
  "If you could travel to the future or the past, which would you pick?"
];

export async function fetchRandomQuestion(): Promise<string> {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet');
    
    const text = await response.text();
    // Simple CSV parser
    const rows = text.split('\n')
      .map(row => row.split(','))
      .filter(row => row.length > 0 && row[0].trim() !== "");
    
    const questions = rows.length > 1 
      ? rows.slice(1).map(r => r[0].replace(/"/g, '').trim()) 
      : rows.map(r => r[0].replace(/"/g, '').trim());
    
    if (questions.length === 0) return FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    
    return questions[Math.floor(Math.random() * questions.length)];
  } catch (error) {
    console.error("Sheet Fetch Error:", error);
    return FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
  }
}
