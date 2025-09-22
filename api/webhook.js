const RESPONSE_TEXT = "Новый бот для переписок - @VibeDatingBot";

export const config = {
  runtime: "nodejs"
};

function parseUpdate(req) {
  const rawBody = req.body;

  if (!rawBody) {
    return undefined;
  }

  if (typeof rawBody === "string") {
    return JSON.parse(rawBody);
  }

  if (Buffer.isBuffer(rawBody)) {
    return JSON.parse(rawBody.toString("utf8"));
  }

  return rawBody;
}

function resolveChatId(update) {
  if (!update) {
    return undefined;
  }

  if (update.message?.chat?.id) {
    return update.message.chat.id;
  }

  if (update.edited_message?.chat?.id) {
    return update.edited_message.chat.id;
  }

  if (update.callback_query?.message?.chat?.id) {
    return update.callback_query.message.chat.id;
  }

  if (update.channel_post?.chat?.id) {
    return update.channel_post.chat.id;
  }

  return undefined;
}

async function sendTelegramMessage(token, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Telegram API error:", errorText);
    throw new Error("Telegram API request failed");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(200).json({ ok: true, message: "Send Telegram updates via POST." });
    return;
  }

  let update;

  try {
    update = parseUpdate(req);
  } catch (error) {
    console.error("Failed to parse Telegram update:", error);
    res.status(400).json({ ok: false, error: "Invalid Telegram update payload." });
    return;
  }

  const chatId = resolveChatId(update);

  if (!chatId) {
    res.status(200).json({ ok: true });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not configured");
    res.status(500).json({ ok: false, error: "Bot token is not configured." });
    return;
  }

  try {
    await sendTelegramMessage(token, chatId, RESPONSE_TEXT);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Failed to call Telegram API:", error);
    res.status(500).json({ ok: false });
  }
}
