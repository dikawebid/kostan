import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure default icon
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
  description?: string;
  height?: string;
  className?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  address = "Kost Pak Jajang",
  description = "Lokasi Kost",
  height = "300px",
  className = "",
}) => {
  // Validate coordinates
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">Koordinat tidak valid</p>
          <p className="text-xs mt-1">Silakan periksa konfigurasi lokasi</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">{address}</h3>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  Lat: {latitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500">
                  Lng: {longitude.toFixed(6)}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Buka di Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
