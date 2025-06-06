export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'shared';
  price: number;
  available: boolean;
  facilities: string[];
  images: string[];
  description: string;
  size: string;
  floor: number;
  orientation: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'basic' | 'comfort' | 'premium';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WebsiteConfig {
  id: string;
  // About Section
  aboutTitle: string;
  aboutDescription: string;
  aboutFeatures: AboutFeature[];
  
  // Rules Section
  kostRules: string[];
  
  // Contact Information
  contactInfo: ContactInfo;
  
  // Location & Map
  location: LocationInfo;
  
  // Transportation Access
  transportationAccess: TransportationItem[];
  
  // Nearby Facilities
  nearbyFacilities: NearbyFacility[];
  
  // Meta Information
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AboutFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  operatingHours: string;
  ownerName: string;
  ownerQuote: string;
}

export interface LocationInfo {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  mapZoom: number;
  address: string;
  description: string;
}

export interface TransportationItem {
  id: string;
  name: string;
  distance: string;
  icon: string;
}

export interface NearbyFacility {
  id: string;
  name: string;
  distance: string;
  category: 'shopping' | 'healthcare' | 'education' | 'entertainment' | 'other';
  icon: string;
}