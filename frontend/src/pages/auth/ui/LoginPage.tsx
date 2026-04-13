import { Link } from 'react-router-dom';
import { LoginForm } from '@/widgets/auth-form';

export function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Вход</h2>
            <p className="mt-2 text-gray-600">Войдите в свой аккаунт</p>
          </div>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Нет аккаунта? </span>
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
