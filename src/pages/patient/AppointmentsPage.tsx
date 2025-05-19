import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments } from '../../data/mockData';
import type { Appointment } from '../../types';

const AppointmentsPage = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const filteredAppointments = mockAppointments.filter(
          (appointment) => appointment.patientId === currentUser.id
        );
        setAppointments(filteredAppointments);
        setLoading(false);
      }, 500);
    }
  }, [currentUser]);

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Your Appointments</h1>
        <p className="text-gray-600">View and manage your upcoming appointments</p>
      </div>

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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(
                            appointment.type
                          )}`}
                        >
                          {appointment.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Duration: {appointment.duration} minutes
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
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