import type { VercelRequest, VercelResponse } from '@vercel/functions';

const serviceUnavailableMessage = 'Analysis service is temporarily unavailable. Please try again later.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('N8N_WEBHOOK_URL is not configured; analysis service is unavailable.');
      res.status(503).json({ error: serviceUnavailableMessage });
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      console.warn(`n8n webhook returned status ${response.status}; analysis service is unavailable.`);
      res.status(503).json({ error: serviceUnavailableMessage });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to call webhook';
    console.warn(`n8n webhook request failed: ${message}`);
    res.status(503).json({ error: serviceUnavailableMessage });
  }
}
