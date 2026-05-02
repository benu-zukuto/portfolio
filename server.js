require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve your portfolio files
app.use(express.static('.'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS   // App Password, not your real password
  }
});

app.post('/send', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to:   process.env.GMAIL_USER,   // messages come TO you
      replyTo: email,                 // so you can reply to the visitor
      subject: `New message from ${email}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// --- THE FIX IS HERE ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});