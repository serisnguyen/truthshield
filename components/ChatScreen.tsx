import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { useAuth } from '../context/AuthContext';
import { sanitizeInput } from '../services/aiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isWarning?: boolean;
  isStreaming?: boolean;
}

const ChatScreen: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize Chat Session
  useEffect(() => {
    const initChat = () => {
      try {
          const apiKey = process.env.API_KEY;
          if (!apiKey) throw new Error("API Key missing");

          const ai = new GoogleGenAI({ apiKey });
          const userName = user ? user.name : "Bác/Cô/Chú";
          
          chatSessionRef.current = ai.chats.create({
              model: "gemini-2.5-flash",
              config: {
                  systemInstruction: `Bạn là trợ lý an ninh TruthShield. Tên người dùng: ${userName}.
                  Hãy trả lời ngắn gọn, dễ hiểu cho người cao tuổi.
                  Nhiệm vụ: Phân tích lừa đảo, đưa ra lời khuyên bảo mật.`,
              },
          });

          // Set initial greeting
          setMessages([{ 
            id: 'init', 
            role: 'model', 
            text: `Xin chào ${userName}! Cháu là trợ lý an ninh. Bác có tin nhắn hay cuộc gọi lạ nào cần kiểm tra không ạ?`,
            isWarning: false
          }]);

      } catch (error) {
          console.error("Chat initialization failed", error);
          setMessages([{ 
            id: 'err-init', 
            role: 'model', 
            text: "Hệ thống đang bảo trì. Bác vui lòng thử lại sau nhé.", 
            isWarning: true
          }]);
      }
    };

    initChat();
  }, [user]);

  const handleSend = async (textInput?: string) => {
    const rawText = textInput || input;
    if (!rawText.trim()) return;

    const safeText = sanitizeInput(rawText);

    const userMsgId = Date.now().toString();
    const userMsg: Message = { id: userMsgId, role: 'user', text: safeText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) throw new Error("Chat session not active");

      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { 
        id: modelMsgId, 
        role: 'model', 
        text: '', 
        isStreaming: true 
      }]);

      // Streaming response logic with timeout fallback could be added here
      // But keeping simple for mobile update focus
      const result = await chatSessionRef.current.sendMessageStream({
        message: safeText
      });

      let fullText = '';
      
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text || '';
        fullText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { 
                ...msg, 
                text: fullText,
                isWarning: /lừa đảo|cảnh báo|nguy hiểm|tuyệt đối không|chặn số|công an giả/i.test(fullText)
              } 
            : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { 
        id: 'err-' + Date.now(), 
        role: 'model', 
        text: "Mạng đang yếu. Bác kiểm tra lại Wifi/4G giúp cháu nhé.", 
        isWarning: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const SuggestionButton = ({ text }: { text: string }) => (
    <button 
      onClick={() => handleSend(text)}
      disabled={isLoading}
      className="flex-shrink-0 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 px-4 py-2 rounded-xl text-sm text-slate-700 font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
    >
      {text}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] relative">
      {/* Sticky Header */}
      <div className="pt-20 md:pt-6 px-4 pb-3 border-b border-slate-200 bg-white/95 backdrop-blur-sm z-10 flex items-center gap-3 shadow-sm sticky top-0">
         <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200 shadow-inner relative flex-shrink-0">
            <Bot size={24} className="text-blue-600" />
            <div className="absolute -bottom-0.5 -right-0.5 bg-white p-0.5 rounded-full">
               <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
            </div>
         </div>
         <div>
           <h2 className="text-slate-900 font-bold text-lg md:text-xl">Trợ Lý An Ninh</h2>
           <p className="text-slate-500 text-xs font-medium">Hỏi đáp 24/7</p>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 pb-36 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
            
            {/* Avatar */}
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm border-2 ${
              msg.role === 'user' 
                ? 'bg-white border-slate-200' 
                : (msg.isWarning ? 'bg-red-100 border-red-200' : 'bg-blue-100 border-blue-200')
            }`}>
              {msg.role === 'user' 
                ? <User size={18} className="text-slate-700" /> 
                : <Bot size={18} className={msg.isWarning ? 'text-red-600' : 'text-blue-600'} />
              }
            </div>
            
            {/* Bubble */}
            <div className={`max-w-[80%] p-4 rounded-2xl text-base leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : msg.isWarning 
                  ? 'bg-red-50 border-l-4 border-red-500 text-slate-900 rounded-tl-none ring-1 ring-red-100' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              {msg.isWarning && (
                <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1 uppercase text-xs tracking-wide border-b border-red-200 pb-1">
                  <ShieldAlert size={14}/> Cảnh báo
                </div>
              )}
              <div className="whitespace-pre-wrap break-words">{msg.text}</div>
              {msg.isStreaming && (
                 <span className="inline-block w-2 h-4 ml-1 bg-current opacity-50 animate-pulse align-middle">|</span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex gap-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                 <Loader2 size={16} className="text-blue-400 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Suggestions & Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-20 md:pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        
        {/* Quick Prompts - Horizontal Scroll */}
        {!isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar px-1">
             <SuggestionButton text="Kiểm tra tin nhắn" />
             <SuggestionButton text="Công an gọi đòi tiền?" />
             <SuggestionButton text="Link lạ?" />
             <SuggestionButton text="Lừa đảo việc làm?" />
          </div>
        )}

        <div className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi..."
            disabled={isLoading}
            className="flex-1 bg-slate-100 text-slate-900 rounded-full py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-300 focus:border-blue-500 transition-all text-base placeholder:text-slate-500 disabled:opacity-60 disabled:bg-slate-50 shadow-inner"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-full flex items-center justify-center text-white transition-all shadow-sm active:scale-90 ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;