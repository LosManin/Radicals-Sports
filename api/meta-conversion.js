// api/meta-conversion.js

const https = require('https');

const PIXEL_ID = '1038318315115764'; // tu pixel correcto

module.exports = async (req, res) => {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Token de Meta desde Vercel (ya lo tienes creado)
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: 'Server config error: missing token' });
  }

  // Leer body (por si viene string o ya objeto)
  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const event_name = body.event_name || 'Subscribe';
  const event_source_url = body.event_source_url || 'https://radicalsportspro.com/';

  // Payload mínimo para la API
  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url
      }
    ]
  };

  const url = new URL(https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${accessToken});

  try {
    const metaResponse = await sendPostRequest(url, payload);

    // Si Meta devuelve código distinto de 200
    if (metaResponse.statusCode < 200 || metaResponse.statusCode >= 300) {
      return res.status(500).json({
        error: 'Meta API error',
        statusCode: metaResponse.statusCode,
        body: metaResponse.body
      });
    }

    return res.status(200).json({
      success: true,
      meta: metaResponse.body
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      details: err.message || String(err)
    });
  }
};

function sendPostRequest(url, payload) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = { raw: data };
        }

        resolve({
          statusCode: res.statusCode,
          body: parsed
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}
