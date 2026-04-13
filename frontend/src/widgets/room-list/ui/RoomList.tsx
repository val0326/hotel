import { useEffect, useState, useCallback } from 'react';
import { getRooms } from '@/shared/api/rooms';
import type { Room, RoomType } from '@/shared/types';
import { RoomCard } from '@/entities/room';

const roomTypes: { value: RoomType | ''; label: string }[] = [
  { value: '', label: 'Все типы' },
  { value: 'single', label: 'Одноместный' },
  { value: 'double', label: 'Двухместный' },
  { value: 'suite', label: 'Люкс' },
  { value: 'deluxe', label: 'Делюкс' },
];

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomType, setRoomType] = useState<RoomType | ''>('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRooms({
        room_type: roomType || undefined,
        available_only: availableOnly,
      });
      setRooms(data);
    } catch {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, [roomType, availableOnly]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div>
      {/* Filters */}
      <div className="card mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип номера
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType | '')}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Только доступные
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Номера не найдены</h3>
          <p className="mt-1 text-sm text-gray-500">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}
