import api from '@/shared/api/instance';
import type { AuthResponse, User } from '@/shared/types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // OAuth2PasswordRequestForm использует form data, не JSON
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const { data } = await api.post<AuthResponse>('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const register = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>('/users/', { email, password });
  return data;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Получаем всех пользователей и фильтруем (т.к. нет эндпоинта /users/me)
    const { data } = await api.get<User[]>('/users/');
    // Находим активного пользователя (для простоты берём первого)
    return data.find((u) => u.is_active) ?? null;
  } catch {
    return null;
  }
};
