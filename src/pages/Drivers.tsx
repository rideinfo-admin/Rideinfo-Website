import { useState, useEffect } from 'react';
import { supabase, Driver } from '../lib/supabase';
import { Plus, Bus, ArrowLeft, Edit2, Trash2, Eye, FileText, FileStack } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from '../components/Navbar';

type DriversProps = {
  instituteId: string;
  instituteName: string;
  onBack: () => void;
  onNavigate: (page: 'institutes' | 'analysis') => void;
};

export default function Drivers({ instituteId, instituteName, onBack, onNavigate }: DriversProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [bulkData, setBulkData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    bus_number: '',
    contact_number: '',
    email: '',
    license_number: '',
    address: '',
    emergency_contact: '',
    blood_group: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    fetchDrivers();
  }, [instituteId]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = drivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.bus_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.contact_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrivers(filtered);
    } else {
      setFilteredDrivers(drivers);
    }
  }, [searchQuery, drivers]);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('institute_id', instituteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
      setFilteredDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bus_number: '',
      contact_number: '',
      email: '',
      license_number: '',
      address: '',
      emergency_contact: '',
      blood_group: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active'
    });
  };

  const handleAddSingle = async () => {
    if (!formData.name.trim() || !formData.bus_number.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('drivers')
        .insert([{
          ...formData,
          institute_id: instituteId,
          user_id: user.id
        }]);

      if (error) throw error;

      resetForm();
      setShowAddModal(false);
      setShowAddTypeModal(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const handleAddBulk = async () => {
    if (!bulkData.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const lines = bulkData.split('\n').filter(line => line.trim());
      const driversToAdd = lines.map(line => {
        const [name, busNumber] = line.split(',').map(s => s.trim());
        return {
          name: name || 'Unknown',
          bus_number: busNumber || 'N/A',
          institute_id: instituteId,
          user_id: user.id,
          contact_number: '',
          email: '',
          license_number: '',
          address: '',
          emergency_contact: '',
          blood_group: '',
          joining_date: new Date().toISOString().split('T')[0],
          status: 'active'
        };
      });

      const { error } = await supabase
        .from('drivers')
        .insert(driversToAdd);

      if (error) throw error;

      setBulkData('');
      setShowBulkModal(false);
      setShowAddTypeModal(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error adding bulk drivers:', error);
    }
  };

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      bus_number: driver.bus_number,
      contact_number: driver.contact_number || '',
      email: driver.email || '',
      license_number: driver.license_number || '',
      address: driver.address || '',
      emergency_contact: driver.emergency_contact || '',
      blood_group: driver.blood_group || '',
      joining_date: driver.joining_date || new Date().toISOString().split('T')[0],
      status: driver.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDriver || !formData.name.trim() || !formData.bus_number.trim()) return;

    try {
      const { error } = await supabase
        .from('drivers')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedDriver.id);

      if (error) throw error;

      setShowEditModal(false);
      resetForm();
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedDriver) return;

    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', selectedDriver.id);

      if (error) throw error;

      setShowViewModal(false);
      setShowEditModal(false);
      setShowDeleteConfirm(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  const handleBackClick = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <Navbar
        currentPage="drivers"
        onNavigate={(page) => {
          if (page === 'institutes') {
            onBack();
          } else {
            onNavigate(page);
          }
        }}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        title={instituteName}
      />

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Institutes</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <button
                onClick={() => setShowAddTypeModal(true)}
                className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-cyan-500 hover:bg-cyan-50 transition flex flex-col items-center justify-center gap-3 min-h-[200px]"
              >
                <div className="bg-cyan-100 p-4 rounded-full">
                  <Plus className="w-8 h-8 text-cyan-600" />
                </div>
                <span className="text-gray-700 font-medium">Add Driver</span>
              </button>

              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
                >
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <div className={`p-4 rounded-full ${driver.status === 'active' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gray-400'}`}>
                      <Bus className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-800">{driver.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Bus: {driver.bus_number}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {driver.status || 'active'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(driver)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(driver)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDrivers.length === 0 && !loading && (
              <div className="text-center py-12">
                <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchQuery ? 'No drivers found matching your search.' : 'No drivers yet. Add your first driver to get started.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={showAddTypeModal} onClose={() => setShowAddTypeModal(false)} title="Add Driver">
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowAddTypeModal(false);
              resetForm();
              setShowAddModal(true);
            }}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition"
          >
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Single Driver</h3>
              <p className="text-sm text-gray-600">Add one driver at a time</p>
            </div>
          </button>

          <button
            onClick={() => {
              setShowAddTypeModal(false);
              setShowBulkModal(true);
            }}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg hover:border-cyan-400 transition"
          >
            <div className="bg-cyan-500 p-3 rounded-lg">
              <FileStack className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Bulk Upload</h3>
              <p className="text-sm text-gray-600">Add multiple drivers at once</p>
            </div>
          </button>
        </div>
      </Modal>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Single Driver">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Enter driver name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus Number *
              </label>
              <input
                type="text"
                value={formData.bus_number}
                onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Enter bus number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Enter contact"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Enter license no."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="Enter address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                placeholder="Emergency contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleAddSingle}
            className="w-full bg-cyan-600 text-white py-2 rounded-lg font-medium hover:bg-cyan-700 transition"
          >
            Add Driver
          </button>
        </div>
      </Modal>

      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Upload Drivers">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Driver Data
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Format: Name, Bus Number (one per line)
            </p>
            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              placeholder="John Doe, BUS-001&#10;Jane Smith, BUS-002&#10;Bob Johnson, BUS-003"
              rows={8}
            />
          </div>
          <button
            onClick={handleAddBulk}
            className="w-full bg-cyan-600 text-white py-2 rounded-lg font-medium hover:bg-cyan-700 transition"
          >
            Upload Drivers
          </button>
        </div>
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Driver Details">
        {selectedDriver && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg text-center">
              <div className={`p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center ${
                selectedDriver.status === 'active' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gray-400'
              }`}>
                <Bus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{selectedDriver.name}</h3>
              <p className="text-gray-600 mt-2">Bus Number: {selectedDriver.bus_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Contact</p>
                <p className="font-medium text-gray-800">{selectedDriver.contact_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{selectedDriver.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">License No.</p>
                <p className="font-medium text-gray-800">{selectedDriver.license_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Group</p>
                <p className="font-medium text-gray-800">{selectedDriver.blood_group || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Emergency Contact</p>
                <p className="font-medium text-gray-800">{selectedDriver.emergency_contact || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Joining Date</p>
                <p className="font-medium text-gray-800">{selectedDriver.joining_date || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-medium text-gray-800">{selectedDriver.address || 'N/A'}</p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete Driver
            </button>
          </div>
        )}
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Driver">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus Number *
              </label>
              <input
                type="text"
                value={formData.bus_number}
                onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
      />
    </div>
  );
}
