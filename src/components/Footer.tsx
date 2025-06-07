import React from "react";
import { Home, MessageCircle, Phone, Mail, MapPin, Heart } from "lucide-react";
import { useWebsiteConfig } from "../hooks/useWebsiteConfig";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
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
  const aboutTitle = config?.aboutTitle || "Kost Pak Jajang Lembang";
  const aboutDescription =
    config?.aboutDescription ||
    "Kost Pak Jajang Lembang telah melayani penghuni selama lebih dari 10 tahun dengan komitmen memberikan hunian yang nyaman, aman, dan terjangkau di kawasan wisata Lembang yang sejuk.";

  const handleWhatsApp = () => {
    const message =
      "Halo Pak Jajang, saya tertarik dengan kost di Lembang. Bisakah saya mendapatkan informasi lebih lanjut?";
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">Kost Pak Jajang</h3>
                <p className="text-gray-400 text-sm">Lembang</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">{aboutDescription}</p>
            <button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 inline-flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat WhatsApp</span>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Menu</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("rooms")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Hunian
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Tentang
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Kontak
                </button>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Manage
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{contactInfo.whatsapp}</span>
              </div>
              {contactInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{contactInfo.email}</span>
                </div>
              )}
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <span className="text-gray-300">
                  {contactInfo.address.street}
                  <br />
                  {contactInfo.address.city}, {contactInfo.address.province}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 {aboutTitle}. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center space-x-1 mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for comfortable living</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
