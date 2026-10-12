import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import wishlistService from '../../services/wishlistService';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await wishlistService.getWishlist();
      setItems((data || []).filter((i) => i.book));
    } catch (err) {
      setError(err.message || 'Unable to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistChange = (bookId, isWishlisted) => {
    if (!isWishlisted) {
      setItems((prev) => prev.filter((i) => i.book._id !== bookId));
    }
  };

  return (
    <DashboardLayout title="My Wishlist">
      {loading && <LoadingSpinner label="Loading wishlist..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchWishlist} />}
      {!loading && !error && items.length === 0 && (
        <p className="text-center text-textDark/60 py-16">No books in your wishlist yet.</p>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <BookCard key={item._id} book={item.book} initialWishlisted onWishlistChange={handleWishlistChange} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Wishlist;
