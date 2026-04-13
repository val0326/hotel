import { RoomList } from '@/widgets/room-list';

export function RoomsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Номера</h1>
        <p className="mt-2 text-gray-600">Выберите подходящий номер для бронирования</p>
      </div>
      <RoomList />
    </div>
  );
}
