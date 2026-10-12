import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold text-primary mb-2">404</h1>
      <p className="text-textDark/60 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-primary/90 transition text-sm">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
