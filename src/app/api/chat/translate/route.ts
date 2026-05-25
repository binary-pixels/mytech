import { NextResponse } from 'next/server';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

const LANG_MAP: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
};

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }

    if (targetLang !== 'zh' && targetLang !== 'en') {
      return NextResponse.json({ error: 'targetLang must be "zh" or "en"' }, { status: 400 });
    }

    const sourceLang = targetLang === 'zh' ? 'en' : 'zh';

    const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${LANG_MAP[sourceLang]}|${LANG_MAP[targetLang]}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Translation service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const translated = data?.responseData?.translatedText?.trim() || '';

    return NextResponse.json({ translated, sourceLang });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
