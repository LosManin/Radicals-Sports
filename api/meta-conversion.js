const PIXEL_ID = '1038318315115764';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: 'Server config error: missing token' });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const event_name = body.event_name || 'Subscribe';
  const event_source_url = body.event_source_url || 'https://radicalssportspro.com/';

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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Meta API error', details: data });
    }

    return res.status(200).json({ success: true, meta: data });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
