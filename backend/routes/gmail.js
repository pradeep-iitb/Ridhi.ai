import express from 'express';
import { google } from 'googleapis';
import { auth } from '../config/firebase.js';

const router = express.Router();

// OAuth2 client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/api/auth/callback/google`
);

/**
 * GET /api/gmail/auth-url
 * Get Gmail authorization URL
 */
router.get('/auth-url', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ success: true, authUrl: url });
});

/**
 * POST /api/gmail/set-tokens
 * Set Gmail OAuth tokens
 */
router.post('/set-tokens', async (req, res) => {
  try {
    const { code } = req.body;
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.json({ success: true, tokens });
  } catch (error) {
    console.error('Gmail token error:', error);
    res.status(500).json({ error: 'Failed to exchange code for tokens', details: error.message });
  }
});

/**
 * POST /api/gmail/list
 * List emails from Gmail
 */
router.post('/list', async (req, res) => {
  try {
    const { accessToken, maxResults = 10, query = '' } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: query || 'is:unread'
    });

    const messages = response.data.messages || [];
    
    // Fetch details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        });

        const headers = details.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        const date = headers.find(h => h.name === 'Date')?.value || '';

        return {
          id: msg.id,
          subject,
          from,
          date,
          snippet: details.data.snippet
        };
      })
    );

    res.json({ success: true, messages: detailedMessages });
  } catch (error) {
    console.error('Gmail list error:', error);
    res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
  }
});

/**
 * POST /api/gmail/read
 * Read a specific email
 */
router.post('/read', async (req, res) => {
  try {
    const { accessToken, messageId } = req.body;

    if (!accessToken || !messageId) {
      return res.status(400).json({ error: 'Access token and messageId are required' });
    }

    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });

    const headers = message.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
    const date = headers.find(h => h.name === 'Date')?.value || '';

    // Extract body
    let body = '';
    if (message.data.payload.body.data) {
      body = Buffer.from(message.data.payload.body.data, 'base64').toString();
    } else if (message.data.payload.parts) {
      const textPart = message.data.payload.parts.find(part => part.mimeType === 'text/plain');
      if (textPart && textPart.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
      }
    }

    res.json({
      success: true,
      email: {
        id: messageId,
        subject,
        from,
        date,
        body,
        snippet: message.data.snippet
      }
    });
  } catch (error) {
    console.error('Gmail read error:', error);
    res.status(500).json({ error: 'Failed to read email', details: error.message });
  }
});

/**
 * POST /api/gmail/send
 * Send an email
 */
router.post('/send', async (req, res) => {
  try {
    const { accessToken, to, subject, body } = req.body;

    if (!accessToken || !to || !subject || !body) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Gmail send error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

export default router;
