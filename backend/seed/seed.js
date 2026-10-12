const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing seed-related data...');
    await Book.deleteMany({});
    await User.deleteMany({ email: 'seller@bookapp.com' });

    console.log('Creating sample seller...');
    const seller = await User.create({
      name: 'Sample Seller',
      email: 'seller@bookapp.com',
      phone: '9876543210',
      password: 'Password1',
      city: 'Ludhiana',
    });

    const sampleBooks = [
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: 'Engineering',
        price: 650,
        condition: 'Good',
        description: 'Classic algorithms textbook, lightly used with some highlighting.',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
        city: 'Ludhiana',
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        category: 'Novels',
        price: 150,
        condition: 'Like New',
        description: 'A beautifully written novel about following your dreams. Barely used.',
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
        city: 'Chandigarh',
      },
      {
        title: 'NCERT Physics Class 12',
        author: 'NCERT',
        category: 'School',
        price: 120,
        condition: 'Fair',
        description: 'Complete NCERT physics textbook for class 12 board exams.',
        images: ['https://images.unsplash.com/photo-1509266272358-7701da638078?w=600'],
        city: 'Ludhiana',
      },
      {
        title: 'Quantitative Aptitude for CAT',
        author: 'Arun Sharma',
        category: 'Competitive',
        price: 300,
        condition: 'Good',
        description: 'Essential prep book for CAT and other competitive exams.',
        images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'],
        city: 'Delhi',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Self Help',
        price: 250,
        condition: 'Like New',
        description: 'Build good habits and break bad ones. Almost new condition.',
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
        city: 'Mumbai',
      },
      {
        title: 'Zero to One',
        author: 'Peter Thiel',
        category: 'Business',
        price: 220,
        condition: 'Good',
        description: 'Notes on startups and building the future. Well maintained.',
        images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600'],
        city: 'Bangalore',
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        category: 'Science',
        price: 200,
        condition: 'Good',
        description: 'An accessible introduction to cosmology and physics.',
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
        city: 'Ludhiana',
      },
      {
        title: 'Watchmen',
        author: 'Alan Moore',
        category: 'Comics',
        price: 400,
        condition: 'Like New',
        description: 'Iconic graphic novel, collector quality, minimal wear.',
        images: ['https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=600'],
        city: 'Chandigarh',
      },
    ];

    console.log('Creating sample books...');
    await Book.insertMany(sampleBooks.map((b) => ({ ...b, seller: seller._id })));

    console.log('Seed data created successfully!');
    console.log(`Sample seller login -> email: seller@bookapp.com | password: Password1`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
