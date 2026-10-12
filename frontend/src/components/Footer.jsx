import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import logoIcon from '../assets/logo-icon.svg';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-12 pb-20 sm:pb-0">
      <div className="container-app py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1">
              <img src={logoIcon} alt="BookApp" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg">BookApp</span>
          </div>
          <p className="text-sm text-white/70">Buy affordable books, sell your old ones, and connect with readers in your city.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/books" className="hover:text-white">Buy Books</Link></li>
            <li><Link to="/sell" className="hover:text-white">Sell Books</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Categories</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/category/Engineering" className="hover:text-white">Engineering</Link></li>
            <li><Link to="/category/Novels" className="hover:text-white">Novels</Link></li>
            <li><Link to="/category/School" className="hover:text-white">School</Link></li>
            <li><Link to="/category/Business" className="hover:text-white">Business</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@bookapp.com</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Ludhiana, Punjab, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} BookApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
