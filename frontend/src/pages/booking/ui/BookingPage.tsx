import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoomById } from '@/shared/api/rooms';
import type { Room } from '@/shared/types';
import { BookingForm } from '@/widgets/booking-form';
import toast from 'react-hot-toast';

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card animate-pulse">
          <div className="p-8">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Номер не найден</h2>
        <Link to="/" className="text-primary-600 hover:text-primary-500 mt-4 inline-block">
          Вернуться к списку номеров
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-700">Номера</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to={`/rooms/${room.id}`} className="text-gray-500 hover:text-gray-700">
          Номер {room.room_number}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">Бронирование</span>
      </nav>

      <div className="card">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Бронирование номера {room.room_number}
          </h1>
          <p className="text-gray-600 mb-6">
            {room.price_per_night.toLocaleString('ru-RU')} ₽ / ночь
          </p>
          <BookingForm room={room} />
        </div>
      </div>
    </div>
  );
}
