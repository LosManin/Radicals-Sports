// api/meta-conversion.js

module.exports = async (req, res) => {
  try {
    // Solo aceptamos POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ID de tu píxel (el que ya estás usando en la web)
    const pixelId = '10383183151151764';

    // Token que metiste en Vercel (META_CONVERSIONS_API_TOKEN)
    const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

    if (!accessToken) {
      console.error('Falta la variable META_CONVERSIONS_API_TOKEN en Vercel');
      return res.status(500).json({ error: 'Missing META_CONVERSIONS_API_TOKEN' });
    }

    // Datos que vienen desde el botón de la web
    const { event_name, event_source_url } = req.body || {};

    // Carga mínima para la API de conversiones
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

    const url = https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken};

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta API error:', data);
      return res.status(500).json({ error: 'Meta API error', details: data });
    }

    console.log('Meta API ok:', data);
    return res.status(200).json({ success: true, meta: data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
