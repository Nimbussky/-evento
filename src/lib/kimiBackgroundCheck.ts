const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const KIMI_MODEL = "moonshotai/moonshot-v1-32k";

export interface ResumeParseResult {
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  experienceYears: number;
  education: string;
  summary: string;
  parsedSuccessfully: boolean;
  errorReason?: string;
}

export interface CandidateBackgroundData {
  fullName: string;
  resumeSummary: string;
  claimedSkills: string[];
  claimedExperienceYears: number;
  additionalBackgroundInfo?: string;
}

export interface BackgroundVerificationResult {
  isVerified: boolean;
  confidenceScore: number; // 0 - 100
  flaggedIssues: string[];
  verificationSummary: string;
  verifiedSuccessfully: boolean;
  errorReason?: string;
}

/**
 * Parses a candidate's raw resume text using Moonshot Kimi AI via OpenRouter.
 * 
 * ### Cloudflare Pages Active Integration Documentation
 * To enable AI-powered resume parsing in Cloudflare Pages:
 * 1. Navigate to your Cloudflare Pages dashboard -> Settings -> Environment variables.
 * 2. Add `VITE_OPENROUTER_API_KEY` to both Production and Preview environments.
 * 3. Ensure the key has the `VITE_` prefix so Vite makes it accessible to the client/worker bundle.
 * 4. Re-deploy the application for changes to take effect.
 * 
 * @param resumeText The raw text content of the candidate's resume
 * @returns A structured representation of the parsed resume data
 */
export async function parseResumeWithKimi(resumeText: string): Promise<ResumeParseResult> {
  // Use Vite environment variable with a robust fallback string
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

  if (!apiKey || apiKey.trim() === "") {
    console.warn(
      "VITE_OPENROUTER_API_KEY is not set or empty in Cloudflare Pages environment variables. " +
      "Bypassing Moonshot Kimi AI resume parsing and returning fallback result."
    );
    return {
      fullName: "Unknown Candidate",
      email: "not-provided@example.com",
      phone: "N/A",
      skills: ["Fallback Skill"],
      experienceYears: 0,
      education: "N/A",
      summary: "VITE_OPENROUTER_API_KEY is missing in Cloudflare Pages configuration. Defaulting to fallback resume parsing.",
      parsedSuccessfully: false,
      errorReason: "VITE_OPENROUTER_API_KEY is missing."
    };
  }

  const systemPrompt = `You are an expert AI recruiter and resume parser. Analyze the provided resume text and extract the candidate's key information.
You must return your response strictly as a JSON object with the following fields:
- "fullName" (string)
- "email" (string)
- "phone" (string)
- "skills" (array of strings)
- "experienceYears" (number, estimate total years of professional experience)
- "education" (string, highest degree/institution)
- "summary" (string, brief professional summary)

Ensure the output is valid, clean JSON with no additional text or formatting outside the JSON object.`;

  const payload = {
    model: KIMI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Resume Text:\n\n${resumeText}` }
    ]
  };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim();

    if (!resultText) {
      throw new Error("No content returned from OpenRouter Kimi AI");
    }

    const parsed = JSON.parse(resultText);

    return {
      fullName: parsed.fullName || "Unknown Candidate",
      email: parsed.email || "not-provided@example.com",
      phone: parsed.phone || "N/A",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experienceYears: typeof parsed.experienceYears === "number" ? parsed.experienceYears : parseInt(parsed.experienceYears, 10) || 0,
      education: parsed.education || "N/A",
      summary: parsed.summary || "No summary provided.",
      parsedSuccessfully: true
    };
  } catch (error) {
    console.error("Error parsing resume with Moonshot Kimi AI:", error);
    return {
      fullName: "Error Parsing Candidate",
      email: "error@example.com",
      phone: "N/A",
      skills: [],
      experienceYears: 0,
      education: "N/A",
      summary: "An error occurred during AI resume parsing.",
      parsedSuccessfully: false,
      errorReason: error instanceof Error ? error.message : "Unknown error during parsing"
    };
  }
}

/**
 * Conducts a deep candidate background verification using Moonshot Kimi AI via OpenRouter.
 * 
 * ### Cloudflare Pages Active Integration Documentation
 * To enable AI-powered background verification in Cloudflare Pages:
 * 1. Navigate to your Cloudflare Pages dashboard -> Settings -> Environment variables.
 * 2. Add `VITE_OPENROUTER_API_KEY` to both Production and Preview environments.
 * 3. Ensure the key has the `VITE_` prefix so Vite makes it accessible to the client/worker bundle.
 * 4. Re-deploy the application for changes to take effect.
 * 
 * @param candidateData Structured data representing the candidate's claims and background info
 * @returns A structured verification result assessing the authenticity and consistency of the candidate
 */
export async function verifyCandidateBackgroundWithKimi(
  candidateData: CandidateBackgroundData
): Promise<BackgroundVerificationResult> {
  // Use Vite environment variable with a robust fallback string
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

  if (!apiKey || apiKey.trim() === "") {
    console.warn(
      "VITE_OPENROUTER_API_KEY is not set or empty in Cloudflare Pages environment variables. " +
      "Bypassing Moonshot Kimi AI background verification and returning fallback result."
    );
    return {
      isVerified: true, // Graceful fallback
      confidenceScore: 70,
      flaggedIssues: ["VITE_OPENROUTER_API_KEY is missing. Bypassing deep AI verification."],
      verificationSummary: "VITE_OPENROUTER_API_KEY is missing in Cloudflare Pages configuration. Defaulting to fallback verified status.",
      verifiedSuccessfully: false,
      errorReason: "VITE_OPENROUTER_API_KEY is missing."
    };
  }

  const systemPrompt = `You are an expert AI background verification investigator and risk analyst. 
Examine the candidate's provided information, resume summary, claimed skills, claimed experience years, and any additional background information.
Assess the consistency, realism, and authenticity of the claims. Check for potential exaggerations or inconsistencies in the timeline and skill sets.

You must return your response strictly as a JSON object with the following fields:
- "isVerified" (boolean, true if the candidate's background seems plausible and consistent, false if severe red flags are found)
- "confidenceScore" (number between 0 and 100, indicating the level of confidence in the candidate's authenticity)
- "flaggedIssues" (array of strings, listing any inconsistencies, gaps, or potential exaggerations found)
- "verificationSummary" (string, a comprehensive summary of the verification analysis)

Ensure the output is valid, clean JSON with no additional text or formatting outside the JSON object.`;

  const payload = {
    model: KIMI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Candidate Background Data:\n\n${JSON.stringify(candidateData, null, 2)}` }
    ]
  };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim();

    if (!resultText) {
      throw new Error("No content returned from OpenRouter Kimi AI");
    }

    const parsed = JSON.parse(resultText);

    return {
      isVerified: Boolean(parsed.isVerified),
      confidenceScore: typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : parseInt(parsed.confidenceScore, 10) || 0,
      flaggedIssues: Array.isArray(parsed.flaggedIssues) ? parsed.flaggedIssues : [],
      verificationSummary: parsed.verificationSummary || "Verification check completed.",
      verifiedSuccessfully: true
    };
  } catch (error) {
    console.error("Error verifying candidate background with Moonshot Kimi AI:", error);
    return {
      isVerified: false,
      confidenceScore: 0,
      flaggedIssues: ["Error occurred during AI verification process."],
      verificationSummary: "An error occurred while contacting Moonshot Kimi AI for background verification.",
      verifiedSuccessfully: false,
      errorReason: error instanceof Error ? error.message : "Unknown error during verification"
    };
  }
}
