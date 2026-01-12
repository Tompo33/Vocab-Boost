
const SHEET_ID = '1x-U8P5AlwJF6aKYK4exBhtLvLe0pfkZdl1IROSPEUlY';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Fallback questions in case of CORS or connectivity issues
const FALLBACK_QUESTIONS = [
  "What is your favorite memory from childhood?",
  "How do you usually spend your weekends?",
  "If you could travel anywhere in the world, where would you go?",
  "What are your long-term career goals?",
  "Describe a book or movie that changed your perspective.",
  "What is the most challenging thing you have ever done?",
  "How do you stay motivated when facing difficulties?",
  "What does a perfect day look like to you?"
];

export async function fetchRandomQuestion(): Promise<string> {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet');
    
    const text = await response.text();
    // Simple CSV parser: split by lines, filter empty, skip header if needed
    // Usually, the questions are in the first or second column.
    const rows = text.split('\n').map(row => row.split(',')).filter(row => row.length > 0 && row[0].trim() !== "");
    
    // Skip header if it exists (e.g., if first row contains "Question")
    const questions = rows.length > 1 ? rows.slice(1).map(r => r[0].replace(/"/g, '').trim()) : rows.map(r => r[0].replace(/"/g, '').trim());
    
    if (questions.length === 0) return FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
    
    return questions[Math.floor(Math.random() * questions.length)];
  } catch (error) {
    console.error("Sheet Fetch Error:", error);
    return FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
  }
}
