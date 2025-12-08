export default async function handler(req, res) {
  try {
    const token = process.env.META_CONVERSIONS_API_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "Missing API token" });
    }

    const { event_name, event_source_url, test_event_code } = req.body || {};

    const payload = {
      data: [
        {
          event_name: event_name || "Subscribe",
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: event_source_url || "https://radicalssportspro.com/",
          action_source: "website",
          user_data: {
            client_user_agent: req.headers["user-agent"] || ""
          }
        }
      ],
      // Meta ignora las claves undefined, sirve para pruebas con test_event_code
      test_event_code: test_event_code || undefined
    };

    const response = await fetch(
      "https://graph.facebook.com/v18.0/1038318315115764/events?access_token=" + token,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    return res.status(200).json({ meta_response: result });
  } catch (error) {
    console.error("Meta API error:", error);
    return res.status(500).json({ error: error.toString() });
  }
}
