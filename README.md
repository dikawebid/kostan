# Kost Pak Jajang Lembang

Website kost modern dengan integrasi Cloud Firestore untuk manajemen data kamar real-time dan sistem admin dengan autentikasi Firebase.

## Fitur

### Frontend (Website Utama)
- **Manajemen Kamar Real-time**: Data kamar tersimpan di Cloud Firestore dengan sinkronisasi real-time
- **Pencarian & Filter**: Cari kamar berdasarkan nama, tipe, harga, dan ketersediaan
- **Galeri Foto**: Tampilan foto kamar dengan carousel interaktif
- **Kontak WhatsApp**: Integrasi langsung dengan WhatsApp untuk komunikasi
- **Dark/Light Theme**: Tema gelap dan terang dengan transisi smooth
- **Responsive Design**: Tampilan optimal di semua perangkat

### Admin Panel
- **Autentikasi Firebase**: Login dengan email/password dan Google OAuth
- **Manajemen Kamar**: CRUD lengkap untuk data kamar
- **Manajemen Fasilitas**: Kelola fasilitas dengan kategori (Basic, Comfort, Premium)
- **Form Checkbox Fasilitas**: Pilih fasilitas dengan checkbox yang mudah
- **Multiple Image URLs**: Input multiple URL gambar untuk setiap kamar
- **Real-time Updates**: Perubahan data langsung tersinkronisasi
- **Role-based Access**: Hanya admin yang dapat mengakses panel

## Setup Firebase

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Cloud Firestore dan Authentication
3. Setup Authentication providers:
   - Email/Password
   - Google OAuth
4. Salin konfigurasi Firebase ke file `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Instalasi

1. Clone repository
2. Install dependencies: `npm install`
3. Setup environment variables (copy `.env.example` to `.env`)
4. Jalankan development server: `npm run dev`

## Struktur Database

### Collection: `rooms`

```javascript
{
  id: string,
  name: string,
  type: 'single' | 'double' | 'shared',
  price: number,
  available: boolean,
  facilities: string[], // Array nama fasilitas
  images: string[], // Array URL gambar
  description: string,
  size: string,
  floor: number,
  orientation: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `facilities`

```javascript
{
  id: string,
  name: string,
  icon: string, // Nama icon dari Lucide React
  description: string,
  category: 'basic' | 'comfort' | 'premium',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `users`

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  isAdmin: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Seeding Data

### Fasilitas Default
```javascript
import { seedDefaultFacilities } from './src/services/facilityService';
seedDefaultFacilities();
```

### Data Kamar
```javascript
import { seedRoomsData } from './src/utils/seedData';
seedRoomsData();
```

## Admin Setup

1. Daftar akun admin pertama melalui `/admin`
2. Untuk membuat admin tambahan, gunakan fungsi `makeUserAdmin(uid)` di console
3. Atau set `isAdmin: true` langsung di Firestore

## API Services

### Authentication (`src/services/authService.ts`)
- `signInWithEmail(email, password)`: Login dengan email
- `signUpWithEmail(email, password, displayName)`: Daftar dengan email
- `signInWithGoogle()`: Login dengan Google
- `signOutUser()`: Logout
- `onAuthStateChange(callback)`: Listener perubahan auth state

### Room Service (`src/services/roomService.ts`)
- `getAllRooms()`: Ambil semua kamar
- `getRoomById(id)`: Ambil kamar berdasarkan ID
- `addRoom(roomData)`: Tambah kamar baru
- `updateRoom(id, updates)`: Update data kamar
- `deleteRoom(id)`: Hapus kamar
- `subscribeToRooms(callback)`: Real-time listener

### Facility Service (`src/services/facilityService.ts`)
- `getAllFacilities()`: Ambil semua fasilitas
- `addFacility(facilityData)`: Tambah fasilitas baru
- `updateFacility(id, updates)`: Update fasilitas
- `deleteFacility(id)`: Hapus fasilitas
- `subscribeToFacilities(callback)`: Real-time listener

## Custom Hooks

- `useAuth()`: Hook untuk autentikasi dan status admin
- `useRooms(realtime)`: Hook untuk data kamar
- `useRoom(id)`: Hook untuk data kamar tunggal
- `useFacilities(realtime)`: Hook untuk data fasilitas

## Routing

- `/` - Website utama
- `/admin` - Panel admin (protected route)

## Fitur Admin Panel

### Manajemen Kamar
- Form lengkap dengan validasi
- Checkbox fasilitas berdasarkan database
- Multiple input URL gambar
- Toggle status ketersediaan
- Edit dan hapus kamar

### Manajemen Fasilitas
- Kategori fasilitas (Basic, Comfort, Premium)
- Icon dari Lucide React
- Grouping berdasarkan kategori
- CRUD lengkap

### Autentikasi
- Login dengan email/password
- Login dengan Google OAuth
- Role-based access control
- Session management

## Teknologi

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Backend**: Firebase (Firestore, Authentication)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rooms - read public, write admin only
    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Facilities - read public, write admin only
    match /facilities/{facilityId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users - read/write own data, admin can read all
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## Deployment

1. Build project: `npm run build`
2. Deploy ke hosting pilihan (Vercel, Netlify, Firebase Hosting)
3. Set environment variables di platform hosting
4. Setup Firebase Security Rules
5. Configure Firebase Authentication domains

## Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request