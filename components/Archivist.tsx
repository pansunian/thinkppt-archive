import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Scheme } from '../types';

interface ArchivistProps {
  schemes: Scheme[];
  onOpenScheme: (scheme: Scheme) => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  relatedSchemes?: Scheme[]; // If the model references schemes
}

// Always use named parameter for apiKey and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const Archivist: React.FC<ArchivistProps> = ({ schemes, onOpenScheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: '我是您的 AI 档案员。您可以让我帮您：\n1. 检索相关的方案（例如：“找一下关于咖啡店的策划”）\n2. 基于现有案例提供创意建议（例如：“结合库里的极简风格案例，给我的新项目一些设计灵感”）' 
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // 1. Prepare Context from Schemes (Simplified to save tokens)
      const schemeContext = schemes.map(s => 
        `ID: ${s.id} | REF: ${s.displayId} | Title: ${s.title} | Tags: ${s.tags.join(', ')} | Desc: ${s.description} | Industry: ${s.industry}`
      ).join('\n');

      const systemPrompt = `
        你是一个专业的PPT方案策划师兼档案管理员 (ThinkPPT Archivist)。
        你拥有以下方案库的访问权限（上下文数据）：
        ---
        ${schemeContext}
        ---
        
        你的主要职责有两点：
        1. **方案检索与推荐**：当用户寻找特定类型的方案时，请根据标签、行业、描述等信息在上下文中查找，并推荐最相关的方案。
           - 推荐方案时，请务必准确提及方案的标题和REF编号。
           - 请在回答的末尾，以 JSON 数组格式列出你推荐的方案 ID，格式如下：
             :::SCHEME_IDS=["id1", "id2"]:::

        2. **创意策划建议**：当用户询问创意建议时，请不要凭空捏造，而是“基于现有的档案库内容”进行回答。
           - 分析库中类似方案的描述（Visual Description/Concept），提取其设计风格、逻辑架构或切入点。
           - 告诉用户：“参考库中的《某某方案》，我们可以尝试...”
           - 将这些现有方案的优点结合起来，为用户提供新的灵感。

        请用中文回答，语气专业、干练、富有洞察力。
        回答不要太长，保持像聊天一样的自然。
      `;

      // 2. Call Gemini
      const chat: Chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemPrompt,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message: userMsg });
      let text = response.text || "抱歉，我暂时无法读取档案，请稍后再试。";

      // 3. Parse output for Scheme IDs (Custom Protocol)
      const idMatch = text.match(/:::SCHEME_IDS=(.*):::/);
      let relatedSchemes: Scheme[] = [];

      if (idMatch) {
        try {
          const ids = JSON.parse(idMatch[1]);
          relatedSchemes = schemes.filter(s => ids.includes(s.id));
          // Remove the technical tag from display text
          text = text.replace(idMatch[0], '').trim();
        } catch (e) {
          console.error("Failed to parse scheme IDs", e);
        }
      }

      setMessages(prev => [...prev, { role: 'model', content: text, relatedSchemes }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "连接档案数据库超时，请检查网络或 API Key 设置。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-2"
      >
        <div className="bg-[#FF4D4D] text-black border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_#000] transition-all rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <span className="bg-black text-white text-xs font-mono px-2 py-1 rounded hidden group-hover:block absolute right-full mr-2 whitespace-nowrap">
            AI 档案员
        </span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F3F0E6] w-full max-w-lg h-[80vh] border-2 border-black shadow-[8px_8px_0px_0px_#fff] relative flex flex-col overflow-hidden rounded-lg">
            
            {/* Header */}
            <div className="bg-black text-white p-3 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
                  AI_ARCHIVIST_CHAT
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-red-500 font-mono text-xl leading-none px-2"
              >
                ✕
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#Fdfbf7]">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-black text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                        {msg.content}
                    </div>
                    
                    {/* Render Related Schemes as Small Cards */}
                    {msg.relatedSchemes && msg.relatedSchemes.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto w-full pb-2 no-scrollbar pl-1">
                            {msg.relatedSchemes.map(s => (
                                <div 
                                    key={s.id}
                                    onClick={() => onOpenScheme(s)}
                                    className="flex-shrink-0 w-48 bg-white border border-black/10 rounded overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col group"
                                >
                                    <div className="h-24 bg-gray-100 relative overflow-hidden">
                                        <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-1 right-1 bg-black text-white text-[8px] px-1 font-mono">REF.{s.displayId}</div>
                                    </div>
                                    <div className="p-2">
                                        <div className="font-bold text-xs truncate mb-1">{s.title}</div>
                                        <div className="text-[9px] text-gray-500 truncate">{s.industry} | {s.category}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
               ))}
               
               {loading && (
                 <div className="flex items-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleAsk} className="p-3 bg-white border-t border-black/10 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="输入需求..."
                  disabled={loading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={loading || !query.trim()}
                  className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  发送
                </button>
            </form>
            
            {/* Disclaimer */}
            <div className="bg-gray-50 p-1 text-[9px] text-center text-gray-400 font-mono border-t border-gray-100">
                AI 可能产生错误信息，请以实际档案为准。Powered by Gemini 3.0
            </div>

          </div>
        </div>
      )}
    </>
  );
};
