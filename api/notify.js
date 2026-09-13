// Vercel serverless function — lives outside the Vite/React bundle, so
// TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID never reach the browser.
// Runs at POST /api/notify

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { choice } = req.body ?? {};

  if (choice !== "coffee" && choice !== "appreciation") {
    res.status(400).json({ error: "Invalid choice" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    // Misconfigured env vars — don't leak details to the client, just log
    // server-side (visible in Vercel's function logs) and fail quietly.
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env var");
    res.status(500).json({ error: "Server not configured" });
    return;
  }

  const label =
    choice === "coffee" ? "☕ She chose: Let's get coffee" : "🤍 She chose: I appreciate you telling me";

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: label,
      }),
    });

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      console.error("Telegram API error:", errText);
      res.status(502).json({ error: "Failed to notify" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Notify error:", err);
    res.status(500).json({ error: "Failed to notify" });
  }
}
