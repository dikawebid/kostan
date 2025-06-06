import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MapPin, Settings, Info, Phone, Map, Bus, Store } from 'lucide-react';
import { useWebsiteConfig } from '../hooks/useWebsiteConfig';
import { updateWebsiteConfig, initializeDefaultConfig } from '../services/configService';
import { WebsiteConfig, AboutFeature, TransportationItem, NearbyFacility } from '../types';

const ConfigManager: React.FC = () => {
  const { config, loading, error, refetch } = useWebsiteConfig();
  const [formData, setFormData] = useState<Partial<WebsiteConfig>>({});
  const [activeTab, setActiveTab] = useState<'about' | 'rules' | 'contact' | 'location' | 'transport' | 'facilities'>('about');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWebsiteConfig(formData);
      await refetch();
      alert('Konfigurasi berhasil disimpan!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  const handleInitialize = async () => {
    if (window.confirm('Apakah Anda yakin ingin menginisialisasi konfigurasi default? Data yang ada akan ditimpa.')) {
      try {
        await initializeDefaultConfig();
        await refetch();
        alert('Konfigurasi default berhasil diinisialisasi!');
      } catch (error) {
        console.error('Error initializing config:', error);
        alert('Gagal menginisialisasi konfigurasi');
      }
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (field: string, subField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value
      }
    }));
  };

  const addAboutFeature = () => {
    const newFeature: AboutFeature = {
      id: Date.now().toString(),
      icon: 'Star',
      title: '',
      description: ''
    };
    
    updateFormData('aboutFeatures', [...(formData.aboutFeatures || []), newFeature]);
  };

  const updateAboutFeature = (index: number, field: string, value: string) => {
    const features = [...(formData.aboutFeatures || [])];
    features[index] = { ...features[index], [field]: value };
    updateFormData('aboutFeatures', features);
  };

  const removeAboutFeature = (index: number) => {
    const features = [...(formData.aboutFeatures || [])];
    features.splice(index, 1);
    updateFormData('aboutFeatures', features);
  };

  const addRule = () => {
    updateFormData('kostRules', [...(formData.kostRules || []), '']);
  };

  const updateRule = (index: number, value: string) => {
    const rules = [...(formData.kostRules || [])];
    rules[index] = value;
    updateFormData('kostRules', rules);
  };

  const removeRule = (index: number) => {
    const rules = [...(formData.kostRules || [])];
    rules.splice(index, 1);
    updateFormData('kostRules', rules);
  };

  const addTransportationItem = () => {
    const newItem: TransportationItem = {
      id: Date.now().toString(),
      name: '',
      distance: '',
      icon: 'MapPin'
    };
    
    updateFormData('transportationAccess', [...(formData.transportationAccess || []), newItem]);
  };

  const updateTransportationItem = (index: number, field: string, value: string) => {
    const items = [...(formData.transportationAccess || [])];
    items[index] = { ...items[index], [field]: value };
    updateFormData('transportationAccess', items);
  };

  const removeTransportationItem = (index: number) => {
    const items = [...(formData.transportationAccess || [])];
    items.splice(index, 1);
    updateFormData('transportationAccess', items);
  };

  const addNearbyFacility = () => {
    const newFacility: NearbyFacility = {
      id: Date.now().toString(),
      name: '',
      distance: '',
      category: 'other',
      icon: 'MapPin'
    };
    
    updateFormData('nearbyFacilities', [...(formData.nearbyFacilities || []), newFacility]);
  };

  const updateNearbyFacility = (index: number, field: string, value: string) => {
    const facilities = [...(formData.nearbyFacilities || [])];
    facilities[index] = { ...facilities[index], [field]: value };
    updateFormData('nearbyFacilities', facilities);
  };

  const removeNearbyFacility = (index: number) => {
    const facilities = [...(formData.nearbyFacilities || [])];
    facilities.splice(index, 1);
    updateFormData('nearbyFacilities', facilities);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading configuration...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={handleInitialize}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Inisialisasi Konfigurasi Default
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Konfigurasi Website
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={handleInitialize}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Settings className="h-5 w-5" />
            <span>Reset Default</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'about', label: 'Tentang', icon: Info },
              { id: 'rules', label: 'Peraturan', icon: Settings },
              { id: 'contact', label: 'Kontak', icon: Phone },
              { id: 'location', label: 'Lokasi', icon: MapPin },
              { id: 'transport', label: 'Transportasi', icon: Bus },
              { id: 'facilities', label: 'Fasilitas Terdekat', icon: Store }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Judul Section Tentang
                </label>
                <input
                  type="text"
                  value={formData.aboutTitle || ''}
                  onChange={(e) => updateFormData('aboutTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi Tentang
                </label>
                <textarea
                  value={formData.aboutDescription || ''}
                  onChange={(e) => updateFormData('aboutDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fitur Unggulan
                  </label>
                  <button
                    onClick={addAboutFeature}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData.aboutFeatures || []).map((feature, index) => (
                    <div key={feature.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Icon (Lucide)
                          </label>
                          <input
                            type="text"
                            value={feature.icon}
                            onChange={(e) => updateAboutFeature(index, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="MapPin, Shield, etc"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Judul
                          </label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => updateAboutFeature(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeAboutFeature(index)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Deskripsi
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateAboutFeature(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Peraturan Kost
                </h3>
                <button
                  onClick={addRule}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Peraturan</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.kostRules || []).map((rule, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`Peraturan ${index + 1}`}
                      />
                    </div>
                    <button
                      onClick={() => removeRule(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo?.phone || ''}
                    onChange={(e) => updateNestedFormData('contactInfo', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo?.whatsapp || ''}
                    onChange={(e) => updateNestedFormData('contactInfo', 'whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo?.email || ''}
                    onChange={(e) => updateNestedFormData('contactInfo', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo?.operatingHours || ''}
                    onChange={(e) => updateNestedFormData('contactInfo', 'operatingHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat Lengkap
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Jalan"
                    value={formData.contactInfo?.address?.street || ''}
                    onChange={(e) => updateFormData('contactInfo', {
                      ...formData.contactInfo,
                      address: { ...formData.contactInfo?.address, street: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Kota"
                    value={formData.contactInfo?.address?.city || ''}
                    onChange={(e) => updateFormData('contactInfo', {
                      ...formData.contactInfo,
                      address: { ...formData.contactInfo?.address, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Provinsi"
                    value={formData.contactInfo?.address?.province || ''}
                    onChange={(e) => updateFormData('contactInfo', {
                      ...formData.contactInfo,
                      address: { ...formData.contactInfo?.address, province: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Kode Pos"
                    value={formData.contactInfo?.address?.postalCode || ''}
                    onChange={(e) => updateFormData('contactInfo', {
                      ...formData.contactInfo,
                      address: { ...formData.contactInfo?.address, postalCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Pemilik
                </label>
                <input
                  type="text"
                  value={formData.contactInfo?.ownerName || ''}
                  onChange={(e) => updateNestedFormData('contactInfo', 'ownerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quote Pemilik
                </label>
                <textarea
                  value={formData.contactInfo?.ownerQuote || ''}
                  onChange={(e) => updateNestedFormData('contactInfo', 'ownerQuote', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location?.coordinates?.latitude || ''}
                    onChange={(e) => updateFormData('location', {
                      ...formData.location,
                      coordinates: { 
                        ...formData.location?.coordinates, 
                        latitude: parseFloat(e.target.value) || 0 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location?.coordinates?.longitude || ''}
                    onChange={(e) => updateFormData('location', {
                      ...formData.location,
                      coordinates: { 
                        ...formData.location?.coordinates, 
                        longitude: parseFloat(e.target.value) || 0 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zoom Level Peta
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.location?.mapZoom || 15}
                  onChange={(e) => updateNestedFormData('location', 'mapZoom', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location?.address || ''}
                  onChange={(e) => updateNestedFormData('location', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi Lokasi
                </label>
                <textarea
                  value={formData.location?.description || ''}
                  onChange={(e) => updateNestedFormData('location', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Map Preview */}
              {formData.location?.coordinates?.latitude && formData.location?.coordinates?.longitude && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview Peta</h4>
                  <div className="bg-gray-200 dark:bg-gray-600 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Lat: {formData.location.coordinates.latitude}<br />
                        Lng: {formData.location.coordinates.longitude}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${formData.location.coordinates.latitude},${formData.location.coordinates.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Lihat di Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transportation Tab */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Akses Transportasi
                </h3>
                <button
                  onClick={addTransportationItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.transportationAccess || []).map((item, index) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icon
                        </label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateTransportationItem(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Bus, Car, etc"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nama/Deskripsi
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateTransportationItem(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={item.distance}
                          onChange={(e) => updateTransportationItem(index, 'distance', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="5 menit"
                        />
                        <button
                          onClick={() => removeTransportationItem(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fasilitas Terdekat
                </h3>
                <button
                  onClick={addNearbyFacility}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.nearbyFacilities || []).map((facility, index) => (
                  <div key={facility.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icon
                        </label>
                        <input
                          type="text"
                          value={facility.icon}
                          onChange={(e) => updateNearbyFacility(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Store, Heart, etc"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nama Fasilitas
                        </label>
                        <input
                          type="text"
                          value={facility.name}
                          onChange={(e) => updateNearbyFacility(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Kategori
                        </label>
                        <select
                          value={facility.category}
                          onChange={(e) => updateNearbyFacility(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="shopping">Belanja</option>
                          <option value="healthcare">Kesehatan</option>
                          <option value="education">Pendidikan</option>
                          <option value="entertainment">Hiburan</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={facility.distance}
                          onChange={(e) => updateNearbyFacility(index, 'distance', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="2 menit"
                        />
                        <button
                          onClick={() => removeNearbyFacility(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;