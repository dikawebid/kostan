import React from "react";
import {
  MapPin,
  Clock,
  Shield,
  Wifi,
  Car,
  Coffee,
  Zap,
  Droplets,
} from "lucide-react";
import { useWebsiteConfig } from "../hooks/useWebsiteConfig";
import * as LucideIcons from "lucide-react";

const AboutSection: React.FC = () => {
  const { config, loading } = useWebsiteConfig();

  // Default features if config is not loaded
  const defaultFeatures = [
    {
      icon: MapPin,
      title: "Lokasi Strategis",
      description:
        "Berada di kawasan Lembang yang sejuk dengan akses mudah ke berbagai tempat wisata dan fasilitas umum",
    },
    {
      icon: Shield,
      title: "Keamanan 24/7",
      description:
        "Sistem keamanan terpadu dengan CCTV dan petugas keamanan yang berjaga sepanjang waktu",
    },
    {
      icon: Wifi,
      title: "Internet Cepat",
      description:
        "WiFi fiber optic berkecepatan tinggi tersedia di semua area untuk mendukung aktivitas online Anda",
    },
    {
      icon: Car,
      title: "Parkir Luas",
      description:
        "Area parkir yang aman dan luas untuk motor dan mobil penghuni kost",
    },
    {
      icon: Coffee,
      title: "Dapur Bersama",
      description:
        "Fasilitas dapur bersama lengkap dengan peralatan memasak dan area makan yang nyaman",
    },
    {
      icon: Zap,
      title: "Listrik Stabil",
      description:
        "Supply listrik stabil dengan backup generator untuk memastikan kenyamanan penghuni",
    },
    {
      icon: Droplets,
      title: "Air Bersih",
      description:
        "Sumber air bersih dari pegunungan Lembang yang jernih dan segar sepanjang hari",
    },
    {
      icon: Clock,
      title: "Akses Fleksibel",
      description:
        "Akses masuk 24 jam dengan sistem kunci elektronik untuk kenyamanan penghuni",
    },
  ];

  const defaultRules = [
    "Jam berkunjung tamu sampai dengan 22:00 WIB",
    "Dilarang membawa hewan peliharaan",
    "Menjaga kebersihan area bersama",
    "Tidak merokok di dalam kamar",
    "Bayar sewa tepat waktu setiap bulan",
    "Lapor jika ada kerusakan fasilitas",
  ];

  // Get icon component from string name
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || MapPin; // Fallback to MapPin if icon not found
  };

  const features =
    config?.aboutFeatures?.map((feature) => ({
      icon: getIconComponent(feature.icon),
      title: feature.title,
      description: feature.description,
    })) || defaultFeatures;

  const rules = config?.kostRules || defaultRules;
  const aboutTitle = config?.aboutTitle || "Tentang Kost Pak Jajang";
  const aboutDescription =
    config?.aboutDescription ||
    "Kost Pak Jajang Lembang telah melayani penghuni selama lebih dari 10 tahun dengan komitmen memberikan hunian yang nyaman, aman, dan terjangkau di kawasan wisata Lembang yang sejuk.";

  if (loading) {
    return (
      <section
        id="about"
        className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {aboutTitle}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {aboutDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Rules Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Peraturan Hunian
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Untuk menjaga kenyamanan bersama, berikut adalah beberapa
                peraturan yang perlu dipatuhi oleh seluruh penyewa.
              </p>
              <ul className="space-y-3">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Kost environment"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
