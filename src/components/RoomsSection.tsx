import React, { useState, useMemo } from 'react';
import { Search, Filter, Bed, Users, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import RoomCard from './RoomCard';
import RoomModal from './RoomModal';
import { useRooms } from '../hooks/useRooms';
import { Room } from '../types';

const RoomsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Use real-time data from Firestore
  const { rooms, loading, error, refetch } = useRooms(true);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || room.type === selectedType;
      const matchesPrice = room.price <= maxPrice;
      const matchesAvailability = !showAvailableOnly || room.available;

      return matchesSearch && matchesType && matchesPrice && matchesAvailability;
    });
  }, [rooms, searchTerm, selectedType, maxPrice, showAvailableOnly]);

  if (loading) {
    return (
      <section id="rooms\" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="text-lg">Memuat data kamar...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="rooms" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="h-6 w-6" />
              <span className="text-lg">Gagal memuat data kamar</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pilihan Kamar Tersedia
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Temukan kamar yang sesuai dengan kebutuhan dan budget Anda
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kamar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Bed className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Semua Tipe</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={2000000}>Semua Harga</option>
                <option value={800000}>≤ Rp 800.000</option>
                <option value={1000000}>≤ Rp 1.000.000</option>
                <option value={1200000}>≤ Rp 1.200.000</option>
                <option value={1500000}>≤ Rp 1.500.000</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available-only"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="available-only" className="text-gray-700 dark:text-gray-300">
                Hanya yang tersedia
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            Menampilkan {filteredRooms.length} dari {rooms.length} kamar
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => setSelectedRoom(room)}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <Bed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada kamar yang ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coba ubah filter pencarian Anda
            </p>
          </div>
        )}

        {/* Room Detail Modal */}
        {selectedRoom && (
          <RoomModal
            room={selectedRoom}
            isOpen={!!selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        )}
      </div>
    </section>
  );
};

export default RoomsSection;