import { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatBotProps {
  onClose: () => void;
}

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  // Simple rule-based responses
  const getBotResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('appointment') || lowerText.includes('schedule')) {
      return 'To view or manage your appointments, please navigate to the Appointments tab in the sidebar.';
    } else if (lowerText.includes('result') || lowerText.includes('test')) {
      return 'Test results can be found in the Results tab. If you have questions about your results, please contact your doctor.';
    } else if (lowerText.includes('doctor') || lowerText.includes('contact')) {
      return 'To contact your doctor, please use the Messages feature or call the clinic directly at (555) 123-4567.';
    } else if (lowerText.includes('ct scan') || lowerText.includes('ct')) {
      return 'CT scans need to be scheduled at least 30 days in advance. You will also need to complete a urine test within 30 days before your CT scan.';
    } else if (lowerText.includes('emergency')) {
      return 'For medical emergencies, please call 911 immediately or go to your nearest emergency room.';
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return 'Hello! How can I assist you with the patient portal today?';
    } else if (lowerText.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return 'I\'m sorry, I don\'t have specific information about that. For detailed questions, please contact your healthcare provider or navigate to the appropriate section in the portal.';
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">Assistant</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-primary/80">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Type your message..."
          />
          <button 
            type="submit" 
            className="bg-primary text-white p-2 rounded-r-md"
            disabled={!inputValue.trim()}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot; 