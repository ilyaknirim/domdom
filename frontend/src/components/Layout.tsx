import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  HeartIcon as HeartIconSolid,
  UserIcon as UserIconSolid,
  CalendarIcon as CalendarIconSolid,
} from '@heroicons/react/24/solid';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    {
      path: '/',
      label: t('common.search'),
      icon: MagnifyingGlassIcon,
      iconActive: MagnifyingGlassIconSolid,
    },
    {
      path: '/favorites',
      label: t('common.favorites'),
      icon: HeartIcon,
      iconActive: HeartIconSolid,
    },
    {
      path: '/bookings',
      label: t('common.bookings'),
      icon: CalendarIcon,
      iconActive: CalendarIconSolid,
    },
    {
      path: '/profile',
      label: t('common.profile'),
      icon: UserIcon,
      iconActive: UserIconSolid,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/search');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <main className="safe-area-inset-top">{children}</main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.iconActive : item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
