import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import wishlistService from '../services/wishlistService';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600';

const BookCard = ({ book, initialWishlisted = false, onWishlistChange }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  if (!book) return null;

  const handleCardClick = () => {
    navigate(`/books/${book._id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(book._id);
        setWishlisted(false);
        if (onWishlistChange) onWishlistChange(book._id, false);
      } else {
        await wishlistService.addToWishlist(book._id);
        setWishlisted(true);
        if (onWishlistChange) onWishlistChange(book._id, true);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-cardWhite rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden flex flex-col border border-black/5"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <img
          src={(book.images && book.images[0]) || FALLBACK_IMAGE}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <button
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          aria-label="Toggle wishlist"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-105 transition disabled:opacity-60"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-accent text-accent' : 'text-primary'}`} />
        </button>
        <span className="absolute bottom-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
          {book.condition}
        </span>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-textDark text-sm sm:text-base line-clamp-1">{book.title}</h3>
        <p className="text-xs sm:text-sm text-textDark/60 line-clamp-1">{book.author}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-primary font-bold text-base sm:text-lg">₹{book.price}</span>
          <span className="flex items-center gap-1 text-xs text-textDark/50">
            <MapPin className="w-3 h-3" />
            {book.city}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
