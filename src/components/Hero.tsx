import React from "react";
import { MapPin, Star } from "lucide-react";
import { useWebsiteConfig } from "../hooks/useWebsiteConfig";

const Hero: React.FC = () => {
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

  const scrollToRooms = () => {
    const element = document.getElementById("rooms");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsApp = () => {
    const message =
      "Halo Pak Jajang, saya tertarik dengan kost di Lembang. Bisakah saya mendapatkan informasi lebih lanjut?";
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg text-gray-600 dark:text-gray-400">
              Lembang, Bandung Barat
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kost Pak Jajang
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Hunian nyaman dan strategis di kawasan sejuk Lembang dengan
            fasilitas modern dan harga terjangkau
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Strategis
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToRooms}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Lihat Kamar Tersedia
            </button>
            <button
              onClick={handleWhatsApp}
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Hubungi via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
