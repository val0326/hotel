import { BookingHistory } from '@/widgets/booking-history';

export function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мои бронирования</h1>
        <p className="mt-2 text-gray-600">Управляйте своими бронированиями</p>
      </div>
      <BookingHistory />
    </div>
  );
}
