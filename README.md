# BookApp — Local Book Marketplace

A complete full-stack web application: React (Vite + Tailwind) frontend and Node/Express/MongoDB backend, fully wired together with JWT authentication.

---

## 1. Folder Structure

```
bookapp/
├── backend/
│   ├── config/db.js
│   ├── controllers/        (auth, book, user, wishlist, order, message, notification)
│   ├── middleware/         (authMiddleware, errorMiddleware)
│   ├── models/              (User, Book, Order, Wishlist, Message, Notification)
│   ├── routes/               (7 route files matching controllers)
│   ├── seed/seed.js         (8 sample books across all categories)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/     (Navbar, Footer, BookCard, CategoryCard, SearchBar,
    │   │                     ProtectedRoute, LoadingSpinner, ErrorMessage,
    │   │                     MobileBottomNav, DashboardLayout)
    │   ├── pages/
    │   │   ├── Home/Home.jsx
    │   │   ├── Auth/ (Login, SignUp)
    │   │   ├── Books/ (BrowseBooks, BookDetails, CategoryBooks)
    │   │   ├── Sell/SellBook.jsx
    │   │   ├── Dashboard/ (Dashboard, Profile, MyListings, MyOrders,
    │   │   │                Wishlist, Messages, Notifications, Settings)
    │   │   ├── About.jsx, Contact.jsx, NotFound.jsx
    │   ├── services/        (api, authService, bookService, userService,
    │   │                      wishlistService, orderService, messageService,
    │   │                      notificationService)
    │   ├── context/AuthContext.jsx
    │   ├── App.jsx, main.jsx, index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 2. Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string. Fastest option: a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (takes ~3 minutes to create). Alternatively, a local `mongod` if you have MongoDB Community installed.

---

## 3. Setup & Run — Backend

Run setup commands from the repository root:
```bash
npm install --prefix backend
```

Create `backend/.env` with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Seed sample data (8 books across all 8 categories, one sample seller):
```bash
npm run seed --prefix backend
```
This prints a sample login: `seller@bookapp.com` / `Password1`

---

## 4. Setup & Run — Frontend

Install frontend dependencies from the repository root:
```bash
npm install --prefix frontend
```

Install root dependencies and start both servers:
```bash
npm install
npm run dev
```
You can also start both servers from the frontend directory with
`npm run dev`; the frontend script delegates to the root development command.
The frontend runs at `http://localhost:5173`; the backend runs at
`http://localhost:5000`. The frontend's `/api` requests are forwarded by Vite
to the backend. Visit `http://localhost:5000/` to confirm the API is running.
Local development uses the Vite `/api` proxy, so no frontend `.env` file is
needed for local development.

For separate frontend and backend deployments, set `VITE_API_URL` in the
frontend hosting provider to the backend's full API URL, for example
`https://your-backend-url.vercel.app/api`, then rebuild/redeploy the frontend.
Set the backend's `CLIENT_URL` to the frontend's deployed origin as well.

---

## 5. Exact First API To Test

**POST** `http://localhost:5000/api/auth/signup`

Body (JSON):
```json
{
  "name": "Test User",
  "email": "testuser@bookapp.com",
  "phone": "9998887776",
  "password": "TestPass1",
  "confirmPassword": "TestPass1",
  "city": "Ludhiana"
}
```
Expected: `201` with `{ success: true, data: { user, token } }`.

---

## 6. API Endpoint List

| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/signup | No |
| POST | /api/auth/login | No |
| GET | /api/auth/me | Yes |
| POST | /api/auth/logout | Yes |
| GET | /api/books | No |
| GET | /api/books/search?q= | No |
| GET | /api/books/category/:category | No |
| GET | /api/books/city/:city | No |
| GET | /api/books/mine/listings | Yes |
| GET | /api/books/:id | No |
| POST | /api/books | Yes |
| PUT | /api/books/:id | Yes (owner only) |
| DELETE | /api/books/:id | Yes (owner only) |
| GET | /api/users/profile | Yes |
| PUT | /api/users/profile | Yes |
| GET | /api/users/dashboard-stats | Yes |
| GET | /api/wishlist | Yes |
| POST | /api/wishlist/:bookId | Yes |
| DELETE | /api/wishlist/:bookId | Yes |
| POST | /api/orders | Yes |
| GET | /api/orders | Yes |
| GET | /api/orders/:id | Yes |
| PUT | /api/orders/:id/status | Yes |
| GET | /api/messages | Yes |
| GET | /api/messages/:userId | Yes |
| POST | /api/messages | Yes |
| PUT | /api/messages/:id/read | Yes |
| GET | /api/notifications | Yes |
| PUT | /api/notifications/:id/read | Yes |

For protected routes, send header: `Authorization: Bearer <token>` (token returned from signup/login).

---

## 7. Postman Testing Sequence

1. **POST /api/auth/signup** → copy `data.token` from response.
2. **POST /api/auth/login** with the same email/password → confirm you get a token back too.
3. **GET /api/auth/me** with `Authorization: Bearer <token>` → confirm your user profile returns.
4. **GET /api/books** (no auth needed) → after seeding, should return 8 books.
5. **GET /api/books/category/Novels** → should return books tagged Novels.
6. **POST /api/books** with auth header, body:
   ```json
   {
     "title": "Test Book",
     "author": "Test Author",
     "category": "Novels",
     "price": 199,
     "condition": "Good",
     "description": "A test listing created via Postman.",
     "city": "Ludhiana"
   }
   ```
   → 201, returns the created book.
7. **GET /api/books/mine/listings** with auth header → confirm your new book appears.
8. **POST /api/wishlist/:bookId** (use a book `_id` from step 4, seeded by a different user) with auth header → 201.
9. **GET /api/wishlist** with auth header → confirm the item appears.
10. **POST /api/orders** with auth header, body `{ "bookId": "<a seeded book id>", "contactMessage": "Interested!" }` → 201 (use a book you don't own — signup a second test user first if needed).
11. **GET /api/orders** with auth header → confirm the order appears.
12. **PUT /api/orders/:id/status** with auth header (as the seller), body `{ "status": "accepted" }` → 200.
13. **POST /api/messages** with auth header, body `{ "receiverId": "<seller id>", "message": "Hi, is this still available?" }` → 201.
14. **GET /api/messages** with auth header → confirm conversation list appears.
15. **GET /api/notifications** with auth header → confirm notifications generated by the order/message steps above appear.

---

## 8. Sample Test Data (after `npm run seed`)

- Sample seller login: `seller@bookapp.com` / `Password1`
- 8 books, one per category: Engineering, Novels, School, Competitive, Self Help, Business, Science, Comics — all owned by the sample seller, cities across Ludhiana/Chandigarh/Delhi/Mumbai/Bangalore.

To fully test buyer flows (wishlist, orders, messages), sign up a **second** account (e.g. via the frontend `/signup` page or Postman) — you cannot wishlist/order/message your own listings.

---

## 9. Final Verification Checklist

- [ ] Backend starts with `npm run dev` and `GET http://localhost:5000/` returns success
- [ ] `npm run seed` populates 8 books
- [ ] Frontend starts with `npm run dev` and loads at `http://localhost:5173`
- [ ] Home page shows hero, search bar, categories, and featured books from the API
- [ ] Signup creates an account and redirects to `/dashboard`
- [ ] Login works and persists across page refresh (token in localStorage)
- [ ] Logout clears session and redirects to `/login`
- [ ] `/books` search/filter/sort all update results
- [ ] Clicking a book card navigates to `/books/:id` with full details
- [ ] Clicking a category navigates to `/category/:category` with filtered results
- [ ] `/sell` (logged in) creates a book and redirects to `/dashboard/listings`
- [ ] Visiting `/sell` while logged out redirects to `/login`
- [ ] Dashboard shows stats (Books Listed, Sold, Wishlist, Active Orders) and recent activity
- [ ] Wishlist add/remove works from book cards and detail page
- [ ] Buy/Request creates an order visible in `/dashboard/orders` for both buyer and seller
- [ ] Seller can accept/reject/complete orders; buyer can cancel pending orders
- [ ] Messages page lists conversations and supports sending/receiving
- [ ] Notifications appear after order and message actions, and can be marked read
- [ ] Profile and Settings update the user's name/phone/city/password
- [ ] All pages render correctly at 320px, 375px, 768px, 1024px, 1440px with no horizontal scroll
- [ ] Mobile bottom nav appears under 640px; sidebar collapses into a toggle on dashboard pages
- [ ] Every API-backed page shows a loading state, an error state (try stopping the backend), and an empty state (e.g. empty wishlist)
