import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { WebsiteConfig } from '../types';

const CONFIG_DOC_ID = 'website-config';
const COLLECTION_NAME = 'config';

// Convert Firestore document to WebsiteConfig object
const convertFirestoreConfig = (doc: any): WebsiteConfig => {
  const data = doc.data();
  return {
    id: doc.id,
    aboutTitle: data.aboutTitle || '',
    aboutDescription: data.aboutDescription || '',
    aboutFeatures: data.aboutFeatures || [],
    kostRules: data.kostRules || [],
    contactInfo: data.contactInfo || {},
    location: data.location || {},
    transportationAccess: data.transportationAccess || [],
    nearbyFacilities: data.nearbyFacilities || [],
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

// Get website configuration
export const getWebsiteConfig = async (): Promise<WebsiteConfig | null> => {
  try {
    const configDoc = doc(db, COLLECTION_NAME, CONFIG_DOC_ID);
    const docSnapshot = await getDoc(configDoc);
    
    if (docSnapshot.exists()) {
      return convertFirestoreConfig(docSnapshot);
    }
    return null;
  } catch (error) {
    console.error('Error fetching website config:', error);
    throw new Error('Failed to fetch website configuration');
  }
};

// Update website configuration
export const updateWebsiteConfig = async (configData: Partial<WebsiteConfig>): Promise<void> => {
  try {
    const configDoc = doc(db, COLLECTION_NAME, CONFIG_DOC_ID);
    const updateData = {
      ...configData,
      updatedAt: Timestamp.now()
    };
    
    // Check if document exists
    const docSnapshot = await getDoc(configDoc);
    
    if (docSnapshot.exists()) {
      await updateDoc(configDoc, updateData);
    } else {
      // Create new document with default values
      await setDoc(configDoc, {
        ...getDefaultConfig(),
        ...updateData,
        createdAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error updating website config:', error);
    throw new Error('Failed to update website configuration');
  }
};

// Get default configuration
export const getDefaultConfig = (): Omit<WebsiteConfig, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    aboutTitle: 'Tentang Kost Pak Jajang',
    aboutDescription: 'Kost Pak Jajang Lembang telah melayani penghuni selama lebih dari 10 tahun dengan komitmen memberikan hunian yang nyaman, aman, dan terjangkau di kawasan wisata Lembang yang sejuk.',
    aboutFeatures: [
      {
        id: '1',
        icon: 'MapPin',
        title: 'Lokasi Strategis',
        description: 'Berada di kawasan Lembang yang sejuk dengan akses mudah ke berbagai tempat wisata dan fasilitas umum'
      },
      {
        id: '2',
        icon: 'Shield',
        title: 'Keamanan 24/7',
        description: 'Sistem keamanan terpadu dengan CCTV dan petugas keamanan yang berjaga sepanjang waktu'
      },
      {
        id: '3',
        icon: 'Wifi',
        title: 'Internet Cepat',
        description: 'WiFi fiber optic berkecepatan tinggi tersedia di semua area untuk mendukung aktivitas online Anda'
      },
      {
        id: '4',
        icon: 'Car',
        title: 'Parkir Luas',
        description: 'Area parkir yang aman dan luas untuk motor dan mobil penghuni kost'
      }
    ],
    kostRules: [
      'Jam berkunjung tamu sampai dengan 22:00 WIB',
      'Dilarang membawa hewan peliharaan',
      'Menjaga kebersihan area bersama',
      'Tidak merokok di dalam kamar',
      'Bayar sewa tepat waktu setiap bulan',
      'Lapor jika ada kerusakan fasilitas'
    ],
    contactInfo: {
      phone: '+6281234567890',
      whatsapp: '+6281234567890',
      email: 'kostpakjajang@email.com',
      address: {
        street: 'Jl. Raya Lembang No. 123',
        city: 'Lembang, Bandung Barat',
        province: 'Jawa Barat',
        postalCode: '40391'
      },
      operatingHours: 'Senin - Minggu: 08:00 - 20:00 WIB',
      ownerName: 'Pak Jajang',
      ownerQuote: 'Saya berkomitmen untuk memberikan pelayanan terbaik dan menciptakan lingkungan yang nyaman bagi semua penghuni kost. Jangan ragu untuk menghubungi saya kapan saja!'
    },
    location: {
      coordinates: {
        latitude: -6.8116,
        longitude: 107.6144
      },
      mapZoom: 15,
      address: 'Jl. Raya Lembang No. 123, Lembang, Bandung Barat, Jawa Barat 40391',
      description: 'Lokasi strategis di kawasan wisata Lembang yang sejuk'
    },
    transportationAccess: [
      {
        id: '1',
        name: '5 menit dari Terminal Lembang',
        distance: '5 menit',
        icon: 'Bus'
      },
      {
        id: '2',
        name: '10 menit dari Floating Market',
        distance: '10 menit',
        icon: 'MapPin'
      },
      {
        id: '3',
        name: '15 menit dari Tangkuban Perahu',
        distance: '15 menit',
        icon: 'Mountain'
      },
      {
        id: '4',
        name: '30 menit dari Bandung Kota',
        distance: '30 menit',
        icon: 'Car'
      }
    ],
    nearbyFacilities: [
      {
        id: '1',
        name: 'Indomaret & Alfamart',
        distance: '2 menit',
        category: 'shopping',
        icon: 'ShoppingBag'
      },
      {
        id: '2',
        name: 'Rumah Sakit',
        distance: '5 menit',
        category: 'healthcare',
        icon: 'Heart'
      },
      {
        id: '3',
        name: 'Kampus & Sekolah',
        distance: '10 menit',
        category: 'education',
        icon: 'GraduationCap'
      },
      {
        id: '4',
        name: 'Mall & Pusat Belanja',
        distance: '15 menit',
        category: 'shopping',
        icon: 'Store'
      }
    ]
  };
};

// Initialize default configuration
export const initializeDefaultConfig = async (): Promise<void> => {
  try {
    const configDoc = doc(db, COLLECTION_NAME, CONFIG_DOC_ID);
    const docSnapshot = await getDoc(configDoc);
    
    if (!docSnapshot.exists()) {
      await setDoc(configDoc, {
        ...getDefaultConfig(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error initializing default config:', error);
    throw new Error('Failed to initialize default configuration');
  }
};