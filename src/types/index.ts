export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
}

export interface Patient extends User {
  role: 'patient';
  doctorId: string;
  allergies: string[];
  diagnoses: string[];
  specialNeeds: string[];
  medications: Medication[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  patients: string[]; // Array of patient IDs
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  type: AppointmentType;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  status: AppointmentStatus;
}

export type AppointmentType = 
  | 'consultation' 
  | 'urine_test' 
  | 'ct_scan' 
  | 'surgery' 
  | 'radiation_therapy' 
  | 'chemotherapy' 
  | 'immunotherapy';

export type AppointmentStatus = 
  | 'scheduled' 
  | 'completed' 
  | 'cancelled' 
  | 'missed';

export interface TestResult {
  id: string;
  patientId: string;
  appointmentId: string;
  type: string;
  date: string;
  results: string;
  doctorNotes?: string;
  attachments?: string[]; // URLs to attachments
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isSystemMessage: boolean;
} 