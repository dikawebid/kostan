import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useFacilities } from '../hooks/useFacilities';
import { addFacility, updateFacility, deleteFacility } from '../services/facilityService';
import { Facility } from '../types';

const FacilityManager: React.FC = () => {
  const { facilities, loading, error, refetch } = useFacilities(true);
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState<Partial<Facility>>({
    name: '',
    icon: '',
    description: '',
    category: 'basic'
  });

  const handleInputChange = (field: keyof Facility, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFacility) {
        await updateFacility(editingFacility.id, formData);
      } else {
        await addFacility(formData as Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Gagal menyimpan data fasilitas');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      try {
        await deleteFacility(id);
        refetch();
      } catch (error) {
        console.error('Error deleting facility:', error);
        alert('Gagal menghapus fasilitas');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      description: '',
      category: 'basic'
    });
    setIsAddingFacility(false);
    setEditingFacility(null);
  };

  const startEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData(facility);
    setIsAddingFacility(true);
  };

  const groupedFacilities = facilities.reduce((acc, facility) => {
    if (!acc[facility.category]) {
      acc[facility.category] = [];
    }
    acc[facility.category].push(facility);
    return acc;
  }, {} as Record<string, Facility[]>);

  const categoryLabels = {
    basic: 'Fasilitas Dasar',
    comfort: 'Fasilitas Kenyamanan',
    premium: 'Fasilitas Premium'
  };

  const categoryColors = {
    basic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    comfort: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manajemen Fasilitas
        </h2>
        <button
          onClick={() => setIsAddingFacility(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Fasilitas</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAddingFacility && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama Fasilitas
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                placeholder="WiFi, AC, dll"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon (Lucide React)
              </label>
              <input
                type="text"
                value={formData.icon || ''}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                placeholder="wifi, snowflake, bath, dll"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori
              </label>
              <select
                value={formData.category || 'basic'}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="basic">Fasilitas Dasar</option>
                <option value="comfort">Fasilitas Kenyamanan</option>
                <option value="premium">Fasilitas Premium</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deskripsi
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                placeholder="Deskripsi singkat fasilitas"
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{editingFacility ? 'Update' : 'Simpan'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Facilities List by Category */}
      <div className="space-y-6">
        {Object.entries(groupedFacilities).map(([category, categoryFacilities]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[category as keyof typeof categoryColors]}`}>
                  {categoryFacilities.length} fasilitas
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {facility.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {facility.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Icon: {facility.icon}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => startEdit(facility)}
                          className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(facility.id)}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {facilities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Belum ada fasilitas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tambahkan fasilitas pertama untuk mulai mengelola data
          </p>
        </div>
      )}
    </div>
  );
};

export default FacilityManager;