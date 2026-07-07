import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/employee/DashboardPage';
import AttendancePage from '../pages/employee/AttendancePage';
import ProfilePage from '../pages/employee/ProfilePage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminEmployeesPage from '../pages/admin/AdminEmployeesPage';
import AdminAttendancesPage from '../pages/admin/AdminAttendancesPage';
import NotFoundPage from '../pages/NotFoundPage';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const AppRouter = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <EmployeeLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        <Route
          path="/attendance"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <EmployeeLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AttendancePage />} />
        </Route>

        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <EmployeeLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
        </Route>

        <Route
          path="/admin/employees"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminEmployeesPage />} />
        </Route>

        <Route
          path="/admin/attendances"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminAttendancesPage />} />
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? user?.role === 'admin'
                    ? '/admin'
                    : '/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;