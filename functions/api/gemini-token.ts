interface Env {
  GEMINI_API_KEY?: string;
  gemini_api_key?: string;
}

const MODEL = 'gemini-3.8-live';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

interface GoogleFailure {
  error?: { status?: string; message?: string; details?: { reason?: string }[] };
}

function classifyFailure(status: number, failure: GoogleFailure) {
  const reasons = failure.error?.details?.map(detail => detail.reason ?? '') ?? [];
  const message = failure.error?.message ?? '';
  if (reasons.includes('API_KEY_INVALID') || /API key not valid|API key expired/i.test(message)) {
    return { code: 'GEMINI_KEY_INVALID', error: 'Google رفض مفتاح Gemini. راجع GEMINI_API_KEY في Cloudflare ثم أعد النشر.' };
  }
  if (status === 401 || status === 403) return { code: 'GEMINI_ACCESS_DENIED', error: 'Google رفض صلاحية طلب Gemini.' };
  if (status === 429) return { code: 'GEMINI_RATE_LIMITED', error: 'وصلنا لحد استخدام Gemini. جرّب لاحقًا.' };
  if (status === 400) return { code: 'GEMINI_TOKEN_REQUEST_INVALID', error: 'Google رفض إعداد جلسة Gemini.' };
  if (status === 404) return { code: 'GEMINI_TOKEN_RESOURCE_UNAVAILABLE', error: 'خدمة جلسات Gemini غير متاحة حاليًا.' };
  return { code: 'GEMINI_TOKEN_UPSTREAM_FAILED', error: `تعذّر إصدار جلسة Gemini (${status}).` };
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Origin not allowed', code: 'ORIGIN_NOT_ALLOWED' }, 403);

  const apiKey = (env.GEMINI_API_KEY ?? env.gemini_api_key)?.trim();
  if (!apiKey) return json({
    error: 'مفتاح Gemini غير مضبوط في بيئة النشر. أضف GEMINI_API_KEY (أو gemini_api_key مؤقتًا) في Production وPreview.',
    code: 'GEMINI_KEY_MISSING',
  }, 503);

  const expiresAt = new Date(Date.now() + 30 * 60_000).toISOString();
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        uses: 1,
        expireTime: expiresAt,
        newSessionExpireTime: new Date(Date.now() + 60_000).toISOString(),
        fieldMask: 'model,generationConfig.responseModalities',
        bidiGenerateContentSetup: {
          model: `models/${MODEL}`,
          generationConfig: { responseModalities: ['AUDIO'] },
        },
      }),
    });

    if (!response.ok) {
      const failure = await response.json().catch(() => ({})) as GoogleFailure;
      const diagnostic = classifyFailure(response.status, failure);
      console.warn('Gemini token issuance failed', { code: diagnostic.code, upstreamStatus: response.status });
      return json({ ...diagnostic, upstreamStatus: response.status }, 502);
    }

    const token = await response.json() as { name?: string };
    if (!token.name) return json({ error: 'Google رجّعت جلسة غير صالحة.', code: 'GEMINI_TOKEN_RESPONSE_INVALID' }, 502);
    return json({ token: token.name, model: MODEL, expiresAt });
  } catch {
    return json({ error: 'خادم Gemini لم يستجب. جرّب مرة ثانية.', code: 'GEMINI_TOKEN_CONNECTION_FAILED' }, 502);
  }
};
