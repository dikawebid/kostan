import { addRoom } from "../services/roomService";
import { Room } from "../types";

const sampleRooms: Omit<Room, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Kamar Premium A1",
    type: "kost",
    price: 1200000,
    available: true,
    facilities: [
      "AC",
      "WiFi",
      "Kamar Mandi Dalam",
      "Lemari",
      "Meja Belajar",
      "Kasur",
      "Jendela",
    ],
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Kamar premium dengan fasilitas lengkap, cocok untuk mahasiswa atau pekerja profesional. Lokasi strategis dengan akses mudah ke berbagai fasilitas umum.",
    size: "3x4 meter",
    floor: 2,
    orientation: "Menghadap Utara",
  },
  {
    name: "Kamar Standard B2",
    type: "kost",
    price: 950000,
    available: true,
    facilities: [
      "WiFi",
      "Kamar Mandi Dalam",
      "Lemari",
      "Meja Belajar",
      "Kasur",
      "Jendela",
    ],
    images: [
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Kamar nyaman dengan fasilitas standard yang memadai. Cocok untuk budget menengah dengan kenyamanan optimal.",
    size: "3x3 meter",
    floor: 1,
    orientation: "Menghadap Selatan",
  },
  {
    name: "Kamar Deluxe C1",
    type: "kontrakan",
    price: 1500000,
    available: false,
    facilities: [
      "AC",
      "WiFi",
      "Kamar Mandi Dalam",
      "Lemari",
      "Meja Belajar",
      "Kasur",
      "Jendela",
    ],
    images: [
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Kamar deluxe dengan ruang ekstra untuk kenyamanan maksimal. Ideal untuk mereka yang membutuhkan ruang lebih luas.",
    size: "4x4 meter",
    floor: 2,
    orientation: "Menghadap Timur",
  },
  {
    name: "Kamar Ekonomis D3",
    type: "kontrakan",
    price: 750000,
    available: true,
    facilities: ["WiFi", "Lemari", "Meja Belajar", "Kasur", "Jendela"],
    images: [
      "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Kamar ekonomis dengan fasilitas dasar yang cukup. Pilihan tepat untuk budget terbatas namun tetap nyaman.",
    size: "3x3 meter",
    floor: 1,
    orientation: "Menghadap Barat",
  },
  {
    name: "Kamar Executive E1",
    type: "kost",
    price: 1350000,
    available: true,
    facilities: [
      "AC",
      "WiFi",
      "Kamar Mandi Dalam",
      "Lemari",
      "Meja Belajar",
      "Kasur",
      "Jendela",
      "Parkir Motor",
    ],
    images: [
      "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Kamar executive dengan fasilitas premium dan akses parkir khusus. Ideal untuk profesional muda.",
    size: "3.5x4 meter",
    floor: 3,
    orientation: "Menghadap Utara",
  },
  {
    name: "Kamar Comfort F2",
    type: "kost",
    price: 1100000,
    available: false,
    facilities: [
      "AC",
      "WiFi",
      "Kamar Mandi Dalam",
      "Lemari",
      "Meja Belajar",
      "Kasur",
      "Jendela",
    ],
    images: [
      "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Kamar dengan tingkat kenyamanan tinggi dan fasilitas modern. Cocok untuk masa tinggal jangka panjang.",
    size: "3x3.5 meter",
    floor: 2,
    orientation: "Menghadap Selatan",
  },
];

export const seedRoomsData = async (): Promise<void> => {
  try {
    console.log("Starting to seed room data...");

    for (const room of sampleRooms) {
      const roomId = await addRoom(room);
      console.log(`Added room: ${room.name} with ID: ${roomId}`);
    }

    console.log("Successfully seeded all room data!");
  } catch (error) {
    console.error("Error seeding room data:", error);
    throw error;
  }
};
