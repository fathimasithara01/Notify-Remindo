export interface InviteEmailContent {
    subject: string;
    text: string;
    html: string;
}

export function inviteEmailTemplate(params: {
    orgName: string;
    inviteUrl: string;
    ttlHours: number;
    isResend?: boolean;
}): InviteEmailContent {
    const { orgName, inviteUrl, ttlHours, isResend } = params;
    const heading = isResend ? 'Your invite has been resent' : "You're invited to Notify";

    const subject = isResend
        ? `Reminder: set up your Notify account for ${orgName}`
        : `You're invited to manage ${orgName} on Notify`;

    const text = `${heading}\n\nAn account has been set up for ${orgName} on Notify.\nSet your password to get started: ${inviteUrl}\n\nThis link expires in ${ttlHours} hours.`;

    const html = `
<div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
  <h2 style="margin: 0 0 16px; font-size: 20px;">${heading}</h2>
  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
    An account has been set up for <strong>${orgName}</strong> on Notify.
    Click the button below to set your password and get started.
  </p>
  <a href="${inviteUrl}"
     style="display: inline-block; padding: 10px 20px; background: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; margin: 8px 0 20px;">
    Set your password
  </a>
  <p style="margin: 0; font-size: 12px; color: #8a8a8a;">
    This link expires in ${ttlHours} hours. If you weren't expecting this invite, you can ignore this email.
  </p>
  <p style="margin: 24px 0 0; font-size: 11px; color: #b0b0b0; word-break: break-all;">
    Or paste this link into your browser: ${inviteUrl}
  </p>
</div>`.trim();

    return { subject, text, html };
}