import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Trophy, Heart, Briefcase, FlaskConical, Sparkles, BookMarked } from 'lucide-react';

const iconMap = {
  Engineering: BookOpen,
  Novels: BookMarked,
  School: GraduationCap,
  Competitive: Trophy,
  'Self Help': Heart,
  Business: Briefcase,
  Science: FlaskConical,
  Comics: Sparkles,
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const Icon = iconMap[category] || BookOpen;

  return (
    <button
      onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
      className="flex flex-col items-center justify-center gap-2 min-w-[110px] sm:min-w-[130px] bg-cardWhite rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-4 border border-black/5"
    >
      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-sm font-medium text-textDark text-center">{category}</span>
    </button>
  );
};

export default CategoryCard;
