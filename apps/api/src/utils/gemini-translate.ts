import { GoogleGenAI } from '@google/genai';
import prisma from '../config/prisma';

const MODEL = 'gemini-2.0-flash-lite';

type KeyGroup = 'SERVICE' | 'JOB' | 'NEWS';

const CONFIG_KEY_MAP: Record<KeyGroup, string> = {
  SERVICE: 'GEMINI_API_KEY_SERVICE',
  JOB: 'GEMINI_API_KEY_JOB',
  NEWS: 'GEMINI_API_KEY_NEWS',
};

const keyCache: Record<KeyGroup, string | null> = {
  SERVICE: null,
  JOB: null,
  NEWS: null,
};

async function getKey(group: KeyGroup): Promise<string> {
  if (keyCache[group]) return keyCache[group]!;
  const conf = await prisma.systemConfig.findUnique({ where: { key: CONFIG_KEY_MAP[group] } });
  const value = conf?.value?.trim();
  if (!value) throw new Error(`Missing API key in system_config for ${CONFIG_KEY_MAP[group]}`);
  keyCache[group] = value;
  return value;
}

async function gemini(group: KeyGroup) {
  return new GoogleGenAI({ apiKey: await getKey(group) });
}

/* ---------- helpers ------------------------------------------------------ */

async function askGemini(group: KeyGroup, prompt: string) {
  try {
    const g = await gemini(group);
    const res = await g.models.generateContent({
      model: MODEL,
      config: { responseMimeType: 'text/plain' },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return res?.text?.trim() || '';
  } catch (error) {
    console.error(`Translation error for group ${group}:`, error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Test if a specific API key group is working
 */
export async function testKeyGroup(keyName: string): Promise<boolean> {
  try {
    // Map key name to group
    let group: KeyGroup;
    if (keyName === 'GEMINI_API_KEY_SERVICE') group = 'SERVICE';
    else if (keyName === 'GEMINI_API_KEY_JOB') group = 'JOB';
    else if (keyName === 'GEMINI_API_KEY_NEWS') group = 'NEWS';
    else throw new Error(`Unknown key name: ${keyName}`);

    // Clear cache to force re-fetch
    keyCache[group] = null;
    
    // Try a simple translation
    const result = await askGemini(group, 'Hello');
    return Boolean(result && result.length > 0);
    
  } catch (error) {
    console.error(`Test failed for key ${keyName}:`, error);
    return false;
  }
}

/**
 * Test a specific API key value (not from database)
 */
export async function testApiKeyValue(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    const response = await genAI.models.generateContent({
      model: MODEL,
      config: { 
        responseMimeType: 'text/plain',
        maxOutputTokens: 10  // Minimal response to save quota
      },
      contents: [{ 
        role: 'user', 
        parts: [{ text: 'Hi' }] 
      }],
    });

    return Boolean(response?.text && response.text.trim().length > 0);

  } catch (error: any) {
    console.error("Error testing API key:", error);
    
    // Handle specific GoogleGenAI errors
    if (error.message?.includes('API_KEY_INVALID')) return false;
    if (error.message?.includes('PERMISSION_DENIED')) return false;
    if (error.message?.includes('QUOTA_EXCEEDED')) return true; // Valid but quota exceeded
    
    return false;
  }
}

const vi = 'tiếng Việt';
const langMap: Record<'en' | 'zh', string> = { en: 'tiếng Anh', zh: 'tiếng Trung' };

// Translate a single piece of text using specified key group.
async function translatePart(group: KeyGroup, text: string, targetLang: 'en' | 'zh'): Promise<string> {
  if (!text) return '';
  const prompt = `Dịch đoạn sau từ ${vi} sang ${langMap[targetLang]} (giữ nguyên định dạng, thuật ngữ chuyên ngành nếu có):\n${text}`;
  return askGemini(group, prompt);
}

/* ---------- SERVICE ------------------------------------------------------ */
export async function translateService({ title, content, features, targetLang }:{
  title: string; content: string; features?: Record<string, any>; targetLang: 'en'|'zh';
}) {
  const tasks: Promise<string>[] = [
    translatePart('SERVICE', title, targetLang),
    translatePart('SERVICE', content, targetLang),
  ];
  if (features) {
    tasks.push(translatePart('SERVICE', JSON.stringify(features), targetLang));
  }
  const [titleTr, contentTr, featuresTr] = await Promise.all(tasks);
  return {
    title: titleTr,
    content: contentTr,
    features: featuresTr ? JSON.parse(featuresTr) : undefined,
  };
}

/* ---------- JOB ---------------------------------------------------------- */
export async function translateJob({ title, position, location, benefits,
  description, requirements, targetLang }:{
    title: string; position?: string; location?: string;
    benefits?: string; description?: string; requirements?: string;
    targetLang: 'en'|'zh';
}) {
  const fieldMap: Record<string, string | undefined> = {
    title,
    position,
    location,
    benefits,
    description,
    requirements,
  };

  const keys = Object.keys(fieldMap) as (keyof typeof fieldMap)[];
  const translations = await Promise.all(
    keys.map(k => fieldMap[k] ? translatePart('JOB', fieldMap[k] as string, targetLang) : Promise.resolve('')),
  );

  const result: any = {};
  translations.forEach((t, idx) => { if (t) result[keys[idx]] = t; });
  return result as {
    title: string; position?: string; location?: string;
    benefits?: string; description?: string; requirements?: string;
  };
}

// New function for single text translation
export async function translateSingleText(text: string, targetLang: 'en' | 'zh', group: KeyGroup = 'JOB'): Promise<string> {
  if (!text) return '';
  try {
    return await translatePart(group, text, targetLang);
  } catch (error) {
    console.error(`Failed to translate single text:`, error);
    throw error;
  }
}

/* ---------- NEWS --------------------------------------------------------- */
export async function translateNews({ title, content, targetLang }:{
  title: string; content: string; targetLang: 'en'|'zh';
}) {
  const [titleTr, contentTr] = await Promise.all([
    translatePart('NEWS', title, targetLang),
    translatePart('NEWS', content, targetLang),
  ]);
  return { title: titleTr, content: contentTr };
}
