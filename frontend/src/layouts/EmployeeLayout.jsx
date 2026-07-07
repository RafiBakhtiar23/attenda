import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, User, LogOut, Home, History } from 'lucide-react';

const EmployeeLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const mobileNav = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'History', path: '/attendance', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-attenda-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-attenda-dark text-white fixed inset-y-0 left-0">
        <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 mb-12">
            <div className="w-8 h-8 bg-attenda-lime rounded-lg"></div>
            <span className="text-xl font-bold">Attenda</span>
          </div>

          {/* Navigation */}
          <motion.nav
            className="flex-1 px-4 space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {navigation.map((item) => (
              <motion.div key={item.path} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-attenda-lime text-attenda-dark'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.name}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>

          {/* User Profile */}
          <motion.div
            className="px-4 mt-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="border-t border-white/10 pt-4 mb-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                <motion.div
                  className="w-10 h-10 rounded-full bg-attenda-lime flex items-center justify-center text-attenda-dark font-bold text-sm"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {getInitials(user?.full_name)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.full_name}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <main className="min-h-screen pb-20 lg:pb-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-attenda-surface border-t border-attenda-border z-50">
        <div className="flex justify-around items-center h-16">
          {mobileNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-attenda-dark' : 'text-attenda-muted'
                }`
              }
            >
              <item.icon size={22} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default EmployeeLayout;