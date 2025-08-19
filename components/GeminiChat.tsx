
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Project } from '../types';
import { startChatWithProjectContext, sendMessageToGeminiStream } from '../services/geminiService';

// --- Helper & Icon Components ---

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

// --- Main Component ---

const GeminiChat: React.FC<{ project: Project }> = ({ project }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatInitialized, setIsChatInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const success = startChatWithProjectContext(project);
        setIsChatInitialized(success);
        if (success) {
            setMessages([
                { role: 'model', text: `¡Hola! Soy tu asistente de IA. Puedes preguntarme cualquier cosa sobre el proyecto ${project.projectName}.` }
            ]);
            setError(null);
        } else {
            setError("El chat no está disponible. Verifica la configuración de la API de Gemini.");
        }
    }, [project]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !isChatInitialized) return;
        
        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Add a placeholder for the model's response
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        let fullResponse = '';
        await sendMessageToGeminiStream(input, (chunk) => {
            fullResponse += chunk;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: fullResponse };
                return newMessages;
            });
        });

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 text-sm">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0"></div>}
                        <div className={`rounded-lg px-3 py-2 max-w-xs md:max-w-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/20 text-slate-100'}`}>
                           {msg.text || (isLoading && index === messages.length - 1 ? <span className="animate-pulse">...</span> : '')}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {error && <div className="text-red-400 text-xs text-center p-2">{error}</div>}
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pregunta sobre el proyecto..."
                    className="flex-grow bg-black/20 border border-white/30 rounded-lg p-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading || !!error}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim() || !!error}
                    className="bg-indigo-600 text-white font-bold rounded-lg px-4 py-2 disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors flex items-center justify-center"
                >
                    {isLoading ? <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span> : <SendIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default GeminiChat;
