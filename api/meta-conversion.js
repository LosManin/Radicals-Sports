// api/meta-conversion.js

// Función serverless para enviar eventos a la Conversions API de Meta
// Formato CommonJS para que Vercel no dé errores de ES module

module.exports = async (req, res) => {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

    if (!accessToken) {
      console.error('META_CONVERSIONS_API_TOKEN is missing in environment variables');
      res.status(500).json({ error: 'Server config error: missing token' });
      return;
    }

    // Datos que llegan desde el botón (por ahora los usamos fijos)
    const { event_name, event_source_url } = req.body || {};

    const payload = {
      data: [
        {
          event_name: event_name || 'Subscribe',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: event_source_url || 'https://radicalssportspro.com/'
        }
      ]
    };

    const pixelId = '1038318315115764'; // tu Dataset / Pixel ID

    const url = https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken};

    const fbResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('Facebook API error:', fbData);
      res.status(500).json({ error: 'Facebook API error', details: fbData });
      return;
    }

    console.log('Meta CAPI OK:', fbData);
    res.status(200).json({ success: true, fb: fbData });
  } catch (error) {
    console.error('Internal API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
