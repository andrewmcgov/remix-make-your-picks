import formData from 'form-data';
import Mailgun from 'mailgun.js';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  id: number
) {
  if (!process.env.MAILGUN_API_KEY) {
    return console.error('No mail API key!');
  }

  if (!process.env.MAIL_USER) {
    return console.error('No mail API key!');
  }

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY as string,
  });

  const origin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://makeyourpicks.ca';

  const message = {
    to: email,
    from: process.env.MAIL_USER,
    subject: 'Reset your password',
    text: 'Reset your makeyourpicks password',
    html: makeEmail([
      `You are recieving this email because you requested a password reset.`,
      `If you did not request this password reset, ignore this email.`,
      `<a href="${origin}/reset-password/${id}/${resetToken}">Click here to reset your password.</a>`,
    ]),
  };

  try {
    const res = await client.messages.create(
      process.env.MAIL_DOMAIN as string,
      message
    );
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

export function makeEmail(text: string[]) {
  return `
  <div className="email" style="
  padding: 5px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 16px;
  ">
  ${text
    .map((line) => {
      return `<p>${line}<p>`;
    })
    .join('')}
    <p>🧀, Andrew</p>
    </div>
    `;
}
