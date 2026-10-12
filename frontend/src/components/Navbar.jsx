import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoIcon from '../assets/logo-icon.svg';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Buy Books', to: '/books' },
    { label: 'Sell Books', to: '/sell' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cardWhite shadow-sm">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoIcon} alt="BookApp" className="h-9 w-auto" />
          <span className="font-bold text-lg text-primary">BookApp</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-medium text-textDark/70 hover:text-primary transition">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 bg-bgLight px-3 py-2 rounded-xl hover:bg-secondary/10 transition"
              >
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-textDark">{user?.name?.split(' ')[0]}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-cardWhite rounded-xl shadow-lg border border-black/5 py-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-textDark hover:bg-bgLight"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-textDark hover:bg-bgLight"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-bgLight w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-primary px-4 py-2 rounded-xl hover:bg-bgLight transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-xl hover:bg-primary/90 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-textDark" onClick={() => setMenuOpen((m) => !m)} aria-label="Toggle menu">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-cardWhite border-t border-black/5 px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-medium text-textDark/80 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-black/5 my-2" />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-textDark/80">
                Dashboard
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-medium text-textDark/80"
              >
                Profile
              </Link>
              <button onClick={handleLogout} className="py-2 text-sm font-medium text-red-600 text-left">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm font-medium text-primary border border-primary px-4 py-2 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm font-medium text-white bg-primary px-4 py-2 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
