import { AskAIQuestionParams, AIQuestionResponse } from 'api-types';

// AI Question Handler
// ------------------------------

export const askAIQuestion = async ({
  propertyId,
  question,
  sessionId,
}: AskAIQuestionParams): Promise<AIQuestionResponse | null> => {
  try {
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      throw new Error(
        'NEXT_PUBLIC_N8N_WEBHOOK_URL environment variable is not configured'
      );
    }

    const requestBody = {
      propertyId,
      question:
        typeof question === 'string' ? question.trim() : String(question || ''),
      timestamp: new Date().toISOString(),
      sessionId,
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error calling n8n workflow:', error);
    throw error;
  }
};
