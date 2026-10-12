const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Engineering', 'Novels', 'School', 'Competitive', 'Self Help', 'Business', 'Science', 'Comics'],
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    condition: { type: String, required: true, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
    description: { type: String, required: [true, 'Description is required'] },
    images: { type: [String], default: [] },
    city: { type: String, required: [true, 'City is required'], trim: true },
    status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
