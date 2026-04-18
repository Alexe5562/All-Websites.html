const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.static(path.join(__dirname)));

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER || 'YOUR_SMTP_EMAIL';
  const pass = process.env.SMTP_PASS || 'YOUR_SMTP_PASSWORD';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

app.post('/send-code', async (req, res) => {
  const { to_name, to_email, verification_code } = req.body;

  if (!to_name || !to_email || !verification_code) {
    return res.status(400).json({ error: 'Missing email, name, or verification code.' });
  }

  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || transporter.options.auth.user;

  try {
    await transporter.sendMail({
      from: `Verification Bot <${from}>`,
      to: to_email,
      subject: 'Your verification code',
      text: `Hello ${to_name},\n\nYour verification code is: ${verification_code}\n\nEnter it on the profile verification page to continue.`,
      html: `
        <p>Hello ${to_name},</p>
        <p>Your verification code is:</p>
        <h2>${verification_code}</h2>
        <p>Enter it on the profile verification page to continue.</p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Unable to send verification email. Check SMTP settings.' });
  }
});

app.listen(PORT, () => {
  console.log(`Email verification bot running at http://localhost:${PORT}`);
});
