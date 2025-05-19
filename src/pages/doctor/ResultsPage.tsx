import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTestResults, mockPatients } from '../../data/mockData';
import type { TestResult, Patient } from '../../types';

const ResultsPage = () => {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [loading, setLoading] = useState(true);
  
  // For the result upload form
  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [resultType, setResultType] = useState('');
  const [resultDetails, setResultDetails] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Get all test results for patients of this doctor
        const doctorPatients = mockPatients.filter(
          patient => patient.doctorId === currentUser.id
        );
        
        const patientIds = doctorPatients.map(patient => patient.id);
        const filteredResults = mockTestResults.filter(
          result => patientIds.includes(result.patientId)
        );
        
        setTestResults(filteredResults);
        
        // Create a map of patient data for quick lookup
        const patientMap = doctorPatients.reduce((acc, patient) => {
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
    // In a real app, this would make an API call to create the result
    alert('In a real app, this would upload a new test result.');
    setShowForm(false);
    
    // Reset form
    setSelectedPatientId('');
    setResultType('');
    setResultDetails('');
    setDoctorNotes('');
  };

  if (loading) {
    return <div className="flex justify-center items-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Test Results</h1>
          <p className="text-gray-600">View and upload patient test results</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Upload New Result
        </button>
      </div>

      {/* Result Upload Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text">Upload New Test Result</h2>
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
                  <label htmlFor="type" className="label">Test Type</label>
                  <input 
                    id="type" 
                    type="text" 
                    className="input" 
                    required
                    placeholder="e.g., Blood Test, CT Scan, MRI, etc."
                    value={resultType}
                    onChange={(e) => setResultType(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="results" className="label">Result Details</label>
                  <textarea 
                    id="results" 
                    className="input" 
                    rows={4}
                    required
                    placeholder="Enter test results and findings"
                    value={resultDetails}
                    onChange={(e) => setResultDetails(e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="notes" className="label">Doctor's Notes</label>
                  <textarea 
                    id="notes" 
                    className="input" 
                    rows={3}
                    placeholder="Optional notes regarding the results"
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <label className="label">Attachments (Optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H4m32-12L20 32l-4-4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
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
                    Upload Result
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {testResults.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-lg text-gray-500">No test results available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {testResults.map((result) => (
            <div key={result.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-medium text-text">
                    {result.type} - {patients[result.patientId]?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="btn btn-outline text-xs py-1 px-2">Edit</button>
                  <button className="btn btn-secondary text-xs py-1 px-2">Download</button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <h3 className="text-md font-medium text-text mb-2">Results</h3>
                <p className="text-gray-700 whitespace-pre-line">{result.results}</p>
              </div>
              
              {result.doctorNotes && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <h3 className="text-md font-medium text-text mb-2">Doctor's Notes</h3>
                  <p className="text-gray-700">{result.doctorNotes}</p>
                </div>
              )}
              
              {result.attachments && result.attachments.length > 0 && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <h3 className="text-md font-medium text-text mb-2">Attachments</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>Attachment {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage; 