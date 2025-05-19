import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockMessages, mockDoctors } from '../../data/mockData';
import type { Message, Doctor } from '../../types';
import { Link } from 'react-router-dom';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<Record<string, Doctor>>({});

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Check if we have saved messages in localStorage
        const savedMessages = localStorage.getItem(`messages_${currentUser.id}`);
        let userMessages = savedMessages ? JSON.parse(savedMessages) : [];
        
        // If no saved messages, use the mock data
        if (userMessages.length === 0) {
          userMessages = mockMessages.filter(
            (message) => message.receiverId === currentUser.id
          );
        }
        
        // Check localStorage for appointment offers and add a system message
        const storedOffer = localStorage.getItem('appointmentOffer');
        if (storedOffer) {
          try {
            const offer = JSON.parse(storedOffer);
            
            // Only show offer to users who didn't cancel it and haven't accepted it already
            if (offer && offer.appointment && 
                offer.canceledBy !== currentUser.id && 
                (!offer.acceptedBy || offer.acceptedBy === currentUser.id)) {
                  
              const appointmentDate = new Date(offer.appointment.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              });
              
              // Check if we already have this message
              const existingOfferMsg = userMessages.find(
                (msg: Message) => msg.isSystemMessage && 
                      msg.content.includes(`CT scan spot available on ${appointmentDate}`)
              );
              
              if (!existingOfferMsg) {
                // Create a new system message for the offer
                const newMessage: Message = {
                  id: 'offer-' + Date.now(),
                  senderId: 'system',
                  receiverId: currentUser.id || '',
                  content: `You have a free CT scan spot available on ${appointmentDate} at ${offer.appointment.time}. Would you like to switch to this appointment? Notice: you have 5 days to make an appointment.`,
                  timestamp: new Date().toISOString(),
                  isRead: false,
                  isSystemMessage: true
                };
                
                // Add the message to the beginning of the list
                userMessages = [newMessage, ...userMessages];
              }
            }
          } catch (error) {
            console.error('Error parsing appointment offer:', error);
          }
        }
        
        // Get doctor info for each message
        const doctors = mockDoctors.reduce((acc, doctor) => {
          acc[doctor.id] = doctor;
          return acc;
        }, {} as Record<string, Doctor>);
        
        // Save messages to localStorage
        localStorage.setItem(`messages_${currentUser.id}`, JSON.stringify(userMessages));
        
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

  const handleAcceptOffer = () => {
    // Mark offer as accepted in localStorage
    const offerData = localStorage.getItem('appointmentOffer');
    if (offerData && currentUser) {
      const offer = JSON.parse(offerData);
      
      // Update offer with acceptance info
      const updatedOffer = {
        ...offer,
        acceptedBy: currentUser.id,
        acceptedAt: new Date().toISOString()
      };
      
      localStorage.setItem('appointmentOffer', JSON.stringify(updatedOffer));
      
      // Navigate to appointments page with query parameter
      window.location.href = '/appointments?action=acceptOffer';
    }
  };

  const handleDeclineOffer = () => {
    // Mark offer as declined in localStorage
    const offerData = localStorage.getItem('appointmentOffer');
    if (offerData && currentUser) {
      const offer = JSON.parse(offerData);
      
      // Update offer with declination info
      const updatedOffer = {
        ...offer,
        declinedBy: [...(offer.declinedBy || []), currentUser.id],
        lastDeclinedAt: new Date().toISOString()
      };
      
      localStorage.setItem('appointmentOffer', JSON.stringify(updatedOffer));
      
      // Update the message to show it was declined
      const updatedMessages = messages.map(message => {
        if (message.isSystemMessage && message.content.includes('CT scan spot available')) {
          return {
            ...message,
            content: message.content + '\n\nYou declined this offer.'
          };
        }
        return message;
      });
      
      setMessages(updatedMessages);
      localStorage.setItem(`messages_${currentUser.id}`, JSON.stringify(updatedMessages));
    }
  };

  const isOfferAccepted = () => {
    const offerData = localStorage.getItem('appointmentOffer');
    if (offerData && currentUser) {
      const offer = JSON.parse(offerData);
      return offer.acceptedBy === currentUser.id;
    }
    return false;
  };

  const isOfferDeclined = (messageId: string) => {
    return messages.find(m => m.id === messageId)?.content.includes('You declined this offer');
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
              
              {/* Show action buttons for the appointment offer message */}
              {message.isSystemMessage && 
               message.content.includes('CT scan spot available') && 
               !isOfferDeclined(message.id) && 
               !isOfferAccepted() && (
                <div className="mt-4 flex space-x-3">
                  <button 
                    className="btn btn-primary text-sm py-2"
                    onClick={handleAcceptOffer}
                  >
                    Accept Appointment
                  </button>
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                    onClick={handleDeclineOffer}
                  >
                    Decline
                  </button>
                </div>
              )}
              
              {/* Show message if already accepted */}
              {message.isSystemMessage && 
               message.content.includes('CT scan spot available') && 
               isOfferAccepted() && (
                <div className="mt-4 bg-green-50 p-3 rounded-md text-green-800 text-sm">
                  <p>You accepted this appointment. View your updated schedule in the Appointments section.</p>
                  <Link to="/appointments" className="text-primary font-medium hover:underline mt-2 inline-block">
                    Go to Appointments
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 