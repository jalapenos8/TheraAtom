import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockMessages, mockDoctors } from '../../data/mockData';
import type { Message, Doctor } from '../../types';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<Record<string, Doctor>>({});

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const userMessages = mockMessages.filter(
          (message) => message.receiverId === currentUser.id
        );
        
        // Get doctor info for each message
        const doctors = mockDoctors.reduce((acc, doctor) => {
          acc[doctor.id] = doctor;
          return acc;
        }, {} as Record<string, Doctor>);
        
        setDoctorInfo(doctors);
        setMessages(userMessages);
        setLoading(false);
      }, 500);
    }
  }, [currentUser]);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSenderName = (senderId: string): string => {
    if (senderId === 'system') {
      return 'System';
    }
    
    const doctor = doctorInfo[senderId];
    return doctor ? doctor.name : 'Unknown Sender';
  };

  if (loading) {
    return <div className="flex justify-center items-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Messages</h1>
        <p className="text-gray-600">View messages from your doctor and the system</p>
      </div>

      {messages.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-lg text-gray-500">No messages available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`card ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-medium text-text">
                    {getSenderName(message.senderId)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(message.timestamp)}
                  </p>
                </div>
                {message.isSystemMessage && (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                    System
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <p className="text-gray-700 whitespace-pre-line">{message.content}</p>
              </div>
              
              {/* In a real application, we'd have a way to mark messages as read and reply */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 