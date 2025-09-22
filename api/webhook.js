export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(200).json({ ok: true, message: "Use POST with Telegram webhook payload." });
    return;
  }

  const rawBody = req.body;
  const body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
  const message = body?.message;

  if (!message?.chat?.id) {
    res.status(200).json({ ok: true });
    return;
  }

  const chatId = message.chat.id;
  const text = "Новый бот для переписок - @VibeDatingBot";
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    res.status(500).json({ ok: false, error: "TELEGRAM_BOT_TOKEN is not set." });
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram API error:", errorText);
      res.status(500).json({ ok: false });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Failed to call Telegram API:", error);
    res.status(500).json({ ok: false });
  }
}
