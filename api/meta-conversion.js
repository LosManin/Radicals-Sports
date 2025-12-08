export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.META_CONVERSIONS_API_TOKEN; // el que metimos en Vercel
  const pixelId = 'AQUÍ_VA_TU_PIXEL_ID'; // pon aquí tu Pixel ID real (el que termina en 764)

  if (!accessToken || !pixelId) {
    return res.status(500).json({ error: 'Missing config' });
  }

  const { event_name } = req.body || {};

  const body = {
    data: [
      {
        event_name: event_name || 'Subscribe',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: 'https://radicalsportspro.com/',
        user_data: {
          client_ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
          client_user_agent: req.headers['user-agent'] || ''
        }
      }
    ]
  };

  try {
    const response = await fetch(
      https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken},
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Meta CAPI error', data);
      return res.status(500).json({ error: 'Meta API error', details: data });
    }

    return res.status(200).json({ success: true, meta: data });
  } catch (err) {
    console.error('Server error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
