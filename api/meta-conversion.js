// api/meta-conversion.js

module.exports = async (req, res) => {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Token de la API (ya guardado en Vercel como variable de entorno)
  const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;

  // ID del conjunto de datos / píxel de Radical Sports
  const DATASET_ID = '103831831511517564';

  if (!ACCESS_TOKEN) {
    res.status(500).json({ error: 'Missing META_CONVERSIONS_API_TOKEN env var' });
    return;
  }

  try {
    const eventTime = Math.floor(Date.now() / 1000);

    const body = {
      data: [
        {
          event_name: 'Subscribe',
          event_time: eventTime,
          action_source: 'website',
          event_source_url: 'https://radicalssportspro.com/',
          user_data: {
            client_ip_address:
              req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
            client_user_agent: req.headers['user-agent'] || ''
          }
        }
      ]
    };

    const response = await fetch(
      https://graph.facebook.com/v18.0/${DATASET_ID}/events?access_token=${ACCESS_TOKEN},
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const json = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', json);
      res.status(500).json({ error: 'Meta API error', details: json });
      return;
    }

    res.status(200).json({ success: true, meta: json });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
