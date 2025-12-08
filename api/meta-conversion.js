// api/meta-conversion.js

const https = require('https');

const PIXEL_ID = '1038318315115764'; // tu pixel

// pequeña función auxiliar para hacer POST a Meta sin usar fetch
function postToMeta(url, payload) {
  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(url);

      const options = {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, json });
          } catch (e) {
            reject(new Error('Meta devolvió algo que no es JSON: ' + e.message));
          }
        });
      });

      req.on('error', err => {
        reject(err);
      });

      req.write(JSON.stringify(payload));
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = async (req, res) => {
  console.log('meta-conversion handler');

  // solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', method: req.method });
  }

  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!accessToken) {
    console.error('Falta META_CONVERSIONS_API_TOKEN en Vercel');
    return res.status(500).json({ error: 'Server config error: missing token' });
  }

  // intentar leer el body
  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    console.error('JSON inválido en el body', e);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const event_name = body.event_name || 'Subscribe';
  const event_source_url = body.event_source_url || 'https://radicalsportspro.com/';

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

  const url = https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${accessToken};
  console.log('Enviando a Meta:', url, JSON.stringify(payload));

  try {
    const { status, json } = await postToMeta(url, payload);
    console.log('Respuesta Meta:', status, json);

    if (status < 200 || status >= 300) {
      return res.status(500).json({ error: 'Meta API error', status, details: json });
    }

    return res.status(200).json({ success: true, meta: json });
  } catch (err) {
    console.error('Error hablando con Meta', err);
    return res.status(500).json({ error: 'Server error', details: err.message || String(err) });
  }
};
