import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Eye, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import bookService from '../../services/bookService';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200';

const statusColors = {
  available: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-gray-200 text-gray-600',
};

const MyListings = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookService.getMyListings();
      setBooks(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await bookService.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout title="My Listings">
      <div className="flex justify-end mb-4">
        <Link to="/sell" className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition">
          <PlusCircle className="w-4 h-4" /> List New Book
        </Link>
      </div>

      {loading && <LoadingSpinner label="Loading your listings..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchListings} />}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-textDark/60 py-16">No books found. Start by listing your first book.</p>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="flex flex-col gap-3">
          {books.map((book) => (
            <div key={book._id} className="bg-cardWhite rounded-2xl shadow-sm p-3 flex items-center gap-4 border border-black/5">
              <img
                src={(book.images && book.images[0]) || FALLBACK_IMAGE}
                alt={book.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-textDark truncate">{book.title}</p>
                <p className="text-xs text-textDark/50">₹{book.price} · {book.city}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize shrink-0 ${statusColors[book.status] || ''}`}>{book.status}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/books/${book._id}`} className="p-2 rounded-lg hover:bg-bgLight" aria-label="View">
                  <Eye className="w-4 h-4 text-primary" />
                </Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  disabled={deletingId === book._id}
                  className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyListings;
