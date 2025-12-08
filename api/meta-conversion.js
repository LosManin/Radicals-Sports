// api/meta-conversion.js

export default async function handler(req, res) {
  // Solo aceptar peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Tu token de la API (desde las variables de entorno de Vercel)
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  // ID del pixel correcto
  const pixelId = "1038318315115764";

  if (!accessToken) {
    console.error("Falta META_CONVERSIONS_API_TOKEN en Vercel");
    return res.status(500).json({ error: "Missing Meta API token" });
  }

  // Datos que vienen del botón de la web
  const { event_name, event_source_url } = req.body || {};

  // Tiempo del evento (en segundos)
  const eventTime = Math.floor(Date.now() / 1000);

  // Cuerpo mínimo que le vamos a mandar a Meta
  const payload = {
    data: [
      {
        event_name: event_name || "Subscribe",
        event_time: eventTime,
        action_source: "website",
        event_source_url: event_source_url || "https://radicalssportspro.com/",
      },
    ],
  };

  try {
    const url = https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken};

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Meta API response:", data);

    if (!response.ok) {
      // Meta devolvió error
      return res.status(500).json({ error: "Meta API error", details: data });
    }

    // Todo OK
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Meta API fetch error:", error);
    return res.status(500).json({ error: "Request to Meta failed" });
  }
}
