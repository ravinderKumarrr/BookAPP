import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Wallet, Leaf, ShieldCheck, ArrowRight } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import bookService from '../../services/bookService';

const CATEGORIES = ['Engineering', 'Novels', 'School', 'Competitive', 'Self Help', 'Business', 'Science', 'Comics'];

const FEATURES = [
  { icon: Users, title: 'Local Community', desc: 'Connect with readers and sellers right in your city.' },
  { icon: Wallet, title: 'Affordable Books', desc: 'Get quality books at a fraction of the original price.' },
  { icon: Leaf, title: 'Sustainable Reading', desc: 'Give old books a new home instead of letting them collect dust.' },
  { icon: ShieldCheck, title: 'Trusted Users', desc: 'A safe and simple way to buy and sell with real people.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookService.getBooks({ limit: 8, sort: 'newest' });
      setBooks(data.books || []);
    } catch (err) {
      setError(err.message || 'Unable to load books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary/90 text-white">
        <div className="container-app py-14 sm:py-20 flex flex-col items-center text-center gap-6">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold max-w-3xl leading-tight">
            Find Your Next Favorite Book Near You
          </h1>
          <p className="text-sm sm:text-lg text-white/80 max-w-xl">
            Buy affordable books, sell your old ones, and connect with readers in your city.
          </p>
          <div className="w-full mt-2">
            <SearchBar />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link to="/books" className="bg-white text-primary font-medium px-5 py-2.5 rounded-xl hover:bg-white/90 transition text-sm">
              Browse Books
            </Link>
            <Link to="/sell" className="bg-accent text-white font-medium px-5 py-2.5 rounded-xl hover:bg-accent/90 transition text-sm">
              Sell a Book
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-cardWhite rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col items-start gap-2 border border-black/5">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-textDark">{f.title}</h3>
              <p className="text-xs sm:text-sm text-textDark/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-6 sm:py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-textDark">Popular Categories</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c} category={c} />
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="container-app py-6 sm:py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-textDark">Featured Books Near You</h2>
          <Link to="/books" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && <LoadingSpinner label="Loading books..." />}
        {!loading && error && <ErrorMessage message={error} onRetry={fetchBooks} />}
        {!loading && !error && books.length === 0 && (
          <p className="text-center text-textDark/60 py-10">No books found.</p>
        )}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container-app py-10 sm:py-14">
        <div className="bg-primary rounded-3xl px-6 py-10 sm:py-14 text-center text-white flex flex-col items-center gap-4">
          <h2 className="text-xl sm:text-3xl font-bold">Ready to join BookApp?</h2>
          <p className="text-sm sm:text-base text-white/80 max-w-lg">
            Create a free account to start buying and selling books in your community today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <button onClick={() => navigate('/signup')} className="bg-white text-primary font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition">
              Register
            </button>
            <button onClick={() => navigate('/login')} className="border border-white text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-white/10 transition">
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
