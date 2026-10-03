import nodemailer from "nodemailer";

/**
 * Env-gated mail wrapper. If SMTP is not configured, submissions still succeed —
 * we just log the message to the server console instead of sending it.
 */
export async function sendMail(opts: { to: string; subject: string; text: string; html?: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log("\n[mail:disabled] Would have sent email:");
    console.log(`  To: ${opts.to}`);
    console.log(`  Subject: ${opts.subject}`);
    console.log(`  ${opts.text.replace(/\n/g, "\n  ")}\n`);
    return { sent: false as const };
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({
    from: SMTP_FROM ?? SMTP_USER,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
  return { sent: true as const };
}

export function leadsInbox(): string {
  return process.env.LEADS_INBOX || process.env.SMTP_USER || "info@draftingstudio.org";
}
