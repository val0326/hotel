import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import type { Room } from '@/shared/types';
import { useAuthStore } from '@/entities/auth/model/useAuthStore';
import { createBooking } from '@/shared/api/bookings';
import { Button, Input } from '@/shared/ui';
import toast from 'react-hot-toast';

const bookingSchema = z.object({
  check_in: z.string().min(1, 'Укажите дату заезда'),
  check_out: z.string().min(1, 'Укажите дату выезда'),
}).refine((data) => {
  const checkIn = new Date(data.check_in);
  const checkOut = new Date(data.check_out);
  return checkOut > checkIn;
}, {
  message: 'Дата выезда должна быть позже даты заезда',
  path: ['check_out'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  room: Room;
}

export function BookingForm({ room }: BookingFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const checkIn = watch('check_in');
  const checkOut = watch('check_out');

  const calculateTotal = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        return (nights * room.price_per_night).toLocaleString('ru-RU');
      }
    }
    return null;
  };

  const total = calculateTotal();

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    try {
      await createBooking({
        user_id: user.id,
        room_id: room.id,
        check_in: new Date(data.check_in).toISOString(),
        check_out: new Date(data.check_out).toISOString(),
      });
      toast.success('Бронирование успешно создано!');
      navigate('/profile');
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : 'Ошибка при создании бронирования';
      toast.error(typeof message === 'string' ? message : 'Номер уже забронирован на эти даты');
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Дата заезда"
          type="datetime-local"
          error={errors.check_in?.message}
          min={today}
          {...register('check_in')}
        />
        <Input
          label="Дата выезда"
          type="datetime-local"
          error={errors.check_out?.message}
          min={checkIn || today}
          {...register('check_out')}
        />
      </div>

      {total && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Итого:</span>
              <span className="text-2xl font-bold text-primary-900">{total} ₽</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Забронировать
      </Button>
    </form>
  );
}
