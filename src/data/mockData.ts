import type { User, Patient, Doctor, Appointment, TestResult, Message, Medication } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Doctors
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    email: 'dr.smith@hospital.com',
    name: 'Dr. John Smith',
    role: 'doctor',
    specialty: 'Oncology',
    patients: ['1', '2', '3']
  },
  {
    id: '2',
    email: 'dr.johnson@hospital.com',
    name: 'Dr. Emily Johnson',
    role: 'doctor',
    specialty: 'Nuclear Medicine',
    patients: ['4', '5']
  }
];

// Patients
export const mockPatients: Patient[] = [
  {
    id: '1',
    email: 'michael.brown@example.com',
    name: 'Michael Brown',
    role: 'patient',
    doctorId: '1',
    allergies: ['Penicillin', 'Dust'],
    diagnoses: ['Lung Cancer Stage II'],
    specialNeeds: ['Wheelchair access'],
    medications: [
      {
        id: '101',
        name: 'Paclitaxel',
        dosage: '175 mg/m²',
        frequency: 'Every 3 weeks',
        startDate: '2025-01-15',
        isActive: true
      }
    ]
  },
  {
    id: '2',
    email: 'sarah.jones@example.com',
    name: 'Sarah Jones',
    role: 'patient',
    doctorId: '1',
    allergies: ['Sulfa drugs'],
    diagnoses: ['Breast Cancer Stage I'],
    specialNeeds: [],
    medications: [
      {
        id: '102',
        name: 'Tamoxifen',
        dosage: '20 mg',
        frequency: 'Daily',
        startDate: '2025-02-10',
        isActive: true
      }
    ]
  },
  {
    id: '3',
    email: 'robert.wilson@example.com',
    name: 'Robert Wilson',
    role: 'patient',
    doctorId: '1',
    allergies: [],
    diagnoses: ['Brain Tumor - Glioblastoma'],
    specialNeeds: ['Cognitive assistance'],
    medications: [
      {
        id: '103',
        name: 'Temozolomide',
        dosage: '150 mg/m²',
        frequency: 'Daily for 5 days every 28 days',
        startDate: '2025-03-01',
        isActive: true
      }
    ]
  },
  {
    id: '4',
    email: 'jennifer.davis@example.com',
    name: 'Jennifer Davis',
    role: 'patient',
    doctorId: '2',
    allergies: ['Contrast dye', 'Iodine'],
    diagnoses: ['Thyroid Cancer'],
    specialNeeds: [],
    medications: [
      {
        id: '104',
        name: 'Levothyroxine',
        dosage: '125 mcg',
        frequency: 'Daily',
        startDate: '2025-01-20',
        isActive: true
      }
    ]
  },
  {
    id: '5',
    email: 'david.miller@example.com',
    name: 'David Miller',
    role: 'patient',
    doctorId: '2',
    allergies: ['Shellfish'],
    diagnoses: ['Colon Cancer Stage III'],
    specialNeeds: ['Dietary restrictions'],
    medications: [
      {
        id: '105',
        name: 'Fluorouracil',
        dosage: '425 mg/m²',
        frequency: 'Daily for 5 days every 28 days',
        startDate: '2025-02-15',
        isActive: true
      },
      {
        id: '106',
        name: 'Oxaliplatin',
        dosage: '85 mg/m²',
        frequency: 'Every 2 weeks',
        startDate: '2025-02-15',
        isActive: true
      }
    ]
  }
];

// Combined users for auth
export const mockUsers: User[] = [
  ...mockDoctors,
  ...mockPatients
];

// Appointments
const today = new Date();
const getDate = (daysFromNow: number) => {
  const date = new Date(today);
  date.setDate(today.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    title: 'Initial Consultation',
    type: 'consultation',
    date: getDate(3),
    time: '09:00',
    duration: 60,
    notes: 'First appointment after diagnosis',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '1',
    title: 'Urine Test',
    type: 'urine_test',
    date: getDate(10),
    time: '10:30',
    duration: 30,
    status: 'scheduled'
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '1',
    title: 'CT Scan',
    type: 'ct_scan',
    date: getDate(40),
    time: '14:00',
    duration: 45,
    status: 'scheduled'
  },
  {
    id: '4',
    patientId: '2',
    doctorId: '1',
    title: 'Follow-up Consultation',
    type: 'consultation',
    date: getDate(5),
    time: '11:00',
    duration: 45,
    status: 'scheduled'
  },
  {
    id: '5',
    patientId: '2',
    doctorId: '1',
    title: 'Chemotherapy Session',
    type: 'chemotherapy',
    date: getDate(7),
    time: '13:00',
    duration: 180,
    status: 'scheduled'
  },
  {
    id: '6',
    patientId: '3',
    doctorId: '1',
    title: 'Radiation Therapy',
    type: 'radiation_therapy',
    date: getDate(2),
    time: '15:30',
    duration: 60,
    status: 'scheduled'
  },
  {
    id: '7',
    patientId: '4',
    doctorId: '2',
    title: 'Initial Consultation',
    type: 'consultation',
    date: getDate(1),
    time: '09:30',
    duration: 60,
    status: 'scheduled'
  },
  {
    id: '8',
    patientId: '5',
    doctorId: '2',
    title: 'Surgery Prep Discussion',
    type: 'consultation',
    date: getDate(4),
    time: '14:30',
    duration: 45,
    status: 'scheduled'
  },
  {
    id: '9',
    patientId: '5',
    doctorId: '2',
    title: 'Tumor Removal Surgery',
    type: 'surgery',
    date: getDate(15),
    time: '08:00',
    duration: 240,
    notes: 'Patient should fast from midnight before procedure',
    status: 'scheduled'
  }
];

// Test Results
export const mockTestResults: TestResult[] = [
  {
    id: '1',
    patientId: '1',
    appointmentId: '2',
    type: 'Urine Analysis',
    date: getDate(-30),
    results: 'Normal kidney function. No indications of infection.',
    doctorNotes: 'Patient cleared for CT scan with contrast.'
  },
  {
    id: '2',
    patientId: '2',
    appointmentId: '4',
    type: 'Blood Work',
    date: getDate(-45),
    results: 'White blood cell count slightly elevated. Hemoglobin normal.',
    doctorNotes: 'Monitor WBC count at next visit.'
  },
  {
    id: '3',
    patientId: '3',
    appointmentId: '6',
    type: 'MRI Scan',
    date: getDate(-60),
    results: 'Tumor size reduced by 15% since last scan.',
    doctorNotes: 'Positive response to radiation therapy. Continue current treatment plan.'
  }
];

// Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'system',
    receiverId: '1',
    content: 'Your upcoming CT scan appointment is in 7 days. Please ensure you complete your urine test before this date.',
    timestamp: getDate(-2) + 'T10:30:00',
    isRead: true,
    isSystemMessage: true
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '1',
    content: 'Hello Michael, please remember to bring your medication list to our next appointment.',
    timestamp: getDate(-5) + 'T14:15:00',
    isRead: true,
    isSystemMessage: false
  },
  {
    id: '3',
    senderId: 'system',
    receiverId: '2',
    content: 'Your chemotherapy session has been scheduled for next week.',
    timestamp: getDate(-1) + 'T09:45:00',
    isRead: false,
    isSystemMessage: true
  },
  {
    id: '4',
    senderId: '2',
    receiverId: '5',
    content: 'David, your pre-surgery tests look good. We\'ll discuss the details at our next appointment.',
    timestamp: getDate(-3) + 'T16:20:00',
    isRead: true,
    isSystemMessage: false
  }
]; 