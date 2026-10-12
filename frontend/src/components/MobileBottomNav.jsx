import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, PlusCircle, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const { isAuthenticated } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-0.5 text-[11px] flex-1 py-2 ${
      isActive ? 'text-primary' : 'text-textDark/50'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-cardWhite border-t border-black/5 flex sm:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <NavLink to="/" end className={linkClass}>
        <Home className="w-5 h-5" />
        Home
      </NavLink>
      <NavLink to="/books" className={linkClass}>
        <BookOpen className="w-5 h-5" />
        Books
      </NavLink>
      <NavLink to="/sell" className={linkClass}>
        <PlusCircle className="w-5 h-5" />
        Sell
      </NavLink>
      <NavLink to={isAuthenticated ? '/dashboard' : '/login'} className={linkClass}>
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </NavLink>
      <NavLink to={isAuthenticated ? '/dashboard/profile' : '/login'} className={linkClass}>
        <User className="w-5 h-5" />
        Profile
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
