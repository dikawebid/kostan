import React from "react";
import { Phone, MessageCircle, MapPin, Clock, Mail, Users } from "lucide-react";
import { useWebsiteConfig } from "../hooks/useWebsiteConfig";

const ContactSection: React.FC = () => {
  const { config, loading } = useWebsiteConfig();

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

  const defaultTransportation = [
    "5 menit dari Terminal Lembang",
    "10 menit dari Floating Market",
    "15 menit dari Tangkuban Perahu",
    "30 menit dari Bandung Kota",
  ];

  const defaultNearbyFacilities = [
    "Indomaret & Alfamart (2 menit)",
    "Rumah Sakit (5 menit)",
    "Kampus & Sekolah (10 menit)",
    "Mall & Pusat Belanja (15 menit)",
  ];

  const contactInfo = config?.contactInfo || defaultContactInfo;
  const transportationAccess =
    config?.transportationAccess?.map((item) => item.name) ||
    defaultTransportation;
  const nearbyFacilities =
    config?.nearbyFacilities?.map(
      (facility) => `${facility.name} (${facility.distance})`,
    ) || defaultNearbyFacilities;

  const handleWhatsApp = () => {
    const message =
      "Halo Pak Jajang, saya tertarik dengan kost di Lembang. Bisakah saya mendapatkan informasi lebih lanjut?";
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  if (loading) {
    return (
      <section
        id="contact"
        className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
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
      id="contact"
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hubungi Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Siap membantu Anda menemukan hunian yang tepat. Jangan ragu untuk
            menghubungi kami untuk informasi dan pertanyaan lebih lanjut.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Informasi Kontak
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      WhatsApp
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {contactInfo.whatsapp}
                    </p>
                  </div>
                </div>

                {contactInfo.phone && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Telepon
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contactInfo.phone}
                      </p>
                    </div>
                  </div>
                )}

                {contactInfo.email && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Email
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contactInfo.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg">
                    <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Alamat
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {contactInfo.address?.street}
                      <br />
                      {contactInfo.address?.city}
                      <br />
                      {contactInfo.address?.province}{" "}
                      {contactInfo.address?.postalCode}
                    </p>
                  </div>
                </div>

                {contactInfo.operatingHours && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Jam Operasional
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contactInfo.operatingHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat via WhatsApp</span>
                </button>
                <button
                  onClick={handleCall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Telepon Sekarang</span>
                </button>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {contactInfo.ownerName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Pemilik Kost
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "{contactInfo.ownerQuote}"
              </p>
            </div>
          </div>

          {/* Map and Location Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Lokasi Kost
            </h3>

            {/* Map Preview */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Peta Lokasi</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {config?.location?.address || "Lembang, Bandung Barat"}
                </p>
                {config?.location?.coordinates && (
                  <a
                    href={`https://www.google.com/maps?q=${config.location.coordinates.latitude},${config.location.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
                  >
                    Lihat di Google Maps
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Akses Terdekat
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {transportationAccess.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              {nearbyFacilities.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Fasilitas Terdekat
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {nearbyFacilities.map((facility, index) => (
                      <li key={index}>• {facility}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
