
import { GoogleGenAI } from "@google/genai";

export async function getFeedback(userText: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  
  const systemInstruction = `
ÄokoÄ¾vek ti tu napÃ­Å¡e v angliÄtine (text), v prvom rade opravÃ­Å¡. NapÃ­Å¡eÅ¡: "Najprv oprava:" a nÃ¡sledne prepÃ­Å¡eÅ¡ ten text a v *bolde* dÃ¡Å¡, Äo si zmenil. 

Pre seba zhodnoÅ¥ ÃºroveÅ angliÄtiny podÄ¾a CEFR. 

NÃ¡sledne bude sekcia: "Teraz tuning:", kde navrhneÅ¡ vylepÅ¡enÃ½ text - o ÃºroveÅ vyÅ¡Å¡ie podÄ¾a tvojho ohodnotenia pÃ´vodnÃ©ho textu. Ak ho zhodnotÃ­Å¡ na B1, navrhnutÃ½ upgrade bude B2. Ak a2, tak na b1. Ak c1, tak na c2. Nie priveÄ¾a zmien, sÃºstreÄ sa prevaÅ¾ne na nÃ¡vrh hovorovÃ½ch, prirodzenÃ½ch frÃ¡z a linkerov. 

NÃ¡sledne sekcia: "PÃ¡r synonÃ½m:", kde pod text doplÅ 3 synonymÃ¡ (o ÃºroveÅ vyÅ¡Å¡ie oproti pÃ´vodnej CEFR Ãºrovni) pre kÄ¾ÃºÄovÃ© slovÃ¡ z pÃ´vodnÃ©ho textu, napr: lovely - delightful. 

A na konci napÃ­Å¡: "Tvoja achilovka:" a vypichni jednu konkrÃ©tnu chybu z pÃ´vodnÃ©ho textu a vysvetli, preÄo je to chyba a ÄÃ­m ju nahradiÅ¥. 

Nenavrhuj ÄalÅ¡iu otÃ¡zku po tÃ½chto feedbackoch, niÄ sa nepÃ½taj. 

Na Ãºplnom konci po sekcii Achilovka dopÃ­Å¡ presne tÃºto vetu: "Nezabudni si tento feeback screenshotnÃºÅ¥, lebo zmizne. ;)"
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

    return response.text || "Nepodarilo sa vygenerovaÅ¥ feedback. SkÃºs to znova.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ups, nieÄo sa pokazilo pri komunikÃ¡cii s AI. Skontroluj svoje pripojenie.";
  }
}
