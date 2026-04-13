import api from '@/shared/api/instance';
import type { Booking, BookingWithRoom, BookingStatus } from '@/shared/types';

interface GetBookingsParams {
  skip?: number;
  limit?: number;
  status?: BookingStatus;
}

export const getBookings = async (params?: GetBookingsParams): Promise<BookingWithRoom[]> => {
  const { data } = await api.get<BookingWithRoom[]>('/bookings/', { params });
  return data;
};

export const getBookingById = async (id: number): Promise<BookingWithRoom> => {
  const { data } = await api.get<BookingWithRoom>(`/bookings/${id}`);
  return data;
};

interface CreateBookingPayload {
  user_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
}

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const { data } = await api.post<Booking>('/bookings/', payload);
  return data;
};

export const cancelBooking = async (id: number): Promise<Booking> => {
  const { data } = await api.post<Booking>(`/bookings/${id}/cancel`);
  return data;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};
