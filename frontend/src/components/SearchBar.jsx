import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const CATEGORIES = ['Engineering', 'Novels', 'School', 'Competitive', 'Self Help', 'Business', 'Science', 'Comics'];

const SearchBar = ({ compact = false }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    if (city.trim()) params.set('city', city.trim());
    navigate(`/books?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-cardWhite rounded-2xl shadow-md p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 ${
        compact ? '' : 'max-w-3xl mx-auto'
      }`}
    >
      <div className="flex items-center gap-2 flex-1 bg-bgLight rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-textDark/40 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Title or author"
          className="bg-transparent outline-none text-sm w-full text-textDark placeholder:text-textDark/40"
        />
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-bgLight rounded-xl px-3 py-2 text-sm text-textDark outline-none w-full sm:w-40"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2 bg-bgLight rounded-xl px-3 py-2 w-full sm:w-40">
        <MapPin className="w-4 h-4 text-textDark/40 shrink-0" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="bg-transparent outline-none text-sm w-full text-textDark placeholder:text-textDark/40"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-primary/90 transition shrink-0"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
