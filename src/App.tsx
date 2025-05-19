import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Auth pages
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Layout
import AuthLayout from './components/Layout/AuthLayout';

// Patient pages
import AppointmentsPage from './pages/patient/AppointmentsPage';
import MedicalHistoryPage from './pages/patient/MedicalHistoryPage';
import ResultsPage from './pages/patient/ResultsPage';
import MessagesPage from './pages/patient/MessagesPage';
import MentalAidPage from './pages/patient/MentalAidPage';

// Doctor pages
import DoctorDashboardPage from './pages/doctor/DashboardPage';
import DoctorPatientsPage from './pages/doctor/PatientsPage';
import DoctorAppointmentsPage from './pages/doctor/AppointmentsPage';
import DoctorResultsPage from './pages/doctor/ResultsPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Main App component
function AppContent() {
  const { currentUser } = useAuth();
  const isDoctor = currentUser?.role === 'doctor';

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        {/* Patient routes */}
        {!isDoctor && (
          <>
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/medical-history" element={<MedicalHistoryPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/mental-aid" element={<MentalAidPage />} />
          </>
        )}

        {/* Doctor routes */}
        {isDoctor && (
          <>
            <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/results" element={<DoctorResultsPage />} />
          </>
        )}

        {/* Redirect based on user role */}
        <Route 
          path="*" 
          element={
            <Navigate to={isDoctor ? "/doctor/dashboard" : "/appointments"} />
          } 
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
