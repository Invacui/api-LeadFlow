// Groq/Llama3 stub — enable by installing groq-sdk
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-70b-8192';

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const generateReply = async (messages: GroqMessage[]): Promise<string> => {
  if (!GROQ_API_KEY) {
    return '[AI Reply stub — set GROQ_API_KEY to enable]';
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({ model: GROQ_MODEL, messages }),
    });
    const data = await response.json() as any;
    return data.choices?.[0]?.message?.content || '';
  } catch {
    return '';
  }
};

export const generateTemplate = async (
  productName: string,
  description: string,
  targetAudience: string,
  tone: string,
  cta: string
): Promise<{ emailSubject: string; emailBody: string; whatsApp: string }> => {
  if (!GROQ_API_KEY) {
    return {
      emailSubject: `[Stub] Introducing ${productName}`,
      emailBody: `[Stub] Hi, we'd love to tell you about ${productName}. ${description}`,
      whatsApp: `[Stub] Hi! Check out ${productName}: ${cta}`,
    };
  }
  const prompt = `Generate outreach templates for:
Product: ${productName}
Description: ${description}
Target Audience: ${targetAudience}
Tone: ${tone}
CTA: ${cta}

Return JSON with keys: emailSubject, emailBody, whatsApp`;
  const reply = await generateReply([{ role: 'user', content: prompt }]);
  try {
    const parsed = JSON.parse(reply);
    return { emailSubject: parsed.emailSubject, emailBody: parsed.emailBody, whatsApp: parsed.whatsApp };
  } catch {
    return { emailSubject: `Introducing ${productName}`, emailBody: reply, whatsApp: reply };
  }
};
