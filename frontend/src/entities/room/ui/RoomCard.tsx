import { Link } from 'react-router-dom';
import type { Room } from '@/shared/types';
import { Button } from '@/shared/ui';

const roomTypeLabels: Record<Room['room_type'], string> = {
  single: 'Одноместный',
  double: 'Двухместный',
  suite: 'Люкс',
  deluxe: 'Делюкс',
};

const roomTypeColors: Record<Room['room_type'], string> = {
  single: 'bg-blue-100 text-blue-800',
  double: 'bg-green-100 text-green-800',
  suite: 'bg-purple-100 text-purple-800',
  deluxe: 'bg-amber-100 text-amber-800',
};

const statusLabels: Record<Room['status'], string> = {
  available: 'Доступен',
  occupied: 'Занят',
  maintenance: 'На обслуживании',
};

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const isAvailable = room.status === 'available';

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Номер {room.room_number}
            </h3>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${roomTypeColors[room.room_type]}`}>
              {roomTypeLabels[room.room_type]}
            </span>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {statusLabels[room.status]}
          </span>
        </div>

        {room.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>До {room.capacity} чел.</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{room.floor} этаж</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">{room.price_per_night.toLocaleString('ru-RU')} ₽</span>
            <span className="text-sm text-gray-500"> / ночь</span>
          </div>
          <Link to={`/rooms/${room.id}`}>
            <Button variant={isAvailable ? 'primary' : 'secondary'} disabled={!isAvailable}>
              {isAvailable ? 'Забронировать' : 'Подробнее'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
