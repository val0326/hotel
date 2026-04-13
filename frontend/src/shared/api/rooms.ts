import api from '@/shared/api/instance';
import type { Room, RoomType } from '@/shared/types';

interface GetRoomsParams {
  skip?: number;
  limit?: number;
  room_type?: RoomType;
  available_only?: boolean;
}

export const getRooms = async (params?: GetRoomsParams): Promise<Room[]> => {
  const { data } = await api.get<Room[]>('/rooms/', { params });
  return data;
};

export const getRoomById = async (id: number): Promise<Room> => {
  const { data } = await api.get<Room>(`/rooms/${id}`);
  return data;
};
