exports.handler = async function(event) {

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "Only POST allowed"
      })
    };
  }

  try {

    const data = JSON.parse(event.body || "{}");

    const name = String(data.name || "").trim();
    const phone = String(data.phone || "").trim();
    const message = String(data.message || "").trim();

    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "Name required"
        })
      };
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "Telegram variables missing"
        })
      };
    }

    const text =
`🎉 GANPATI INVITATION RESPONSE 🎉

👤 नाम: ${name}

📱 मोबाइल: ${phone || "नहीं दिया"}

💬 संदेश:
${message || "कोई संदेश नहीं"}

📅 तारीख: 14 September 2026
⏰ समय: 11:00 AM
📍 स्थान: Lakh Bhawn

🌺 Shree Amcha Ganpati Mandal

🙏 गणपति बप्पा मोरया!`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: result.description || "Telegram error"
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        message: "Telegram message sent"
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: error.message
      })
    };

  }
};
