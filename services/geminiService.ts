
import { GoogleGenAI } from "@google/genai";

export async function getFeedback(userText: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
Čokoľvek ti tu napíše v angličtine (text), v prvom rade opravíš. Napíšeš: "Najprv oprava:" a následne prepíšeš ten text a v *bolde* dáš, čo si zmenil. 

Pre seba zhodnoť úroveň angličtiny podľa CEFR. 

Následne bude sekcia: "Teraz tuning:", kde navrhneš vylepšený text - o úroveň vyššie podľa tvojho ohodnotenia pôvodného textu. Ak ho zhodnotíš na B1, navrhnutý upgrade bude B2. Ak a2, tak na b1. Ak c1, tak na c2. Nie priveľa zmien, sústreď sa prevažne na návrh hovorových, prirodzených fráz a linkerov. 

Následne sekcia: "Pár synoným:", kde pod text doplň 3 synonymá (o úroveň vyššie oproti pôvodnej CEFR úrovni) pre kľúčové slová z pôvodného textu, napr: lovely - delightful. 

A na konci napíš: "Tvoja achilovka:" a vypichni jednu konkrétnu chybu z pôvodného textu a vysvetli, prečo je to chyba a čím ju nahradiť. 

Nenavrhuj ďalšiu otázku po týchto feedbackoch, nič sa nepýtaj. 

Na úplnom konci po sekcii Achilovka dopíš presne túto vetu: "Nezabudni si tento feeback screenshotnúť, lebo zmizne. ;)"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Nepodarilo sa vygenerovať feedback. Skús to znova.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ups, niečo sa pokazilo pri komunikácii s AI. Skontroluj svoje pripojenie.";
  }
}
