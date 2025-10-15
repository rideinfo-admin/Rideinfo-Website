import { useState, useEffect } from 'react';
import { supabase, Institute, Driver } from '../lib/supabase';
import { Building2, Bus, Users, TrendingUp, Send } from 'lucide-react';
import Navbar from '../components/Navbar';

type AnalysisProps = {
  onNavigate: (page: 'institutes' | 'analysis') => void;
};

export default function Analysis({ onNavigate }: AnalysisProps) {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [institutesResult, driversResult] = await Promise.all([
        supabase.from('institutes').select('*'),
        supabase.from('drivers').select('*')
      ]);

      if (institutesResult.error) throw institutesResult.error;
      if (driversResult.error) throw driversResult.error;

      setInstitutes(institutesResult.data || []);
      setDrivers(driversResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const inactiveDrivers = drivers.filter(d => d.status === 'inactive').length;

  const instituteDriverCounts = institutes.map(inst => ({
    name: inst.name,
    count: drivers.filter(d => d.institute_id === inst.id).length
  }));

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('feedback')
        .insert([{
          user_id: user.id,
          message: feedbackMessage,
          rating: feedbackRating
        }]);

      if (error) throw error;

      setFeedbackMessage('');
      setFeedbackRating(5);
      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar
        currentPage="analysis"
        onNavigate={onNavigate}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Analysis & Feedback</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Institutes</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{institutes.length}</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Drivers</p>
                    <p className="text-3xl font-bold text-cyan-600 mt-2">{drivers.length}</p>
                  </div>
                  <div className="bg-cyan-100 p-4 rounded-full">
                    <Bus className="w-8 h-8 text-cyan-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Drivers</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{activeDrivers}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Inactive Drivers</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{inactiveDrivers}</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-full">
                    <TrendingUp className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Drivers by Institute</h3>
                {instituteDriverCounts.length > 0 ? (
                  <div className="space-y-4">
                    {instituteDriverCounts.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{
                                width: `${drivers.length > 0 ? (item.count / drivers.length) * 100 : 0}%`
                              }}
                            />
                          </div>
                          <span className="text-gray-800 font-bold w-8 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No data available</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Driver Status Distribution</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-48">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${drivers.length > 0 ? (activeDrivers / drivers.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-gray-800 font-bold w-16 text-right">
                        {activeDrivers} ({drivers.length > 0 ? Math.round((activeDrivers / drivers.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Inactive</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-48">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${drivers.length > 0 ? (inactiveDrivers / drivers.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-gray-800 font-bold w-16 text-right">
                        {inactiveDrivers} ({drivers.length > 0 ? Math.round((inactiveDrivers / drivers.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Total Drivers:</span> {drivers.length}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-bold">Average per Institute:</span>{' '}
                      {institutes.length > 0 ? (drivers.length / institutes.length).toFixed(1) : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Institute Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-700 font-semibold">Institute Name</th>
                        <th className="text-left py-3 px-4 text-gray-700 font-semibold">City</th>
                        <th className="text-left py-3 px-4 text-gray-700 font-semibold">State</th>
                        <th className="text-left py-3 px-4 text-gray-700 font-semibold">Contact</th>
                        <th className="text-center py-3 px-4 text-gray-700 font-semibold">Drivers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutes.map((inst) => (
                        <tr key={inst.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-gray-800 font-medium">{inst.name}</td>
                          <td className="py-3 px-4 text-gray-600">{inst.city || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{inst.state || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{inst.contact_number || 'N/A'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {drivers.filter(d => d.institute_id === inst.id).length}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {institutes.length === 0 && (
                    <p className="text-gray-600 text-center py-8">No institutes available</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 lg:col-span-2 mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Send Us Your Feedback</h3>
                <p className="text-gray-600 mb-6">We value your opinion! Let us know how we can improve the Rideinfo platform.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className={`text-3xl transition ${
                            star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Share your thoughts, suggestions, or report any issues..."
                      rows={5}
                    />
                  </div>

                  {feedbackSubmitted && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      Thank you for your feedback! We appreciate your input.
                    </div>
                  )}

                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackMessage.trim()}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
