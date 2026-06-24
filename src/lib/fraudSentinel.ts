interface LocationData {
  [key: string]: any;
}

interface FraudAnalysisResult {
  isFraudulent: boolean;
  reason: string;
}

export async function analyzeCheckInFraud(imageUrl: string, locationData: LocationData): Promise<FraudAnalysisResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENROUTER_API_KEY is not defined');
  }

  const systemPrompt = `You are an AI fraud detection system. Analyze the provided check-in image URL and location data. Determine if the check-in is fraudulent. Return your response as a JSON object with two fields: "isFraudulent" (boolean) and "reason" (string).`;

  const payload = {
    model: 'minimax/minimax-01',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: JSON.stringify({
          imageUrl,
          locationData
        })
      }
    ]
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content;

    if (!resultText) {
      throw new Error('No content returned from OpenRouter');
    }

    const result = JSON.parse(resultText) as FraudAnalysisResult;
    return {
      isFraudulent: Boolean(result.isFraudulent),
      reason: result.reason || 'No reason provided'
    };
  } catch (error) {
    console.error('Error analyzing check-in fraud:', error);
    throw error;
  }
}
