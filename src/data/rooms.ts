import { Room, Facility } from '../types';

export const facilities: Facility[] = [
  { id: '1', name: 'AC', icon: 'snowflake', description: 'Air conditioning' },
  { id: '2', name: 'WiFi', icon: 'wifi', description: 'High-speed internet' },
  { id: '3', name: 'Kamar Mandi Dalam', icon: 'bath', description: 'Private bathroom' },
  { id: '4', name: 'Lemari', icon: 'cabinet', description: 'Built-in wardrobe' },
  { id: '5', name: 'Meja Belajar', icon: 'desk', description: 'Study desk and chair' },
  { id: '6', name: 'Kasur', icon: 'bed-double', description: 'Comfortable bed' },
  { id: '7', name: 'Jendela', icon: 'sun', description: 'Natural lighting' },
  { id: '8', name: 'Parkir Motor', icon: 'bike', description: 'Motorcycle parking' },
];

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Kamar Premium A1',
    type: 'single',
    price: 1200000,
    available: true,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Lemari', 'Meja Belajar', 'Kasur', 'Jendela'],
    images: [
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Kamar premium dengan fasilitas lengkap, cocok untuk mahasiswa atau pekerja profesional. Lokasi strategis dengan akses mudah ke berbagai fasilitas umum.',
    size: '3x4 meter',
    floor: 2,
    orientation: 'Menghadap Utara'
  },
  {
    id: '2',
    name: 'Kamar Standard B2',
    type: 'single',
    price: 950000,
    available: true,
    facilities: ['WiFi', 'Kamar Mandi Dalam', 'Lemari', 'Meja Belajar', 'Kasur', 'Jendela'],
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Kamar nyaman dengan fasilitas standard yang memadai. Cocok untuk budget menengah dengan kenyamanan optimal.',
    size: '3x3 meter',
    floor: 1,
    orientation: 'Menghadap Selatan'
  },
  {
    id: '3',
    name: 'Kamar Deluxe C1',
    type: 'double',
    price: 1500000,
    available: false,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Lemari', 'Meja Belajar', 'Kasur', 'Jendela'],
    images: [
      'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Kamar deluxe dengan ruang ekstra untuk kenyamanan maksimal. Ideal untuk mereka yang membutuhkan ruang lebih luas.',
    size: '4x4 meter',
    floor: 2,
    orientation: 'Menghadap Timur'
  },
  {
    id: '4',
    name: 'Kamar Ekonomis D3',
    type: 'shared',
    price: 750000,
    available: true,
    facilities: ['WiFi', 'Lemari', 'Meja Belajar', 'Kasur', 'Jendela'],
    images: [
      'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Kamar ekonomis dengan fasilitas dasar yang cukup. Pilihan tepat untuk budget terbatas namun tetap nyaman.',
    size: '3x3 meter',
    floor: 1,
    orientation: 'Menghadap Barat'
  },
  {
    id: '5',
    name: 'Kamar Executive E1',
    type: 'single',
    price: 1350000,
    available: true,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Lemari', 'Meja Belajar', 'Kasur', 'Jendela', 'Parkir Motor'],
    images: [
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Kamar executive dengan fasilitas premium dan akses parkir khusus. Ideal untuk profesional muda.',
    size: '3.5x4 meter',
    floor: 3,
    orientation: 'Menghadap Utara'
  },
  {
    id: '6',
    name: 'Kamar Comfort F2',
    type: 'single',
    price: 1100000,
    available: false,
    facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Lemari', 'Meja Belajar', 'Kasur', 'Jendela'],
    images: [
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Kamar dengan tingkat kenyamanan tinggi dan fasilitas modern. Cocok untuk masa tinggal jangka panjang.',
    size: '3x3.5 meter',
    floor: 2,
    orientation: 'Menghadap Selatan'
  }
];