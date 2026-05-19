import type { VercelRequest, VercelResponse } from '@vercel/functions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      res.status(500).json({ error: 'Webhook URL not configured' });
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `Webhook returned status ${response.status}` });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to call webhook';
    res.status(500).json({ error: message });
  }
}
