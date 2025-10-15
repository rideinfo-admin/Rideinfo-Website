import { useState, useEffect } from 'react';
import { supabase, Institute } from '../lib/supabase';
import { Plus, Building2, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from '../components/Navbar';

type InstitutesProps = {
  onInstituteClick: (instituteId: string, instituteName: string) => void;
  onNavigate: (page: 'institutes' | 'analysis') => void;
};

export default function Institutes({ onInstituteClick, onNavigate }: InstitutesProps) {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_number: '',
    email: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = institutes.filter(
        (inst) =>
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInstitutes(filtered);
    } else {
      setFilteredInstitutes(institutes);
    }
  }, [searchQuery, institutes]);

  const fetchInstitutes = async () => {
    try {
      const { data, error } = await supabase
        .from('institutes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstitutes(data || []);
      setFilteredInstitutes(data || []);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitute = async () => {
    if (!formData.name.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('institutes')
        .insert([{ ...formData, user_id: user.id }]);

      if (error) throw error;

      setFormData({
        name: '',
        address: '',
        contact_number: '',
        email: '',
        city: '',
        state: ''
      });
      setShowAddModal(false);
      fetchInstitutes();
    } catch (error) {
      console.error('Error adding institute:', error);
    }
  };

  const handleCardClick = (institute: Institute) => {
    onInstituteClick(institute.id, institute.name);
  };

  const handleEditClick = (e: React.MouseEvent, institute: Institute) => {
    e.stopPropagation();
    setSelectedInstitute(institute);
    setFormData({
      name: institute.name,
      address: institute.address || '',
      contact_number: institute.contact_number || '',
      email: institute.email || '',
      city: institute.city || '',
      state: institute.state || ''
    });
    setIsEditing(true);
    setShowDetailsModal(true);
  };

  const handleSave = async () => {
    if (!selectedInstitute || !formData.name.trim()) return;

    try {
      const { error } = await supabase
        .from('institutes')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', selectedInstitute.id);

      if (error) throw error;

      setIsEditing(false);
      setShowDetailsModal(false);
      fetchInstitutes();
    } catch (error) {
      console.error('Error updating institute:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedInstitute) return;

    try {
      const { error } = await supabase
        .from('institutes')
        .delete()
        .eq('id', selectedInstitute.id);

      if (error) throw error;

      setShowDetailsModal(false);
      setShowDeleteConfirm(false);
      fetchInstitutes();
    } catch (error) {
      console.error('Error deleting institute:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar
        currentPage="institutes"
        onNavigate={onNavigate}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-3 min-h-[200px]"
              >
                <div className="bg-blue-100 p-4 rounded-full">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Add Institute</span>
              </button>

              {filteredInstitutes.map((institute) => (
                <div
                  key={institute.id}
                  onClick={() => handleCardClick(institute)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 flex flex-col min-h-[200px] border border-gray-100 relative"
                >
                  <button
                    onClick={(e) => handleEditClick(e, institute)}
                    className="absolute top-4 right-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <div className="flex flex-col items-center justify-center gap-4 flex-1">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-full">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-800">{institute.name}</h3>
                      {institute.city && (
                        <p className="text-sm text-gray-600 mt-1">{institute.city}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInstitutes.length === 0 && !loading && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchQuery ? 'No institutes found matching your search.' : 'No institutes yet. Add your first institute to get started.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Institute">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institute Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter institute name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter state"
              />
            </div>
          </div>

          <button
            onClick={handleAddInstitute}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Institute
          </button>
        </div>
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Institute Details">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institute Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-700"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-700"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Institute"
        message="Are you sure you want to delete this institute? This will also delete all associated drivers."
      />
    </div>
  );
}
