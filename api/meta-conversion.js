// api/meta-conversion.js

const PIXEL_ID = '1038318315115764';

module.exports = async (req, res) => {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Token de la API de conversiones (desde Vercel)
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: 'Server config error: missing token' });
  }

  // Cuerpo que viene del botón
  let body = {};
  try {
    body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Valores por defecto si no vienen en el body
  const event_name = body.event_name || 'Subscribe';
  const event_source_url = body.event_source_url || 'https://radicalsportspro.com/';

  // Payload mínimo para la API de Meta
  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url,
      },
    ],
  };

  // URL de la API de conversiones
  const url = https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${accessToken};

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Leemos siempre como texto para que nunca rompa
    let text = '';
    try {
      text = await response.text();
    } catch (e) {
      text = '';
    }

    // Intentamos parsear como JSON; si no se puede, devolvemos el texto crudo
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = { raw: text };
    }

    if (!response.ok) {
      // Error de Meta pero en JSON válido para el front
      return res.status(500).json({
        error: 'Meta API error',
        status: response.status,
        details: data,
      });
    }

    // Todo correcto
    return res.status(200).json({
      success: true,
      status: response.status,
      meta: data,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
};
