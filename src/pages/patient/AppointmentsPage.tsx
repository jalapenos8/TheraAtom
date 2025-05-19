import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments } from '../../data/mockData';
import type { Appointment, AppointmentStatus } from '../../types';

const AppointmentsPage = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Check localStorage for saved appointments
        const savedAppointments = localStorage.getItem(`appointments_${currentUser.id}`);
        
        if (savedAppointments) {
          // If we have saved appointments, use those
          setAppointments(JSON.parse(savedAppointments));
        } else {
          // Otherwise, use the mock data
          const filteredAppointments = mockAppointments.filter(
            (appointment) => appointment.patientId === currentUser.id
          );
          setAppointments(filteredAppointments);
          // Save to localStorage
          localStorage.setItem(`appointments_${currentUser.id}`, JSON.stringify(filteredAppointments));
        }
        
        setLoading(false);
      }, 500);
    }
  }, [currentUser]);

  const handleCancelAppointment = (appointmentId: string) => {
    setCancelAppointmentId(appointmentId);
    setShowConfirmation(true);
  };

  const confirmCancelAppointment = () => {
    if (cancelAppointmentId) {
      // Find the appointment being canceled
      const canceledAppointment = appointments.find(app => app.id === cancelAppointmentId);
      
      if (canceledAppointment && canceledAppointment.type === 'ct_scan') {
        // Update local state to show appointment as canceled
        const updatedAppointments = appointments.map(app => 
          app.id === cancelAppointmentId 
            ? {...app, status: 'cancelled' as AppointmentStatus} 
            : app
        );
        
        // Save updated appointments to localStorage
        setAppointments(updatedAppointments);
        localStorage.setItem(`appointments_${currentUser?.id}`, JSON.stringify(updatedAppointments));
        
        // Store the canceled appointment in localStorage to offer to other patients
        const appointmentOffer = {
          appointment: canceledAppointment,
          canceledBy: currentUser?.id,
          canceledAt: new Date().toISOString()
        };
        localStorage.setItem('appointmentOffer', JSON.stringify(appointmentOffer));
      }
      
      setShowConfirmation(false);
      setCancelAppointmentId(null);
    }
  };

  // This function will be called from the MessagesPage via URL params
  const acceptOfferedAppointment = () => {
    const offerData = localStorage.getItem('appointmentOffer');
    
    if (offerData && currentUser) {
      const offer = JSON.parse(offerData);
      const offeredAppointment = offer.appointment;
      
      if (offeredAppointment && offer.canceledBy !== currentUser.id) {
        // Add the new appointment without modifying existing appointments
        const newAppointment: Appointment = {
          ...offeredAppointment,
          patientId: currentUser.id,
          id: 'new-' + offeredAppointment.id,
          status: 'scheduled' as AppointmentStatus
        };
        const finalAppointments = [...appointments, newAppointment];
        setAppointments(finalAppointments);
        
        // Save to localStorage
        localStorage.setItem(`appointments_${currentUser.id}`, JSON.stringify(finalAppointments));
        
        // Mark the offer as accepted
        const updatedOffer = {...offer, acceptedBy: currentUser.id, acceptedAt: new Date().toISOString()};
        localStorage.setItem('appointmentOffer', JSON.stringify(updatedOffer));
        
        // Redirect to remove query params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };

  // Check URL parameters for appointment actions after appointments are loaded
  useEffect(() => {
    if (!loading && currentUser) {
      const queryParams = new URLSearchParams(window.location.search);
      const action = queryParams.get('action');

      if (action === 'acceptOffer') {
        acceptOfferedAppointment();
      }
    }
  }, [currentUser, loading]);

  if (loading) {
    return <div className="flex justify-center items-center py-10">Loading...</div>;
  }

  // Group appointments by date for calendar-like view
  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>(
    (acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    },
    {}
  );

  // Sort dates
  const sortedDates = Object.keys(appointmentsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800';
      case 'urine_test':
        return 'bg-green-100 text-green-800';
      case 'ct_scan':
        return 'bg-purple-100 text-purple-800';
      case 'surgery':
        return 'bg-red-100 text-red-800';
      case 'radiation_therapy':
        return 'bg-orange-100 text-orange-800';
      case 'chemotherapy':
        return 'bg-pink-100 text-pink-800';
      case 'immunotherapy':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'missed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Your Appointments</h1>
        <p className="text-gray-600">View and manage your upcoming appointments</p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Confirm Cancellation</h3>
            <p className="mb-4">
              Are you sure you want to cancel this CT scan appointment? This slot will be offered to other patients.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                No, Keep Appointment
              </button>
              <button
                onClick={confirmCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-lg text-gray-500">You have no upcoming appointments.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="card">
              <div className="border-b border-gray-200 pb-2 mb-3">
                <h2 className="text-lg font-medium text-text">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
              </div>
              <div className="space-y-3">
                {appointmentsByDate[date].map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="text-lg font-medium">{appointment.time}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-text">
                          {appointment.title}
                        </h3>
                        <div className="flex space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(
                              appointment.type
                            )}`}
                          >
                            {appointment.type.replace('_', ' ')}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Duration: {appointment.duration} minutes
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                      
                      {/* Show cancel button only for CT scan appointments that are scheduled */}
                      {appointment.type === 'ct_scan' && appointment.status === 'scheduled' && (
                        <div className="mt-2">
                          <button 
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage; 