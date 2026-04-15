import { useEffect, useState, useCallback } from 'react';
import { getBookings, cancelBooking } from '@/shared/api/bookings';
import type { BookingWithRoom } from '@/shared/types';
import { BookingCard } from '@/entities/booking';
import toast from 'react-hot-toast';

export function BookingHistory() {
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить бронирования';
      toast.error(message);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id: number) => {
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
      return;
    }

    setCancellingId(id);
    try {
      await cancelBooking(id);
      toast.success('Бронирование отменено');
      fetchBookings();
    } catch {
      toast.error('Ошибка при отмене бронирования');
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет бронирований</h3>
        <p className="mt-1 text-sm text-gray-500">
          У вас пока нет бронирований. <a href="/" className="text-primary-600 hover:text-primary-500">Выберите номер</a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancel={handleCancel}
          isLoading={cancellingId === booking.id}
        />
      ))}
    </div>
  );
}
