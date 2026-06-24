const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Matches a candidate's skills to an event description and returns a match score (0-100).
 * 
 * ### Cloudflare Pages Active Integration Documentation
 * To enable AI-powered matching in Cloudflare Pages:
 * 1. Navigate to your Cloudflare Pages dashboard -> Settings -> Environment variables.
 * 2. Add `VITE_OPENROUTER_API_KEY` to both Production and Preview environments.
 * 3. Ensure the key has the `VITE_` prefix so Vite makes it accessible to the client/worker bundle.
 * 4. Re-deploy the application for changes to take effect.
 * 
 * @param candidateSkills An array of the candidate's skills
 * @param eventDescription A description of the event's requirements
 * @returns A number between 0 and 100 representing the match score
 */
export async function matchCandidateToEvent(
  candidateSkills: string[],
  eventDescription: string
): Promise<number> {
  // Use Vite's environment variable syntax with a robust fallback string
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

  if (!apiKey || apiKey.trim() === "") {
    console.warn(
      "VITE_OPENROUTER_API_KEY is not set or empty. " +
      "Please configure VITE_OPENROUTER_API_KEY in your Cloudflare Pages Settings -> Environment variables. " +
      "Falling back to default match score of 0."
    );
    return 0;
  }

  const systemPrompt = `You are an AI assistant that evaluates how well a candidate's skills match an event's requirements.
You must return ONLY a single integer value between 0 and 100 representing the match score.
0 means no match at all, and 100 means a perfect match. Do not include any other text, explanation, or punctuation.`;

  const userPrompt = `Candidate Skills: ${candidateSkills.join(", ")}
Event Description: ${eventDescription}

Match Score (0-100):`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-7b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content?.trim() || "0";
    
    // Parse the returned score
    const score = parseInt(replyContent, 10);
    
    if (isNaN(score)) {
      console.error("AI returned a non-numeric score:", replyContent);
      return 0;
    }

    // Clamp the score between 0 and 100
    return Math.max(0, Math.min(100, score));

  } catch (error) {
    console.error("Error matching candidate to event:", error);
    return 0;
  }
}
