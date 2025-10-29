import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const chatAPI = {
  sendMessage: async (message, userId, conversationHistory = [], aiModel = 'both') => {
    const response = await api.post('/api/chat/message', {
      message,
      userId,
      conversationHistory,
      aiModel,
    });
    return response.data;
  },

  getHistory: async (userId, week = null) => {
    const url = week ? `/api/chat/history/${userId}?week=${week}` : `/api/chat/history/${userId}`;
    const response = await api.get(url);
    return response.data;
  },

  getWeeks: async (userId) => {
    const response = await api.get(`/api/chat/weeks/${userId}`);
    return response.data;
  },

  clearHistory: async (userId, week = null) => {
    const url = week ? `/api/chat/history/${userId}?week=${week}` : `/api/chat/history/${userId}`;
    const response = await api.delete(url);
    return response.data;
  },
};

// Files API
export const filesAPI = {
  upload: async (file, userId, category = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('category', category);

    const response = await api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  list: async (userId, category = null) => {
    const url = category ? `/api/files/list/${userId}?category=${category}` : `/api/files/list/${userId}`;
    const response = await api.get(url);
    return response.data;
  },

  get: async (fileId) => {
    const response = await api.get(`/api/files/${fileId}`);
    return response.data;
  },

  query: async (fileId, query) => {
    const response = await api.post('/api/files/query', { fileId, query });
    return response.data;
  },

  delete: async (fileId) => {
    const response = await api.delete(`/api/files/${fileId}`);
    return response.data;
  },
};

// Gmail API
export const gmailAPI = {
  getAuthUrl: async () => {
    const response = await api.get('/api/gmail/auth-url');
    return response.data;
  },

  setTokens: async (code) => {
    const response = await api.post('/api/gmail/set-tokens', { code });
    return response.data;
  },

  list: async (accessToken, maxResults = 10, query = '') => {
    const response = await api.post('/api/gmail/list', { accessToken, maxResults, query });
    return response.data;
  },

  read: async (accessToken, messageId) => {
    const response = await api.post('/api/gmail/read', { accessToken, messageId });
    return response.data;
  },

  send: async (accessToken, to, subject, body) => {
    const response = await api.post('/api/gmail/send', { accessToken, to, subject, body });
    return response.data;
  },
};

export default api;
