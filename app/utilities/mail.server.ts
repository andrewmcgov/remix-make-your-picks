import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  id: number
) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const origin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://makeyourpicks.ca';

  if (!process.env.MAIL_USER) {
    console.error('No mail user');
  }

  if (!process.env.MAIL_PASS) {
    console.error('No mail pass');
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Reset your password.',
      html: makeEmail([
        `You are recieving this email because you requested a password reset.`,
        `If you did not request this password reset, ignore this email.`,
        `<a href="${origin}/reset-password/${id}/${resetToken}">Click here to reset your password.</a>`,
      ]),
    });
  } catch (err) {
    console.error(err);
    throw new Error('Error sending pick reminder email email!');
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
