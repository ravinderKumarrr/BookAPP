import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, ShoppingBag, User as UserIcon } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import bookService from '../../services/bookService';
import wishlistService from '../../services/wishlistService';
import orderService from '../../services/orderService';
import messageService from '../../services/messageService';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlisted, setWishlisted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [contactText, setContactText] = useState('');
  const [showContactBox, setShowContactBox] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookService.getBookById(id);
      setBook(data);
    } catch (err) {
      setError(err.message || 'Unable to load book.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) return navigate('/login');
    setActionLoading(true);
    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(book._id);
        setWishlisted(false);
      } else {
        await wishlistService.addToWishlist(book._id);
        setWishlisted(true);
      }
    } catch (err) {
      setActionMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyRequest = async () => {
    if (!isAuthenticated) return navigate('/login');
    setActionLoading(true);
    setActionMessage('');
    try {
      await orderService.createOrder({ bookId: book._id, contactMessage: contactText });
      setActionMessage('Purchase request sent to the seller!');
      navigate('/dashboard/orders');
    } catch (err) {
      setActionMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!contactText.trim()) {
      setActionMessage('Please enter a message to send.');
      return;
    }
    setActionLoading(true);
    setActionMessage('');
    try {
      await messageService.sendMessage({ receiverId: book.seller._id, bookId: book._id, message: contactText });
      setActionMessage('Message sent to the seller!');
      setContactText('');
      setShowContactBox(false);
    } catch (err) {
      setActionMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage label="Loading book..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBook} />;
  if (!book) return <ErrorMessage message="Book not found." />;

  const isOwner = user && book.seller && user._id === book.seller._id;

  return (
    <div className="container-app py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={(book.images && book.images[0]) || FALLBACK_IMAGE}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium bg-secondary/10 text-primary px-3 py-1 rounded-full">{book.category}</span>
            <h1 className="text-xl sm:text-3xl font-bold text-textDark mt-3">{book.title}</h1>
            <p className="text-textDark/60 mt-1">by {book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-bold text-primary">₹{book.price}</span>
            <span className="text-sm bg-bgLight px-3 py-1 rounded-full text-textDark/70">{book.condition}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-textDark/60">
            <MapPin className="w-4 h-4" /> {book.city}
          </div>

          <div>
            <h3 className="font-semibold text-textDark mb-1">Description</h3>
            <p className="text-sm text-textDark/70 whitespace-pre-line">{book.description}</p>
          </div>

          <div className="bg-bgLight rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-textDark">{book.seller?.name}</p>
              <p className="text-xs text-textDark/60">{book.seller?.city}</p>
            </div>
          </div>

          {actionMessage && (
            <div className="text-sm bg-secondary/10 text-primary rounded-lg px-3 py-2">{actionMessage}</div>
          )}

          {!isOwner && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBuyRequest}
                  disabled={actionLoading || book.status !== 'available'}
                  className="flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-60"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {book.status === 'available' ? 'Buy / Request' : 'Not Available'}
                </button>
                <button
                  onClick={() => setShowContactBox((s) => !s)}
                  className="flex items-center gap-2 border border-primary text-primary font-medium px-5 py-2.5 rounded-xl hover:bg-primary/5 transition"
                >
                  <MessageCircle className="w-4 h-4" /> Contact Seller
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={actionLoading}
                  className="flex items-center gap-2 border border-black/10 px-4 py-2.5 rounded-xl hover:bg-bgLight transition"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-accent text-accent' : 'text-primary'}`} />
                </button>
              </div>

              {showContactBox && (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={contactText}
                    onChange={(e) => setContactText(e.target.value)}
                    placeholder="Write a message to the seller..."
                    rows={3}
                    className="bg-bgLight rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-secondary"
                  />
                  <button
                    onClick={handleContactSeller}
                    disabled={actionLoading}
                    className="self-start bg-accent text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-accent/90 transition disabled:opacity-60"
                  >
                    Send Message
                  </button>
                </div>
              )}
            </div>
          )}
          {isOwner && (
            <p className="text-sm text-textDark/60 bg-bgLight rounded-xl px-4 py-3">This is your own listing.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
