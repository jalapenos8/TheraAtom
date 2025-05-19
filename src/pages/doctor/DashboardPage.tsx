import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments, mockPatients } from '../../data/mockData';
import type { Appointment, Patient } from '../../types';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const doctorAppointments = mockAppointments.filter(
          (appointment) => appointment.doctorId === currentUser.id
        );
        
        // Get today's appointments
        const todayApps = doctorAppointments.filter(app => app.date === today);
        setTodayAppointments(todayApps);
        
        // Get upcoming appointments (next 7 days, excluding today)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        
        const upcoming = doctorAppointments.filter(
          app => app.date > today && app.date <= nextWeekStr
        ).slice(0, 5); // Limit to 5 upcoming appointments
        setUpcomingAppointments(upcoming);
        
        // Get patients
        const doctorPatients = mockPatients.filter(
          patient => patient.doctorId === currentUser.id
        );
        setPatients(doctorPatients);
        
        setLoading(false);
      }, 500);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. {currentUser?.name.split(' ')[1]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-text">Today's Appointments</h2>
            <Link to="/doctor/appointments" className="text-secondary hover:underline text-sm font-medium">
              View All
            </Link>
          </div>
          
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50">
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="text-lg font-medium">{appointment.time}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-md font-medium text-text">
                        {patient?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.title} ({appointment.duration} min)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Patient Stats */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">Patient Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm text-blue-800 font-medium">Total Patients</h3>
              <p className="text-2xl font-bold text-text mt-1">{patients.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm text-green-800 font-medium">Today's Visits</h3>
              <p className="text-2xl font-bold text-text mt-1">{todayAppointments.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm text-purple-800 font-medium">Upcoming CT Scans</h3>
              <p className="text-2xl font-bold text-text mt-1">
                {mockAppointments.filter(a => a.doctorId === currentUser?.id && a.type === 'ct_scan').length}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-sm text-orange-800 font-medium">Urine Tests</h3>
              <p className="text-2xl font-bold text-text mt-1">
                {mockAppointments.filter(a => a.doctorId === currentUser?.id && a.type === 'urine_test').length}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-text">Upcoming Appointments</h2>
            <Link to="/doctor/appointments" className="text-secondary hover:underline text-sm font-medium">
              View All
            </Link>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments in the next week.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <span className="text-md font-medium">{appointment.time}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-md font-medium text-text">
                        {patient?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/doctor/appointments" className="btn btn-primary flex items-center justify-center h-20">
              Schedule Appointment
            </Link>
            <Link to="/doctor/patients" className="btn btn-secondary flex items-center justify-center h-20">
              View Patient List
            </Link>
            <Link to="/doctor/results" className="btn btn-outline flex items-center justify-center h-20">
              Upload Results
            </Link>
            <button className="btn flex items-center justify-center h-20 bg-gray-100 text-gray-800 hover:bg-gray-200">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 