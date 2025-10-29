'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { chatAPI, filesAPI } from '@/lib/api';
import { getVoiceManager, canUseSpeechRecognition, canUseSpeechSynthesis } from '@/lib/voice';
import Vortex from '@/components/Vortex';
import { 
  Mic, 
  MicOff, 
  Send, 
  Upload, 
  History, 
  LogOut, 
  Crown,
  Menu,
  X,
  File,
  Paperclip
} from 'lucide-react';
import Image from 'next/image';

export default function Chat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const voiceManager = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadChatHistory(user.uid);
        loadWeeks(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Initialize voice manager
    if (typeof window !== 'undefined') {
      voiceManager.current = getVoiceManager();
    }

    return () => {
      if (voiceManager.current) {
        voiceManager.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Set up inactivity callback for voice mode
    if (voiceManager.current && isVoiceMode) {
      voiceManager.current.setInactivityCallback(() => {
        // After 2 seconds of inactivity, AI starts talking
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.role === 'assistant' && lastMessage.content) {
            speakText(lastMessage.content);
          }
        }
      }, 2000);
    }
  }, [isVoiceMode, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (userId, week = null) => {
    try {
      const response = await chatAPI.getHistory(userId, week);
      if (response.success) {
        const formattedMessages = response.messages.flatMap(msg => [
          { role: 'user', content: msg.userMessage },
          { role: 'assistant', content: msg.aiResponse }
        ]);
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const loadWeeks = async (userId) => {
    try {
      const response = await chatAPI.getWeeks(userId);
      if (response.success) {
        setWeeks(response.weeks);
      }
    } catch (error) {
      console.error('Failed to load weeks:', error);
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading || !user) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Update activity for voice mode
    if (voiceManager.current) {
      voiceManager.current.updateActivity();
    }

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await chatAPI.sendMessage(
        messageText,
        user.uid,
        conversationHistory
      );

      if (response.success) {
        const assistantMessage = { role: 'assistant', content: response.response };
        setMessages(prev => [...prev, assistantMessage]);

        // If in voice mode, speak the response
        if (isVoiceMode && canUseSpeechSynthesis()) {
          await speakText(response.response);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (!canUseSpeechRecognition()) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isVoiceMode) {
      stopVoiceMode();
    } else {
      startVoiceMode();
    }
  };

  const startVoiceMode = () => {
    setIsVoiceMode(true);
    setIsListening(true);

    voiceManager.current?.startListening(
      (transcript, isFinal) => {
        setInput(transcript);
        
        if (isFinal) {
          sendMessage(transcript);
          setInput('');
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const stopVoiceMode = () => {
    setIsVoiceMode(false);
    setIsListening(false);
    voiceManager.current?.stopListening();
    voiceManager.current?.stopSpeaking();
  };

  const speakText = async (text) => {
    try {
      await voiceManager.current?.speak(text, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !user) return;

    setUploadingFile(true);

    try {
      const response = await filesAPI.upload(file, user.uid);

      if (response.success) {
        const fileMessage = {
          role: 'assistant',
          content: `File "${response.fileName}" uploaded successfully! ${response.summary ? `\n\nSummary: ${response.summary}` : ''}`
        };
        setMessages(prev => [...prev, fileMessage]);

        if (isVoiceMode) {
          await speakText(`File ${response.fileName} uploaded successfully`);
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      ref={dropZoneRef}
    >
      {/* Vortex Background */}
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="absolute inset-0"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 glass border-b border-white/10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showHistory ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <History size={20} className="text-white/70" />
            <span className="text-white/70 text-sm">History</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.jpg"
                alt="Ridhi.ai"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-white">Ridhi.ai</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity">
              <Crown size={16} />
              <span className="text-sm font-semibold">Premium</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Chat History */}
          <aside
            className={`${
              showHistory ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:relative z-20 w-64 h-full glass border-r border-white/10 transition-transform duration-300 overflow-y-auto`}
          >
            <div className="p-4">
              <h2 className="text-white font-semibold mb-4">Chat History</h2>
              <div className="space-y-2">
                {weeks.map((week) => (
                  <button
                    key={week}
                    onClick={() => {
                      setSelectedWeek(week);
                      loadChatHistory(user?.uid, week);
                      setShowHistory(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedWeek === week
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <span className="text-white/90 text-sm">{week}</span>
                  </button>
                ))}
                {weeks.length === 0 && (
                  <p className="text-white/50 text-sm">No history yet</p>
                )}
              </div>
            </div>
          </aside>

          {/* Chat Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Welcome to Ridhi.ai! 👋
                  </h2>
                  <p className="text-white/70 max-w-md">
                    Your intelligent AI assistant for learning. Ask me anything, upload files, or use voice commands!
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={message.role === 'user' ? 'message-user' : 'message-ai'}>
                    <p className="text-white whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="message-ai">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 glass border-t border-white/10">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                  title="Upload file"
                >
                  {uploadingFile ? (
                    <div className="animate-spin">⏳</div>
                  ) : (
                    <Paperclip size={20} />
                  )}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isListening ? 'Listening...' : 'Type a message...'}
                  className="flex-1 input-glass"
                  disabled={loading || isListening}
                />

                <button
                  onClick={toggleVoiceMode}
                  className={`p-3 rounded-lg transition-all ${
                    isVoiceMode
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'hover:bg-white/10'
                  }`}
                  title={isVoiceMode ? 'Stop voice mode' : 'Start voice mode'}
                >
                  {isVoiceMode ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>

              <p className="text-white/50 text-xs mt-2 text-center">
                {isVoiceMode && 'Voice mode active - AI will respond after 2 seconds of silence'}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
