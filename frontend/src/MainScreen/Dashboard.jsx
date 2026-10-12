import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Users,
  Tag,
  Globe2,
  BadgeCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Lightbulb,
  BriefcaseBusiness,
  FlaskConical,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import logo from "../assets/book_app_logo.png";

/*
  BookApp Dashboard

  This dashboard follows the supplied design:
  - Top navigation + BookApp logo
  - Hero section
  - Right-side illustration
  - Search bar
  - Feature highlights
  - Popular categories
  - Featured Books Near You
  - Footer

  Later, replace the sample featuredBooks array with books received
  from your backend/API.
*/

const categories = [
  { name: "Engineering", icon: Users },
  { name: "Novels", icon: BookOpen },
  { name: "School", icon: GraduationCap },
  { name: "Competitive", icon: BadgeCheck },
  { name: "Self Help", icon: Lightbulb },
  { name: "Business", icon: BriefcaseBusiness },
  { name: "Science", icon: FlaskConical },
  { name: "Comics", icon: MessageSquare },
];

const sampleBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: 250,
    city: "Jalandhar",
    category: "Self Help",
    badge: "TINY CHANGES",
    cover: "cream",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 200,
    city: "Jalandhar",
    category: "Novels",
    badge: "POPULAR",
    cover: "orange",
  },
  {
    id: 3,
    title: "Data Structures",
    author: "Mark Allen Weiss",
    price: 300,
    city: "Jalandhar",
    category: "Engineering",
    badge: "COMPUTER SCIENCE",
    cover: "navy",
  },
  {
    id: 4,
    title: "It Ends With Us",
    author: "Colleen Hoover",
    price: 250,
    city: "Jalandhar",
    category: "Novels",
    badge: "BESTSELLER",
    cover: "pink",
  },
];

function HeroIllustration() {
  return (
    <div className="relative h-full min-h-[390px] w-full overflow-hidden rounded-[2rem] bg-[#f5f8fb]">
      <div className="absolute left-8 top-12 z-10 max-w-[150px] text-[27px] font-semibold italic leading-[1.15] text-slate-700">
        Good
        <br />
        Today
        <br />
        Brighter
        <br />
        People
      </div>

      <div className="absolute right-6 top-14 rounded-2xl bg-white px-6 py-5 text-center shadow-[0_8px_25px_rgba(15,40,78,0.10)]">
        <p className="text-xs font-semibold leading-5 text-slate-700">
          A Book
          <br />
          Today
          <br />
          A Better
          <br />
          Tomorrow
        </p>
        <div className="mx-auto mt-2 h-0.5 w-5 bg-sky-600" />
      </div>

      {/* Simple book/plant illustration so the dashboard works without
          requiring another image asset. */}
      <div className="absolute bottom-[118px] left-1/2 -translate-x-1/2">
        <div className="relative h-[180px] w-[230px]">
          <div className="absolute bottom-0 left-0 h-[42px] w-[230px] rounded-xl bg-[#27567f] shadow-md" />

          <div className="absolute bottom-[42px] left-[40px] h-[20px] w-[150px] rounded bg-slate-100" />

          <div className="absolute bottom-[55px] left-[92px] h-[105px] w-[45px] rounded-t-[55%] bg-slate-200" />

          <div className="absolute bottom-[138px] left-[108px] h-[70px] w-[28px] -rotate-12 rounded-full bg-emerald-700" />
          <div className="absolute bottom-[133px] left-[87px] h-[68px] w-[30px] -rotate-[38deg] rounded-full bg-emerald-500" />
          <div className="absolute bottom-[139px] left-[126px] h-[78px] w-[30px] rotate-[34deg] rounded-full bg-emerald-800" />
          <div className="absolute bottom-[126px] left-[73px] h-[58px] w-[26px] -rotate-[55deg] rounded-full bg-emerald-400" />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 w-[80%] -translate-x-1/2 rounded-xl bg-white/95 p-3 shadow-lg">
        <div className="rounded-md bg-[#27567f] py-2 text-center text-xs font-bold tracking-wide text-white">
          THINK BIG
        </div>
        <div className="mt-1.5 grid grid-cols-1 gap-1.5 text-xs">
          <div className="rounded bg-[#faf8f2] px-4 py-2 font-semibold text-slate-700 shadow-sm">
            ★ &nbsp; Atomic Habits
          </div>
          <div className="rounded bg-[#e9ddd0] px-4 py-2 font-serif font-semibold text-slate-700">
            I- &nbsp; The Alchemist
          </div>
          <div className="rounded bg-[#102f4a] px-4 py-2 font-semibold text-sky-300">
            # &nbsp; Clean Code
          </div>
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }) {
  const coverClasses = {
    cream: "bg-[#faf8f2] text-slate-800",
    orange: "bg-orange-500 text-white",
    navy: "bg-[#122d48] text-white",
    pink: "bg-[#fff0f6] text-slate-800",
  };

  return (
    <article className="min-w-[190px] flex-1 rounded-2xl bg-white p-3 shadow-[0_5px_18px_rgba(15,40,78,0.07)]">
      <div
        className={`relative flex h-[195px] flex-col justify-between overflow-hidden rounded-xl p-3 ${coverClasses[book.cover] || coverClasses.cream}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-wide opacity-80">
            {book.badge}
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400"
            aria-label={`Favorite ${book.title}`}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center">
          <div className="mb-2 text-[16px] font-bold leading-tight">{book.title}</div>
          <div className="text-[10px] opacity-75">{book.author}</div>
        </div>

        <div className="mx-auto h-1 w-10 rounded bg-current opacity-50" />
      </div>

      <div className="pt-3">
        <h3 className="truncate text-sm font-bold text-slate-800">{book.title}</h3>
        <p className="truncate text-xs text-slate-400">{book.author}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">₹{book.price}</span>
          <Heart className="h-4 w-4 text-slate-300" />
        </div>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
          <MapPin className="h-3 w-3" />
          {book.city}
        </div>
      </div>
    </article>
  );
}

export default function Dashboard({ featuredBooks = sampleBooks }) {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [bookIndex, setBookIndex] = useState(0);

  const books = featuredBooks?.length ? featuredBooks : sampleBooks;

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return books;

    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.category?.toLowerCase().includes(query)
    );
  }, [books, search]);

  const visibleBooks = filteredBooks.slice(bookIndex, bookIndex + 4);

  const moveLeft = () => {
    setBookIndex((current) => Math.max(0, current - 1));
  };

  const moveRight = () => {
    setBookIndex((current) =>
      Math.min(Math.max(0, filteredBooks.length - 4), current + 1)
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white">
        <div className="mx-auto flex min-h-[80px] max-w-[1280px] items-center gap-6 px-4 lg:px-8">
          <a href="/" className="shrink-0">
            <img src={logo} alt="BookApp" className="h-[62px] w-auto" />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {["Home", "Buy Books", "Sell Books", "Categories", "About Us", "Contact Us"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className={`text-[15px] font-medium ${
                    item === "Home"
                      ? "border-b-2 border-sky-600 pb-1 text-sky-700"
                      : "text-slate-600 hover:text-sky-700"
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:block"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <a
              href="/"
              className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-medium text-slate-700"
            >
              Login
            </a>

            <a
              href="/signup"
              className="rounded-lg bg-[#237bc0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d6eac]"
            >
              Register
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
        {/* ================= HERO ================= */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="flex min-h-[390px] flex-col justify-center rounded-[2rem] bg-[#f7f9fc] px-2 py-8 lg:px-0">
            <div className="mb-7 h-8 w-44 rounded-full bg-white" />

            <h1 className="max-w-[590px] text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#111a31] sm:text-6xl">
              Find Your Next
              <br />
              Favorite Book
              <br />
              Near You
            </h1>

            <p className="mt-5 max-w-[560px] text-lg leading-8 text-slate-500">
              Buy affordable books, sell your old ones, and connect with
              readers in your city.
            </p>
          </div>

          <HeroIllustration />
        </section>

        {/* ================= SEARCH ================= */}
        <section className="relative z-10 -mt-2 rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgba(15,40,78,0.10)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 border-b border-slate-100 px-3 py-3 md:border-b-0 md:border-r">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setBookIndex(0);
                }}
                placeholder="Search books, authors, or categories..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="relative md:w-[180px]">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none rounded-lg bg-white py-3 pl-9 pr-8 text-sm text-slate-600 outline-none"
              >
                <option>Select City</option>
                <option>Jalandhar</option>
                <option>Hoshiarpur</option>
                <option>Ludhiana</option>
                <option>Amritsar</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#237bc0] px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#1d6eac]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </section>

        {/* ================= BENEFITS ================= */}
        <section className="grid grid-cols-2 gap-5 py-8 md:grid-cols-4">
          {[
            { icon: Users, text: "Local Community" },
            { icon: Tag, text: "Affordable Books" },
            { icon: Globe2, text: "Sustainable Reading" },
            { icon: BadgeCheck, text: "Trusted Users" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-slate-600">{text}</span>
            </div>
          ))}
        </section>

        {/* ================= CONTENT ================= */}
        <section className="grid gap-7 lg:grid-cols-[0.85fr_1.25fr]">
          {/* Popular categories */}
          <div className="rounded-[1.8rem] bg-white p-6 shadow-[0_5px_20px_rgba(15,40,78,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111a31]">Popular Categories</h2>
              <button type="button" className="text-sm font-medium text-sky-600">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-2">
              {categories.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  className="group flex flex-col items-center gap-2"
                  onClick={() => setSearch(name)}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-100">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-medium text-slate-600">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured books */}
          <div className="rounded-[1.8rem] bg-white p-6 shadow-[0_5px_20px_rgba(15,40,78,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111a31]">Featured Books Near You</h2>
              <button type="button" className="text-sm font-medium text-sky-600">
                View All →
              </button>
            </div>

            {visibleBooks.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {visibleBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {filteredBooks.length > 4 && (
                  <>
                    <button
                      type="button"
                      onClick={moveLeft}
                      disabled={bookIndex === 0}
                      className="absolute -left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md disabled:opacity-40"
                      aria-label="Previous books"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={moveRight}
                      disabled={bookIndex >= filteredBooks.length - 4}
                      className="absolute -right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md disabled:opacity-40"
                      aria-label="Next books"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <Sparkles className="mb-3 h-8 w-8 text-slate-300" />
                <p className="font-semibold text-slate-600">No books found</p>
                <p className="mt-1 text-sm text-slate-400">
                  Try another title, author, or category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-6 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 BookApp. All rights reserved. Buy and sell used books nearby.</p>

          <div className="flex gap-5">
            <a href="#" className="hover:text-sky-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-sky-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-sky-600">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
