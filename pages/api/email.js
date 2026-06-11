// pages/api/send-email.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use your own SMTP
      auth: {
        user: "mckomisarek@gmail.com",
        pass: "oktvwvlmppvammpn",
      },
    });

    const mailOptions = {
      from: `"My App" <${"mckomisarek@gmail.com"}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
}
