// api/meta-conversion.js

module.exports = async (req, res) => {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;
  const pixelId = "1038318315115764"; // Tu pixel Radical Sports

  try {
    const body = req.body || {};

    const eventName = body.event_name || "Subscribe";
    const eventSourceUrl =
      body.event_source_url || "https://radicalssportspro.com/";

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000), // ahora en segundos
          action_source: "website",
          event_source_url: eventSourceUrl,
        },
      ],
    };

    const url = https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken};

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Meta API response:", data);

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Meta API error", details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
