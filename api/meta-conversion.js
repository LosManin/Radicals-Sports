export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
    const pixelId = "1038318315115764"; // ID de tu pixel/dataset Radical Sports

    if (!accessToken) {
      console.error("Falta META_CONVERSIONS_API_TOKEN en Vercel");
      return res.status(500).json({ error: "Missing access token" });
    }

    const body = req.body || {};
    const event_name = body.event_name || "Subscribe";
    const event_source_url =
      body.event_source_url || "https://radicalssportspro.com/";

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url,
          action_source: "website",
        },
      ],
    };

    const fbResponse = await fetch(
      https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken},
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const fbJson = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error("Facebook CAPI error:", fbJson);
      return res.status(500).json({ error: "Facebook error", details: fbJson });
    }

    console.log("Facebook CAPI success:", fbJson);
    return res.status(200).json({ success: true, fb: fbJson });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
