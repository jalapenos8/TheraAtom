import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockPatients } from '../../data/mockData';
import type { Patient } from '../../types';

const MedicalHistoryPage = () => {
  const { currentUser } = useAuth();
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const patientInfo = mockPatients.find(patient => patient.id === currentUser.id);
        if (patientInfo) {
          setPatientData(patientInfo);
        }
        setLoading(false);
      }, 500);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center py-10">Loading...</div>;
  }

  if (!patientData) {
    return <div className="flex justify-center items-center py-10">Patient information not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Medical History</h1>
        <p className="text-gray-600">View your medical history and current medications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allergies */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">Allergies</h2>
          {patientData.allergies.length === 0 ? (
            <p className="text-gray-500">No known allergies</p>
          ) : (
            <ul className="space-y-2">
              {patientData.allergies.map((allergy, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {allergy}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Diagnoses */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">Diagnoses</h2>
          {patientData.diagnoses.length === 0 ? (
            <p className="text-gray-500">No diagnoses on record</p>
          ) : (
            <ul className="space-y-2">
              {patientData.diagnoses.map((diagnosis, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {diagnosis}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Special Needs */}
        <div className="card">
          <h2 className="text-lg font-medium text-text mb-4">Special Needs</h2>
          {patientData.specialNeeds.length === 0 ? (
            <p className="text-gray-500">No special needs on record</p>
          ) : (
            <ul className="space-y-2">
              {patientData.specialNeeds.map((need, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {need}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Medications */}
        <div className="col-span-1 md:col-span-2 card">
          <h2 className="text-lg font-medium text-text mb-4">Medications</h2>
          {patientData.medications.length === 0 ? (
            <p className="text-gray-500">No current medications</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientData.medications.map((medication) => (
                    <tr key={medication.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-text">{medication.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-600">{medication.dosage}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-600">{medication.frequency}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-600">{medication.startDate}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          medication.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {medication.isActive ? 'Active' : 'Discontinued'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage; 