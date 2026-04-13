export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export type RoomType = 'single' | 'double' | 'suite' | 'deluxe';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface Room {
  id: number;
  room_number: string;
  room_type: RoomType;
  price_per_night: number;
  capacity: number;
  floor: number;
  description: string | null;
  is_available: boolean;
  status: RoomStatus;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export interface BookingWithRoom extends Booking {
  room: Room;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string | { msg: string }[];
}
