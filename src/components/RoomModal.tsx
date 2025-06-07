import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize,
  CheckCircle,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Room } from "../types";
import { useWebsiteConfig } from "../hooks/useWebsiteConfig";

interface RoomModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ room, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { config } = useWebsiteConfig();

  // Default contact info
  const defaultContactInfo = {
    phone: "+6281234567890",
    whatsapp: "+6281234567890",
    email: "kostpakjajang@email.com",
    address: {
      street: "Jl. Raya Lembang No. 19",
      city: "Lembang, Bandung Barat",
      province: "Jawa Barat",
      postalCode: "40391",
    },
    operatingHours: "Senin - Minggu: 08:00 - 20:00 WIB",
    ownerName: "Pak Jajang",
    ownerQuote:
      "Saya berkomitmen untuk memberikan pelayanan terbaik dan menciptakan lingkungan yang nyaman bagi semua penghuni kost. Jangan ragu untuk menghubungi saya kapan saja!",
  };

  const contactInfo = config?.contactInfo || defaultContactInfo;

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length,
    );
  };

  const handleWhatsApp = () => {
    const message = `Halo Pak Jajang, saya tertarik dengan ${room.name}. Bisakah saya mendapatkan informasi lebih lanjut?`;
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleReservation = () => {
    const message = `Halo Pak Jajang, saya melihat kalo ${room.name} sedang tersedia ya. Saya tertarik dengan ${room.name}, bisakah saya mendapatkan informasi lebih lanjut?`;
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl p-3 sm:p-6 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1 pr-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {room.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    room.available
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {room.available ? "Tersedia" : "Tidak Tersedia"}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold">
                  {room.type === "kost"
                    ? "Kost"
                    : room.type === "kontrakan"
                      ? "Kontrakan"
                      : "Lainnya"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <img
                  src={room.images[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {currentImageIndex + 1} / {room.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {room.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {room.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden ${
                        index === currentImageIndex
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Price */}
              <div>
                {room.price > 0 && (
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    Rp {room.price.toLocaleString("id-ID")}
                    <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-normal">
                      /bulan
                    </span>
                  </div>
                )}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {room.description}
                </p>
              </div>

              {/* Room Info */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {room.size}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    Lantai {room.floor}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {room.orientation}
                  </span>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Fasilitas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {room.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Mobile Optimized */}
              <div className="sm:block space-y-3 pt-4">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Hubungi via WhatsApp</span>
                </button>

                {room.available && (
                  <button
                    onClick={handleReservation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Reservasi Sekarang</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Bottom Actions - Sticky */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Hubungi via WhatsApp</span>
            </button>

            {room.available && (
              <button
                onClick={handleReservation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Reservasi Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
