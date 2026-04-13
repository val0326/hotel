import { Link } from 'react-router-dom';
import { RegisterForm } from '@/widgets/auth-form';

export function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Регистрация</h2>
            <p className="mt-2 text-gray-600">Создайте аккаунт для бронирования</p>
          </div>
          <RegisterForm />
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Уже есть аккаунт? </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
