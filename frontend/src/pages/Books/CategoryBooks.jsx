import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import bookService from '../../services/bookService';

const CategoryBooks = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookService.getBooksByCategory(category);
      setBooks(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <div className="container-app py-6 sm:py-10">
      <Link to="/books" className="flex items-center gap-1 text-sm text-primary mb-4 w-fit hover:underline">
        <ChevronLeft className="w-4 h-4" /> Back to all books
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold text-textDark mb-6">{category} Books</h1>

      {loading && <LoadingSpinner label="Loading books..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchBooks} />}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-textDark/60 py-16">No books found.</p>
      )}
      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBooks;
