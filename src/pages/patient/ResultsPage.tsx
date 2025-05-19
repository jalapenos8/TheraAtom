import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTestResults } from '../../data/mockData';
import type { TestResult } from '../../types';

const ResultsPage = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const patientResults = mockTestResults.filter(
          (result) => result.patientId === currentUser.id
        );
        setResults(patientResults);
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
        <h1 className="text-2xl font-bold text-text">Test Results</h1>
        <p className="text-gray-600">View your test and procedure results</p>
      </div>

      {results.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-lg text-gray-500">No test results available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result) => (
            <div key={result.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-medium text-text">{result.type}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Completed
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
                        <span>View Attachment {index + 1}</span>
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