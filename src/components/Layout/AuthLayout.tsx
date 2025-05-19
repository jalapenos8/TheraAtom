import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChatBot } from '../ChatBot/ChatBot';

import {
  UserIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const AuthLayout = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isDoctor = currentUser?.role === 'doctor';
  const isPatient = currentUser?.role === 'patient';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const navLinks = [
    {
      to: isDoctor ? '/doctor/dashboard' : '/appointments',
      icon: <CalendarIcon className="w-6 h-6" />,
      label: isDoctor ? 'Dashboard' : 'Appointments',
      matchPaths: isDoctor ? ['/doctor/dashboard'] : ['/appointments']
    },
    ...(isPatient ? [
      {
        to: '/medical-history',
        icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
        label: 'Medical History',
        matchPaths: ['/medical-history']
      },
      {
        to: '/results',
        icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
        label: 'Results',
        matchPaths: ['/results']
      },
      {
        to: '/messages',
        icon: <BellIcon className="w-6 h-6" />,
        label: 'Messages',
        matchPaths: ['/messages']
      },
      {
        to: '/mental-aid',
        icon: <HeartIcon className="w-6 h-6" />,
        label: 'Mental Aid',
        matchPaths: ['/mental-aid']
      }
    ] : []),
    ...(isDoctor ? [
      {
        to: '/doctor/patients',
        icon: <UserIcon className="w-6 h-6" />,
        label: 'Patients',
        matchPaths: ['/doctor/patients']
      },
      {
        to: '/doctor/appointments',
        icon: <CalendarIcon className="w-6 h-6" />,
        label: 'Appointments',
        matchPaths: ['/doctor/appointments']
      },
      {
        to: '/doctor/results',
        icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
        label: 'Results',
        matchPaths: ['/doctor/results']
      }
    ] : [])
  ];

  const isLinkActive = (matchPaths: string[]) => {
    return matchPaths.some(path => location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Nuclear Medicine Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="font-medium">
                {currentUser?.name} ({currentUser?.role})
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-primary/80"
              aria-label="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>
            
            <button 
              className="md:hidden p-2 rounded-full hover:bg-primary/80"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
          pt-20 md:pt-0 mt-0 md:mt-0
        `}>
          <nav className="px-2 pt-5">
            <ul className="space-y-1">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md
                      ${isLinkActive(link.matchPaths) 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Chat Bot */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`${isChatOpen ? 'block' : 'hidden'} mb-4 w-72 bg-white rounded-lg shadow-lg`}>
          <ChatBot onClose={() => setIsChatOpen(false)} />
        </div>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-secondary text-white p-3 rounded-full shadow-lg hover:bg-secondary/90"
          aria-label="Chat with assistant"
        >
          {isChatOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Need help?</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AuthLayout; 