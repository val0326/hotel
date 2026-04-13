import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/shared/ui';
import { RoomsPage } from '@/pages/rooms/ui/RoomsPage';
import { LoginPage } from '@/pages/auth/ui/LoginPage';
import { RegisterPage } from '@/pages/auth/ui/RegisterPage';
import { RoomDetailPage } from '@/pages/room-detail/ui/RoomDetailPage';
import { BookingPage } from '@/pages/booking/ui/BookingPage';
import { ProfilePage } from '@/pages/profile/ui/ProfilePage';
import { ProtectedRoute } from '@/app/providers/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<RoomsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}
