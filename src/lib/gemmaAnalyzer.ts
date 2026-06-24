/**
 * OpenRouter Google Gemma 2 Integration Wrapper
 * Models: google/gemma-2-9b-it (preferred for ultra-low-latency) / google/gemma-2-27b-it
 */

export interface CandidateProfile {
  name: string;
  skills: string[];
  experience: string;
  rating?: number;
  pastShiftsCount?: number;
  reliabilityScore?: number;
  notes?: string;
}

export interface CandidateSummaryResult {
  summary: string;
  keyStrengths: string[];
  recommendedRoles: string[];
  mockFallback?: boolean;
}

export interface FeedbackSentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // 0.0 to 1.0 (confidence or positivity score)
  keyThemes: string[];
  flaggedForReview: boolean;
  mockFallback?: boolean;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemma-2-9b-it';

/**
 * Helper to get the OpenRouter API key from environment variables (supports Vite, Next.js, Node/process.env)
 */
function getApiKey(): string | undefined {
  const proc = (globalThis as any).process;
  if (typeof proc !== 'undefined' && proc.env && proc.env.OPENROUTER_API_KEY) {
    return proc.env.OPENROUTER_API_KEY;
  }
  if (typeof (import.meta as any) !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_OPENROUTER_API_KEY) {
    return (import.meta as any).env.VITE_OPENROUTER_API_KEY;
  }
  return undefined;
}

/**
 * Calls OpenRouter with Gemma 2, expecting a JSON response or parsing the text output into structured data.
 */
async function callGemma2(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured.');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://evento.app', // Required by OpenRouter rankings
      'X-Title': 'Evento Staffing Management',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2, // low temperature for consistent structured output
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from OpenRouter Gemma 2 model.');
  }

  return content;
}

/**
 * Summarizes a candidate's profile for quick evaluation by event coordinators.
 */
export async function summarizeCandidateProfile(profile: CandidateProfile): Promise<CandidateSummaryResult> {
  const systemPrompt = `You are an expert event staffing AI assistant using Google Gemma 2. Your job is to analyze candidate profiles for event roles (e.g., brand ambassador, bartender, security, event crew) and provide an ultra-low-latency, structured summary in valid JSON format.
Expected JSON structure:
{
  "summary": "Concise 2-3 sentence professional summary highlighting suitability for events.",
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "recommendedRoles": ["role1", "role2"]
}`;

  const prompt = `Please summarize the following candidate profile:
${JSON.stringify(profile, null, 2)}`;

  try {
    const jsonString = await callGemma2(prompt, systemPrompt);
    const parsed = JSON.parse(jsonString);
    return {
      summary: parsed.summary || 'Solid candidate with relevant experience in event hospitality.',
      keyStrengths: Array.isArray(parsed.keyStrengths) ? parsed.keyStrengths : profile.skills.slice(0, 3),
      recommendedRoles: Array.isArray(parsed.recommendedRoles) ? parsed.recommendedRoles : ['Event Staff'],
      mockFallback: false,
    };
  } catch (error) {
    console.warn('Gemma 2 API call failed for candidate summary, using robust mock fallback:', error);
    // Robust Mock Fallback Handler
    return getMockCandidateSummary(profile);
  }
}

/**
 * Analyzes shift feedback from event managers or workers to determine sentiment, score, and key themes.
 */
export async function analyzeShiftFeedback(feedbackText: string): Promise<FeedbackSentimentResult> {
  const systemPrompt = `You are an expert event operations AI assistant using Google Gemma 2. Analyze the following shift feedback from an event worker or manager. Output valid JSON only.
Expected JSON structure:
{
  "sentiment": "positive" | "neutral" | "negative",
  "score": number between 0.0 (extremely negative) and 1.0 (extremely positive),
  "keyThemes": ["theme1", "theme2"],
  "flaggedForReview": boolean (true if there are safety concerns, severe complaints, or no-shows)
}`;

  const prompt = `Analyze the sentiment and themes of this shift feedback:
"${feedbackText}"`;

  try {
    const jsonString = await callGemma2(prompt, systemPrompt);
    const parsed = JSON.parse(jsonString);
    return {
      sentiment: ['positive', 'neutral', 'negative'].includes(parsed.sentiment) ? parsed.sentiment : 'neutral',
      score: typeof parsed.score === 'number' ? parsed.score : 0.5,
      keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes : ['General Operations'],
      flaggedForReview: !!parsed.flaggedForReview,
      mockFallback: false,
    };
  } catch (error) {
    console.warn('Gemma 2 API call failed for feedback sentiment analysis, using robust mock fallback:', error);
    // Robust Mock Fallback Handler
    return getMockFeedbackSentiment(feedbackText);
  }
}

/**
 * Fallback Mock Handler for Candidate Summarization
 */
function getMockCandidateSummary(profile: CandidateProfile): CandidateSummaryResult {
  const strengths = profile.skills && profile.skills.length > 0 ? profile.skills.slice(0, 3) : ['Reliability', 'Communication', 'Adaptability'];
  const scoreStr = profile.reliabilityScore !== undefined ? ` with a ${profile.reliabilityScore}% reliability rating` : '';
  
  return {
    summary: `${profile.name} is an experienced event professional${scoreStr}. Demonstrates strong capabilities in ${strengths.join(', ')} across past event shifts.`,
    keyStrengths: strengths,
    recommendedRoles: ['Event Host / Staff', 'Brand Ambassador', 'Registration Coordinator'],
    mockFallback: true,
  };
}

/**
 * Fallback Mock Handler for Shift Feedback Sentiment Analysis
 */
function getMockFeedbackSentiment(feedbackText: string): FeedbackSentimentResult {
  const lowerText = feedbackText.toLowerCase();
  
  // Simple heuristic matching for mock fallback
  const negativeWords = ['late', 'rude', 'terrible', 'bad', 'slow', 'unprofessional', 'no-show', 'unsafe', 'problem', 'awful', 'chaos', 'mess'];
  const positiveWords = ['great', 'excellent', 'amazing', 'perfect', 'ontime', 'on-time', 'fantastic', 'helpful', 'smooth', 'awesome', 'good', 'professional'];

  let negCount = 0;
  let posCount = 0;

  negativeWords.forEach(word => { if (lowerText.includes(word)) negCount++; });
  positiveWords.forEach(word => { if (lowerText.includes(word)) posCount++; });

  if (negCount > posCount) {
    return {
      sentiment: 'negative',
      score: 0.2,
      keyThemes: ['Operational Friction', 'Performance Concerns'],
      flaggedForReview: negCount >= 2 || lowerText.includes('unsafe') || lowerText.includes('no-show'),
      mockFallback: true,
    };
  } else if (posCount > negCount) {
    return {
      sentiment: 'positive',
      score: 0.88,
      keyThemes: ['Strong Performance', 'Smooth Execution'],
      flaggedForReview: false,
      mockFallback: true,
    };
  } else {
    return {
      sentiment: 'neutral',
      score: 0.5,
      keyThemes: ['Routine Operations'],
      flaggedForReview: false,
      mockFallback: true,
    };
  }
}
