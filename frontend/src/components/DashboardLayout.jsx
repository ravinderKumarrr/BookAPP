import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, BookMarked, ShoppingBag, Heart, MessageCircle, Bell, Settings as SettingsIcon, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'My Profile', to: '/dashboard/profile', icon: User },
  { label: 'My Listings', to: '/dashboard/listings', icon: BookMarked },
  { label: 'My Orders', to: '/dashboard/orders', icon: ShoppingBag },
  { label: 'My Wishlist', to: '/dashboard/wishlist', icon: Heart },
  { label: 'Messages', to: '/dashboard/messages', icon: MessageCircle },
  { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', to: '/dashboard/settings', icon: SettingsIcon },
];

const DashboardLayout = ({ title, children }) => {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive ? 'bg-primary text-white' : 'text-textDark/70 hover:bg-bgLight'
    }`;

  return (
    <div className="container-app py-6 sm:py-10">
      <div className="flex items-center justify-between mb-4 sm:hidden">
        <h1 className="text-lg font-bold text-textDark">{title}</h1>
        <button onClick={() => setMobileOpen((o) => !o)} className="p-2 bg-cardWhite rounded-xl border border-black/10">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <aside className={`sm:w-64 shrink-0 ${mobileOpen ? 'block' : 'hidden'} sm:block`}>
          <div className="bg-cardWhite rounded-2xl shadow-sm p-4 flex flex-col gap-1 sm:sticky sm:top-20">
            <div className="flex items-center gap-3 px-2 pb-3 mb-2 border-b border-black/5">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-textDark">{user?.name}</p>
                <p className="text-xs text-textDark/50">{user?.city}</p>
              </div>
            </div>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setMobileOpen(false)}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition text-left mt-1">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-textDark mb-6 hidden sm:block">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
