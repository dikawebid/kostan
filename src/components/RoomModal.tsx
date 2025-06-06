import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize,
  CheckCircle,
  XCircle,
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
    const message = `Halo Pak Jajang, saya melihat ${room.name} sedang tersedia dan saya tertarik terkait sewa ${room.name} tersebut. Bisakah saya mendapatkan informasi lebih lanjut?`;
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {room.name}
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room.available
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {room.available ? "Tersedia" : "Tidak Tersedia"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-semibold">
                  {room.type === "single"
                    ? "Single"
                    : room.type === "double"
                      ? "Double"
                      : "Shared"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={room.images[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-64 sm:h-80 object-cover rounded-xl"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {room.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {room.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
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
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Rp {room.price.toLocaleString("id-ID")}
                  <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                    /bulan
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {room.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Maximize className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {room.size}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Lantai {room.floor}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    {room.orientation}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Fasilitas
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {room.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300"
                >
                  Hubungi via WhatsApp
                </button>
                {room.available && (
                  <button
                    onClick={handleReservation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Reservasi Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
