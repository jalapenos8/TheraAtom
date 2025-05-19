import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments, mockPatients } from '../../data/mockData';
import type { Appointment, Patient, AppointmentType } from '../../types';

const AppointmentsPage = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [loading, setLoading] = useState(true);
  
  // For the appointment creation form
  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('consultation');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [appointmentNotes, setAppointmentNotes] = useState('');

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const doctorAppointments = mockAppointments.filter(
          (appointment) => appointment.doctorId === currentUser.id
        );
        setAppointments(doctorAppointments);
        
        // Create a map of patient data for quick lookup
        const patientMap = mockPatients.reduce((acc, patient) => {
          acc[patient.id] = patient;
          return acc;
        }, {} as Record<string, Patient>);
        setPatients(patientMap);
        
        setLoading(false);
      }, 500);
    }
  }, [currentUser]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to create the appointment
    alert('In a real app, this would create a new appointment.');
    setShowForm(false);
    
    // Reset form
    setSelectedPatientId('');
    setAppointmentTitle('');
    setAppointmentType('consultation');
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentDuration(30);
    setAppointmentNotes('');
  };

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

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Appointments</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Schedule New Appointment
        </button>
      </div>

      {/* Appointment Creation Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text">Schedule New Appointment</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="patient" className="label">Patient</label>
                  <select 
                    id="patient" 
                    className="input" 
                    required
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    <option value="">Select a patient</option>
                    {Object.values(patients).map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="title" className="label">Title</label>
                  <input 
                    id="title" 
                    type="text" 
                    className="input" 
                    required
                    placeholder="e.g., Initial Consultation, Follow-up"
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="label">Type</label>
                  <select 
                    id="type" 
                    className="input" 
                    required
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                  >
                    <option value="consultation">Consultation</option>
                    <option value="urine_test">Urine Test</option>
                    <option value="ct_scan">CT Scan</option>
                    <option value="surgery">Surgery</option>
                    <option value="radiation_therapy">Radiation Therapy</option>
                    <option value="chemotherapy">Chemotherapy</option>
                    <option value="immunotherapy">Immunotherapy</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="label">Date</label>
                    <input 
                      id="date" 
                      type="date" 
                      className="input" 
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="label">Time</label>
                    <input 
                      id="time" 
                      type="time" 
                      className="input" 
                      required
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="duration" className="label">Duration (minutes)</label>
                  <input 
                    id="duration" 
                    type="number" 
                    className="input" 
                    required
                    min="5"
                    max="480"
                    step="5"
                    value={appointmentDuration}
                    onChange={(e) => setAppointmentDuration(parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="label">Notes (optional)</label>
                  <textarea 
                    id="notes" 
                    className="input" 
                    rows={3}
                    placeholder="Any special instructions or notes for this appointment"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-3">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-lg text-gray-500">No appointments scheduled.</p>
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
                          {patients[appointment.patientId]?.name || 'Unknown Patient'}
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
                        {appointment.title} - {appointment.duration} minutes
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                      
                      <div className="mt-2 flex space-x-2">
                        <button className="text-xs text-primary hover:text-primary/80">
                          Edit
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      </div>
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