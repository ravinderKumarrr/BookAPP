import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import bookService from '../../services/bookService';

const CATEGORIES = ['Engineering', 'Novels', 'School', 'Competitive', 'Self Help', 'Business', 'Science', 'Comics'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const BrowseBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const condition = searchParams.get('condition') || '';
  const sort = searchParams.get('sort') || 'newest';

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (city) params.city = city;
      if (condition) params.condition = condition;
      if (sort) params.sort = sort;
      const data = await bookService.getBooks(params);
      setBooks(data.books || []);
    } catch (err) {
      setError(err.message || 'Unable to load books.');
    } finally {
      setLoading(false);
    }
  }, [search, category, city, condition, sort]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <div className="container-app py-6 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-textDark mb-4">Browse Books</h1>

      <div className="mb-4">
        <SearchBar compact />
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 text-sm font-medium text-primary bg-cardWhite border border-black/10 px-3 py-2 rounded-xl sm:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="ml-auto bg-cardWhite border border-black/10 rounded-xl px-3 py-2 text-sm text-textDark"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className={`flex-col sm:flex-row gap-3 mb-6 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="bg-cardWhite border border-black/10 rounded-xl px-3 py-2 text-sm text-textDark w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={condition}
          onChange={(e) => updateParam('condition', e.target.value)}
          className="bg-cardWhite border border-black/10 rounded-xl px-3 py-2 text-sm text-textDark w-full sm:w-auto"
        >
          <option value="">Any Condition</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          defaultValue={city}
          placeholder="Filter by city"
          onBlur={(e) => updateParam('city', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && updateParam('city', e.target.value)}
          className="bg-cardWhite border border-black/10 rounded-xl px-3 py-2 text-sm text-textDark w-full sm:w-auto"
        />
      </div>

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

export default BrowseBooks;
