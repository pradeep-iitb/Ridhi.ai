import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * Ask Gemini AI for a response
 */
export async function askGemini(prompt, conversationHistory = []) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const contents = [
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const response = await axios.post(url, {
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    return { source: 'gemini', text, success: true };
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return { source: 'gemini', text: '', success: false, error: error.message };
  }
}

/**
 * Ask DeepSeek AI for a response
 */
export async function askDeepSeek(prompt, conversationHistory = []) {
  try {
    const url = 'https://api.deepseek.com/v1/chat/completions';
    
    const messages = [
      { role: 'system', content: 'You are Ridhi, an intelligent AI assistant for students. Be helpful, concise, and educational.' },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    const response = await axios.post(url, {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2048
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = response.data?.choices?.[0]?.message?.content || 'No response from DeepSeek';
    return { source: 'deepseek', text, success: true };
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message);
    return { source: 'deepseek', text: '', success: false, error: error.message };
  }
}

/**
 * Intelligently merge responses from both AI models
 */
export async function askBothAIs(prompt, conversationHistory = []) {
  try {
    // Call both APIs in parallel
    const [geminiResult, deepseekResult] = await Promise.all([
      askGemini(prompt, conversationHistory),
      askDeepSeek(prompt, conversationHistory)
    ]);

    // If both fail, return error
    if (!geminiResult.success && !deepseekResult.success) {
      return {
        success: false,
        text: 'Both AI services are currently unavailable. Please try again later.',
        sources: []
      };
    }

    // If only one succeeds, use that one
    if (!geminiResult.success) {
      return {
        success: true,
        text: deepseekResult.text,
        sources: ['deepseek'],
        primary: 'deepseek'
      };
    }

    if (!deepseekResult.success) {
      return {
        success: true,
        text: geminiResult.text,
        sources: ['gemini'],
        primary: 'gemini'
      };
    }

    // Both succeeded - intelligently choose or merge
    // Use Gemini for factual/technical queries, DeepSeek for creative/conversational
    const isTechnical = /\b(how|what|why|explain|define|calculate|solve|code|program)\b/i.test(prompt);
    
    if (isTechnical) {
      return {
        success: true,
        text: geminiResult.text,
        sources: ['gemini', 'deepseek'],
        primary: 'gemini',
        alternative: deepseekResult.text
      };
    } else {
      return {
        success: true,
        text: deepseekResult.text,
        sources: ['deepseek', 'gemini'],
        primary: 'deepseek',
        alternative: geminiResult.text
      };
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      success: false,
      text: 'An error occurred while processing your request.',
      error: error.message
    };
  }
}

/**
 * Summarize text content (for PDFs, documents)
 */
export async function summarizeContent(content, type = 'general') {
  const prompt = `Summarize the following ${type} content concisely. Focus on key points and main ideas:\n\n${content}`;
  return await askGemini(prompt);
}

/**
 * Extract information from text based on query
 */
export async function extractInformation(content, query) {
  const prompt = `Based on the following content, answer this question: ${query}\n\nContent:\n${content}`;
  return await askBothAIs(prompt);
}
