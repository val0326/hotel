import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRoomById } from '@/shared/api/rooms';
import type { Room } from '@/shared/types';
import { useAuthStore } from '@/entities/auth/model/useAuthStore';
import { Button } from '@/shared/ui';
import toast from 'react-hot-toast';

const roomTypeLabels: Record<Room['room_type'], string> = {
  single: 'Одноместный',
  double: 'Двухместный',
  suite: 'Люкс',
  deluxe: 'Делюкс',
};

const statusLabels: Record<Room['status'], string> = {
  available: 'Доступен',
  occupied: 'Занят',
  maintenance: 'На обслуживании',
};

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getRoomById(Number(id))
      .then(setRoom)
      .catch(() => toast.error('Номер не найден'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card animate-pulse">
          <div className="p-8">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Номер не найден</h2>
        <Link to="/" className="text-primary-600 hover:text-primary-500 mt-4 inline-block">
          Вернуться к списку номеров
        </Link>
      </div>
    );
  }

  const isAvailable = room.status === 'available';

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Для бронирования необходимо войти в систему');
      navigate(`/login?from=/booking/${room.id}`);
      return;
    }
    navigate(`/booking/${room.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-700">Номера</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">Номер {room.room_number}</span>
      </nav>

      <div className="card">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Номер {room.room_number}
              </h1>
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
                {roomTypeLabels[room.room_type]}
              </span>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {statusLabels[room.status]}
            </span>
          </div>

          {room.description && (
            <p className="text-gray-700 text-lg mb-6">{room.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Тип</p>
              <p className="font-medium">{roomTypeLabels[room.room_type]}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Вместимость</p>
              <p className="font-medium">До {room.capacity} чел.</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Этаж</p>
              <p className="font-medium">{room.floor}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Цена за ночь</p>
              <p className="font-medium">{room.price_per_night.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <Link to="/" className="flex-1">
              <Button variant="secondary" className="w-full">
                Назад к списку
              </Button>
            </Link>
            <Button
              onClick={handleBooking}
              disabled={!isAvailable}
              className="flex-1"
            >
              {isAvailable ? 'Забронировать' : 'Номер недоступен'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
