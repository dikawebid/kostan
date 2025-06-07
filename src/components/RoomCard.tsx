import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Room } from "../types";

interface RoomCardProps {
  room: Room;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              room.available
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {room.available ? "Tersedia" : "Tidak Tersedia"}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
            {room.type === "kost"
              ? "Kost"
              : room.type === "kontrakan"
                ? "Kontrakan"
                : "Lainnya"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {room.name}
          </h3>
          <div className="flex items-center space-x-1">
            {room.available ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          {room.price > 0 && (
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Rp {room.price.toLocaleString("id-ID")}
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                /bulan
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div>Lantai: {room.floor}</div>
          <div>Ukuran: {room.size}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.facilities.slice(0, 3).map((facility, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
            >
              {facility}
            </span>
          ))}
          {room.facilities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs">
              +{room.facilities.length - 3} lainnya
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
          {room.description}
        </p>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300">
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
