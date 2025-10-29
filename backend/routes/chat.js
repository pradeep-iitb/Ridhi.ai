import express from 'express';
import { askBothAIs, askGemini, askDeepSeek } from '../lib/ai.js';
import { db } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/chat/message
 * Send a message and get AI response
 */
router.post('/message', async (req, res) => {
  try {
    const { message, userId, conversationHistory = [], aiModel = 'both' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let aiResponse;

    // Choose AI model based on request
    switch (aiModel) {
      case 'gemini':
        aiResponse = await askGemini(message, conversationHistory);
        break;
      case 'deepseek':
        aiResponse = await askDeepSeek(message, conversationHistory);
        break;
      case 'both':
      default:
        aiResponse = await askBothAIs(message, conversationHistory);
    }

    // Save to Firebase if userId provided
    if (userId && aiResponse.success) {
      const chatRef = db.collection('chats').doc(userId);
      const timestamp = new Date().toISOString();
      
      await chatRef.collection('messages').add({
        userMessage: message,
        aiResponse: aiResponse.text,
        sources: aiResponse.sources || [],
        timestamp,
        weekLabel: getWeekLabel(new Date())
      });
    }

    res.json({
      success: true,
      response: aiResponse.text,
      sources: aiResponse.sources || [],
      primary: aiResponse.primary
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

/**
 * GET /api/chat/history/:userId
 * Get chat history for a user
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { week } = req.query;

    const chatRef = db.collection('chats').doc(userId).collection('messages');
    let query = chatRef.orderBy('timestamp', 'desc').limit(100);

    if (week) {
      query = query.where('weekLabel', '==', week);
    }

    const snapshot = await query.get();
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, messages });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history', details: error.message });
  }
});

/**
 * GET /api/chat/weeks/:userId
 * Get list of weeks with chat history
 */
router.get('/weeks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const snapshot = await db.collection('chats')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .get();

    const weeks = new Set();
    snapshot.docs.forEach(doc => {
      const weekLabel = doc.data().weekLabel;
      if (weekLabel) weeks.add(weekLabel);
    });

    res.json({ success: true, weeks: Array.from(weeks) });
  } catch (error) {
    console.error('Weeks fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch weeks', details: error.message });
  }
});

/**
 * DELETE /api/chat/history/:userId
 * Clear chat history for a user
 */
router.delete('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { week } = req.query;

    const chatRef = db.collection('chats').doc(userId).collection('messages');
    
    let query = chatRef;
    if (week) {
      query = query.where('weekLabel', '==', week);
    }

    const snapshot = await query.get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ error: 'Failed to delete history', details: error.message });
  }
});

/**
 * Helper function to get week label
 */
function getWeekLabel(date) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const month = monthNames[date.getMonth()];
  const weekNumber = Math.ceil(date.getDate() / 7);
  
  return `Week ${weekNumber} ${month}`;
}

export default router;
