import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Engineering', 'Novels', 'School', 'Competitive', 'Self Help', 'Business', 'Science', 'Comics'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const SellBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    condition: '',
    description: '',
    city: user?.city || '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Enter a valid price';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.description.trim() || formData.description.trim().length < 10)
      newErrors.description = 'Description must be at least 10 characters';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        price: Number(formData.price),
        condition: formData.condition,
        description: formData.description,
        city: formData.city,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };
      await bookService.createBook(payload);
      navigate('/dashboard/listings');
    } catch (err) {
      setServerError(err.message || 'Failed to list book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'bg-bgLight rounded-xl px-3 py-2.5 text-sm outline-none border border-transparent focus:border-secondary w-full';

  return (
    <div className="container-app py-6 sm:py-10 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-textDark mb-2">Sell a Book</h1>
      <p className="text-sm text-textDark/60 mb-6">Fill in the details below to list your book for sale.</p>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-cardWhite rounded-2xl shadow-sm p-5 sm:p-8 flex flex-col gap-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-textDark mb-1">Title</label>
          <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Introduction to Algorithms" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-textDark mb-1">Author</label>
          <input name="author" value={formData.author} onChange={handleChange} className={inputClass} placeholder="e.g. Thomas H. Cormen" />
          {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Condition</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g. 250" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textDark mb-1">City</label>
            <input name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="e.g. Ludhiana" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textDark mb-1">Book Image URL (optional)</label>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-textDark mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="Describe the book's condition, edition, and any other details..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 mt-2"
        >
          {loading ? 'Listing book...' : 'List Book for Sale'}
        </button>
      </form>
    </div>
  );
};

export default SellBook;
