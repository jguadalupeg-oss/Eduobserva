
import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { askPedagogicalAssistant } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente pedagógico. ¿En qué puedo ayudarte hoy con tus supervisiones o estrategias educativas?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await askPedagogicalAssistant(input, messages);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, hubo un error al procesar tu consulta.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 animate-fadeIn">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <h4 className="font-bold flex items-center"><i className="fa-solid fa-robot mr-2"></i> Asesor Pedagógico</h4>
            <button onClick={() => setIsOpen(false)}><i className="fa-solid fa-minus"></i></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none'}`}>
                  {m.text}
                  {m.urls && m.urls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fuentes:</p>
                      {m.urls.map((url, idx) => (
                        <a key={idx} href={url.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal-600 hover:underline block truncate">
                          <i className="fa-solid fa-link mr-1"></i> {url.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-slate-400 text-xs animate-pulse italic">Buscando recursos pedagógicos...</div>}
          </div>
          <div className="p-3 bg-white border-t flex space-x-2">
            <input 
              className="flex-1 px-3 py-2 bg-slate-100 rounded-xl text-sm outline-none" 
              placeholder="Pregunta sobre estrategias..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="w-10 h-10 bg-indigo-600 text-white rounded-xl"><i className="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition active:scale-95"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-wand-sparkles'}`}></i>
      </button>
    </div>
  );
};

export default ChatAssistant;
