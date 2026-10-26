import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import bookService from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Engineering', 'Novels', 'School', 'Competitive', 'Self Help', 'Business', 'Science', 'Comics'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_COMPRESSED_IMAGE_SIZE = 3 * 1024 * 1024;

const compressBookImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d');
      URL.revokeObjectURL(objectUrl);

      if (!context) {
        reject(new Error('Could not process this image. Please try another file.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not process this image. Please try another file.'));
          return;
        }
        if (blob.size > MAX_COMPRESSED_IMAGE_SIZE) {
          reject(new Error('This image is too large after compression. Please choose another picture.'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read this image. Please try again.'));
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.82);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not open this image. Please choose another picture.'));
    };
    image.src = objectUrl;
  });

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
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [processingImage, setProcessingImage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, image: 'Choose an image file.' }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({ ...current, image: 'Choose an image smaller than 10 MB.' }));
      return;
    }

    setProcessingImage(true);
    setErrors((current) => ({ ...current, image: '' }));
    try {
      setImage(await compressBookImage(file));
    } catch (error) {
      setErrors((current) => ({ ...current, image: error.message }));
    } finally {
      setProcessingImage(false);
    }
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
        images: image ? [image] : [],
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
          <label className="block text-sm font-medium text-textDark mb-1">Book Picture (optional)</label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-medium text-primary cursor-pointer hover:bg-primary/5">
              <ImagePlus className="w-4 h-4" />
              {processingImage ? 'Preparing picture...' : image ? 'Choose a different picture' : 'Add a picture'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={processingImage}
                className="sr-only"
                aria-label="Choose a picture of the book"
              />
            </label>
            {image && (
              <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-black/10">
                <img src={image} alt="Selected book preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-1 right-1 rounded-full bg-white/90 p-1 text-textDark"
                  aria-label="Remove book picture"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-textDark/50 mt-1">Choose a picture from your device. Images are resized before upload.</p>
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
          disabled={loading || processingImage}
          className="bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 mt-2"
        >
          {loading ? 'Listing book...' : 'List Book for Sale'}
        </button>
      </form>
    </div>
  );
};

export default SellBook;
