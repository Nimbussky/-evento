const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Matches a candidate's skills to an event description and returns a match score (0-100).
 * 
 * @param candidateSkills An array of the candidate's skills
 * @param eventDescription A description of the event's requirements
 * @returns A number between 0 and 100 representing the match score
 */
export async function matchCandidateToEvent(
  candidateSkills: string[],
  eventDescription: string
): Promise<number> {
  // Use Vite's environment variable syntax
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("VITE_OPENROUTER_API_KEY is not set. Returning a default score of 0.");
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
