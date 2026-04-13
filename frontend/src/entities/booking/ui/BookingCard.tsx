import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { BookingWithRoom, BookingStatus } from '@/shared/types';
import { Button } from '@/shared/ui';

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  completed: 'Завершено',
};

const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

interface BookingCardProps {
  booking: BookingWithRoom;
  onCancel?: (id: number) => void;
  isLoading?: boolean;
}

export function BookingCard({ booking, onCancel, isLoading }: BookingCardProps) {
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Номер {booking.room.room_number}
            </h3>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{booking.total_price.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Заезд</p>
            <p className="font-medium">
              {format(checkIn, 'd MMM yyyy, HH:mm', { locale: ru })}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Выезд</p>
            <p className="font-medium">
              {format(checkOut, 'd MMM yyyy, HH:mm', { locale: ru })}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Ночей</p>
            <p className="font-medium">{nights}</p>
          </div>
        </div>

        {canCancel && onCancel && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              variant="danger"
              onClick={() => onCancel(booking.id)}
              isLoading={isLoading}
            >
              Отменить бронирование
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
