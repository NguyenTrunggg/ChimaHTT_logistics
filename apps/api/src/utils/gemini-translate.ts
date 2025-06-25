// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleTranslateFn: any = require('@vitalets/google-translate-api');

/**
 * Supported provider keywords that can be set via env variables.
 */
export type TranslateProvider =
  | 'google'        // Web-scrape Google (free – quota nhỏ)
  | 'libre';        // LibreTranslate public/self-host

/**
 * Map our shorthand language codes to provider-specific codes.
 */
const LANGUAGE_MAP: Record<'en' | 'zh', string> = { en: 'en', zh: 'zh-CN' };

/**
 * Node 18+ has fetch globally; for older versions users should polyfill.
 * Helper to translate via LibreTranslate HTTP API (free/public or self-hosted).
 */
async function translateViaLibre(text: string, to: string) {
  const response = await (globalThis as any).fetch(
    (process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.de') + '/translate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'vi', target: to, format: 'text' }),
    },
  );
  const data: any = await response.json();
  if (!response.ok || !data?.translatedText) {
    throw new Error(`LibreTranslate error: ${data?.error || response.statusText}`);
  }
  return data.translatedText as string;
}

/**
 * Core helper – translate plain text with selected provider.
 */
async function translateText(
  text: string,
  targetLang: 'en' | 'zh',
  provider: TranslateProvider,
): Promise<string> {
  const to = LANGUAGE_MAP[targetLang];
  try {
    if (provider === 'libre') {
      return await translateViaLibre(text, to);
    }
    // default google
    const res = await googleTranslateFn(text, { from: 'vi', to });
    return res.text;
  } catch (err: any) {
    console.error('translateText error', { provider, err });
    throw new Error(`Translation failed (${provider}): ${err?.message || err}`);
  }
}

/* -------------------------------------------------------------------------- */
/*  SERVICE – high volume giai đoạn đầu                                         */
/*  Sử dụng provider cấu hình qua env, mặc định google                         */
/* -------------------------------------------------------------------------- */
const SERVICE_PROVIDER: TranslateProvider = (process.env
  .SERVICE_TRANSLATOR_PROVIDER as TranslateProvider) || 'google';

export async function translateService({
  title,
  content,
  features,
  targetLang,
}: {
  title: string;
  content: string;
  features?: Record<string, any>;
  targetLang: 'en' | 'zh';
}) {
  const translatePromises = [
    translateText(title, targetLang, SERVICE_PROVIDER),
    translateText(content, targetLang, SERVICE_PROVIDER),
  ];

  if (features) {
    translatePromises.push(
      translateText(JSON.stringify(features), targetLang, SERVICE_PROVIDER),
    );
  }

  const [titleTranslated, contentTranslated, featuresTranslated] =
    await Promise.all(translatePromises);

  return {
    title: titleTranslated,
    content: contentTranslated,
    features: featuresTranslated ? JSON.parse(featuresTranslated) : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*  JOB – số lượng thấp ➜ provider vừa phải (google mặc định)                  */
/* -------------------------------------------------------------------------- */
const JOB_PROVIDER: TranslateProvider = (process.env
  .JOB_TRANSLATOR_PROVIDER as TranslateProvider) || 'google';

export async function translateJob({
  title,
  position,
  location,
  benefits,
  description,
  requirements,
  targetLang,
}: {
  title: string;
  position: string;
  location: string;
  benefits?: string;
  description?: string;
  requirements?: string;
  targetLang: 'en' | 'zh';
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
    keys.map((k) =>
      fieldMap[k]
        ? translateText(fieldMap[k] as string, targetLang, JOB_PROVIDER)
        : Promise.resolve(''),
    ),
  );

  const result: Record<string, string> = {};
  translations.forEach((t, idx) => {
    if (t) result[keys[idx]] = t;
  });
  return result;
}

/* -------------------------------------------------------------------------- */
/*  NEWS – tạo liên tục ➜ provider free/lâu dài (google mặc định)               */
/* -------------------------------------------------------------------------- */
const NEWS_PROVIDER: TranslateProvider = (process.env
  .NEWS_TRANSLATOR_PROVIDER as TranslateProvider) || 'google';

export async function translateNews({
  title,
  content,
  targetLang,
}: {
  title: string;
  content: string;
  targetLang: 'en' | 'zh';
}) {
  const [titleTr, contentTr] = await Promise.all([
    translateText(title, targetLang, NEWS_PROVIDER),
    translateText(content, targetLang, NEWS_PROVIDER),
  ]);

  return { title: titleTr, content: contentTr };
}
