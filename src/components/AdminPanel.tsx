import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  LogOut,
  Settings,
  Home,
  Users,
  Globe,
} from "lucide-react";
import { useRooms } from "../hooks/useRooms";
import { useFacilities } from "../hooks/useFacilities";
import { useAuth } from "../hooks/useAuth";
import {
  addRoom,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
} from "../services/roomService";
import { signOutUser } from "../services/authService";
import { Room } from "../types";
import FacilityManager from "./FacilityManager";
import UserManager from "./UserManager";
import ConfigManager from "./ConfigManager";
import ImageUploader from "./ImageUploader";
import { cloudinaryService } from "../services/cloudinaryService";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { rooms, loading, error, refetch } = useRooms(true);
  const { facilities } = useFacilities(true);
  const [activeTab, setActiveTab] = useState<
    "rooms" | "facilities" | "users" | "config"
  >("rooms");
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: "",
    type: "single",
    price: 0,
    available: true,
    facilities: [],
    images: [],
    description: "",
    size: "",
    floor: 1,
    orientation: "",
  });

  const handleInputChange = (field: keyof Room, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFacilityToggle = (facilityName: string) => {
    const currentFacilities = formData.facilities || [];
    const updatedFacilities = currentFacilities.includes(facilityName)
      ? currentFacilities.filter((f) => f !== facilityName)
      : [...currentFacilities, facilityName];

    setFormData((prev) => ({ ...prev, facilities: updatedFacilities }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      alert("Minimal satu gambar harus diupload");
      return;
    }

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
      } else {
        await addRoom(formData as Omit<Room, "id" | "createdAt" | "updatedAt">);
      }

      resetForm();
      refetch();
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Gagal menyimpan data kamar");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
      try {
        await deleteRoom(id);
        refetch();
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Gagal menghapus kamar");
      }
    }
  };

  const handleToggleAvailability = async (id: string, available: boolean) => {
    try {
      await updateRoomAvailability(id, !available);
      refetch();
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Gagal mengubah status ketersediaan");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "single",
      price: 0,
      available: true,
      facilities: [],
      images: [],
      description: "",
      size: "",
      floor: 1,
      orientation: "",
    });
    setIsAddingRoom(false);
    setEditingRoom(null);
  };

  const startEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsAddingRoom(true);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const goToMainSite = () => {
    window.location.href = "/";
  };

  if (loading && activeTab === "rooms") {
    return <div className="p-4 sm:p-8 text-center">Loading...</div>;
  }

  if (error && activeTab === "rooms") {
    return (
      <div className="p-4 sm:p-8 text-center text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="hidden sm:inline">
                  Admin Panel - Kost Pak Jajang
                </span>
                <span className="sm:hidden">Admin Panel</span>
              </h1>

              {/* Mobile Tab Selector */}
              <div className="sm:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as any)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="rooms">Kamar</option>
                  <option value="facilities">Fasilitas</option>
                  <option value="users">Users</option>
                  <option value="config">Konfigurasi</option>
                </select>
              </div>

              {/* Desktop Tabs */}
              <div className="hidden sm:flex space-x-1">
                <button
                  onClick={() => setActiveTab("rooms")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "rooms"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Kamar
                </button>
                <button
                  onClick={() => setActiveTab("facilities")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "facilities"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Fasilitas
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "users"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("config")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "config"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Konfigurasi
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <img
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Admin")}&background=3b82f6&color=fff`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.displayName || user?.email}
                </span>
              </div>

              <button
                onClick={goToMainSite}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Kembali ke website utama"
              >
                <Home className="h-5 w-5" />
              </button>

              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Keluar"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === "config" ? (
          <ConfigManager />
        ) : activeTab === "users" ? (
          <UserManager />
        ) : activeTab === "facilities" ? (
          <FacilityManager />
        ) : (
          <>
            {/* Rooms Management */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Manajemen Kamar
              </h2>
              <button
                onClick={() => setIsAddingRoom(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Kamar</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {isAddingRoom && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {editingRoom ? "Edit Kamar" : "Tambah Kamar Baru"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Kamar
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipe Kamar
                      </label>
                      <select
                        value={formData.type || "single"}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="shared">Shared</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) =>
                          handleInputChange("price", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lantai
                      </label>
                      <input
                        type="number"
                        value={formData.floor || 1}
                        onChange={(e) =>
                          handleInputChange("floor", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ukuran
                      </label>
                      <input
                        type="text"
                        value={formData.size || ""}
                        onChange={(e) =>
                          handleInputChange("size", e.target.value)
                        }
                        placeholder="3x4 meter"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Orientasi
                      </label>
                      <input
                        type="text"
                        value={formData.orientation || ""}
                        onChange={(e) =>
                          handleInputChange("orientation", e.target.value)
                        }
                        placeholder="Menghadap Utara"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Facilities Checkboxes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Fasilitas
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {facilities.map((facility) => (
                        <label
                          key={facility.id}
                          className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              formData.facilities?.includes(facility.name) ||
                              false
                            }
                            onChange={() => handleFacilityToggle(facility.name)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {facility.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload Component */}
                  <ImageUploader
                    images={formData.images || []}
                    onChange={handleImagesChange}
                    maxImages={10}
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.available || false}
                      onChange={(e) =>
                        handleInputChange("available", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="available"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Tersedia
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>{editingRoom ? "Update" : "Simpan"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Rooms List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Daftar Kamar ({rooms.length})
                </h3>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rooms.map((room) => (
                    <div key={room.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {room.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Lantai {room.floor} • {room.size}
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                            Rp {room.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              room.type === "single"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : room.type === "double"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            }`}
                          >
                            {room.type}
                          </span>
                          <button
                            onClick={() =>
                              handleToggleAvailability(room.id, room.available)
                            }
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              room.available
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {room.available ? "Tersedia" : "Tidak Tersedia"}
                          </button>
                        </div>
                      </div>

                      {/* Images Preview */}
                      <div className="flex space-x-1 mb-3 overflow-x-auto">
                        {room.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={cloudinaryService.getOptimizedImageUrl(image, {
                              width: 60,
                              height: 60,
                            })}
                            alt={`${room.name} ${index + 1}`}
                            className="w-15 h-15 object-cover rounded flex-shrink-0"
                          />
                        ))}
                        {room.images.length > 4 && (
                          <div className="w-15 h-15 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              +{room.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(room)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Kamar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {room.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Lantai {room.floor} • {room.size}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {room.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          Rp {room.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleToggleAvailability(room.id, room.available)
                            }
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              room.available
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {room.available ? "Tersedia" : "Tidak Tersedia"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {room.images.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={cloudinaryService.getOptimizedImageUrl(
                                  image,
                                  { width: 40, height: 40 },
                                )}
                                alt={`${room.name} ${index + 1}`}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ))}
                            {room.images.length > 3 && (
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  +{room.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => startEdit(room)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
