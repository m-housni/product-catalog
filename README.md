# Product Catalog App
A minimal but functional product catalog application with a REST API backend and React frontend

<img width="1077" height="798" alt="image" src="https://github.com/user-attachments/assets/a9040b97-93a0-449a-bada-90db1f6f03f4" />

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Backend  | Node.js, Express, TypeScript        |
| Database | SQLite (via better-sqlite3 + Drizzle ORM) |
| Frontend | React 19, TypeScript, Vite          |
| Styling  | CSS Modules                         |
| DevOps   | Docker, docker-compose, nginx       |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts      # Drizzle ORM schema (Product, Category, Cart, CartItem)
│   │   │   ├── index.ts       # SQLite connection
│   │   │   └── seed.ts        # Seed script (5 categories, 20 products)
│   │   ├── routes/
│   │   │   ├── products.ts    # GET /products (paginated, filterable, sortable)
│   │   │   ├── categories.ts  # GET /categories (with product counts)
│   │   │   └── cart.ts        # Cart CRUD (POST, GET, DELETE)
│   │   └── index.ts           # Express entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/index.ts       # API client (fetchProducts, fetchCategories)
│   │   ├── components/
│   │   │   ├── ProductCard.tsx # Product display card with image, price, stock
│   │   │   ├── ProductGrid.tsx # CSS grid layout with loading skeletons
│   │   │   ├── CategoryFilter.tsx  # Horizontal pill-style filter buttons
│   │   │   ├── SortSelect.tsx # Sort dropdown (price, name, newest)
│   │   │   └── Pagination.tsx # Page navigation with prev/next
│   │   ├── hooks/useProducts.ts    # Custom hook for product state management
│   │   ├── types/index.ts    # TypeScript interfaces
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Local Development

**Backend:**

```bash
cd backend
npm install
npm run seed    # Create & seed the SQLite database
npm run dev     # Start dev server on http://localhost:4000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev     # Start Vite dev server on http://localhost:5173
```

The frontend dev server proxies `/api/*` requests to `http://localhost:4000`.

### Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## API Documentation

### `GET /products`

Returns paginated products with optional filtering and sorting.

**Query Parameters:**

| Param        | Type    | Default  | Description                              |
| ------------ | ------- | -------- | ---------------------------------------- |
| `page`       | number  | 1        | Page number                              |
| `limit`      | number  | 12       | Items per page (max 100)                 |
| `categoryId` | number  | —        | Filter by category ID                    |
| `sort`       | string  | `newest` | `newest`, `price_asc`, `price_desc`, `name_asc`, `name_desc` |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "price": 79.99,
      "category": "Electronics",
      "categoryId": 1,
      "imageUrl": "https://picsum.photos/seed/product1/400/300",
      "amount": 25,
      "createdAt": "2026-03-27T12:00:00"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 12,
  "totalPages": 2
}
```

### `GET /categories`

Returns all categories with product counts.

```json
[
  { "id": 1, "name": "Electronics", "productCount": 5 },
  { "id": 2, "name": "Clothing", "productCount": 4 }
]
```

### `POST /cart`

Creates a new shopping cart (expires in 24h).

### `GET /cart/:id`

Returns cart with all items and product details.

### `POST /cart/:id/items`

Adds a product to the cart. Body: `{ "productId": 1, "quantity": 2 }`

### `DELETE /cart/:id/items/:itemId`

Removes an item from the cart.

## Architecture Decisions & Tradeoffs

| Decision                     | Reasoning                                                    |
| ---------------------------- | ------------------------------------------------------------ |
| **SQLite + Drizzle ORM**     | Zero-config database with type-safe queries. Perfect for a catalog app that's primarily read-heavy. Drizzle adds minimal overhead while providing full TypeScript integration. |
| **No global state library**  | `useState` + a custom hook (`useProducts`) is sufficient at this scale. Adding Redux/Zustand would be over-engineering. |
| **CSS Modules**              | Scoped styling with zero configuration. Focus stays on logic and structure per spec requirements. |
| **Pagination over infinite scroll** | Simpler implementation, predictable UX for catalog browsing, and aligns with spec preference. |
| **Vite proxy for dev**       | Avoids CORS complexity during development. The `/api` prefix naturally maps to the backend in both dev (proxy) and prod (nginx reverse proxy). |
| **Cart endpoints included**  | Demonstrates CRUD capability beyond the required read-only endpoints, without over-scoping. |

## Reflection

### What would I improve with more time?

- **Authentication**: Add user accounts with JWT for personalized carts and favorites
- **Search**: Full-text search across product names and descriptions using SQLite FTS5
- **Testing**: Comprehensive test suite (see below)
- **Optimistic UI**: Cart additions reflected immediately, rolled back on error
- **Image handling**: Upload to S3/CloudFlare R2 instead of placeholder URLs
- **Product details page**: Individual product view with full description, reviews
- **Error boundaries**: React error boundaries for graceful component-level failure

### How would I scale this?

- **Database**: Migrate from SQLite to PostgreSQL for concurrent writes and better scaling
- **Caching**: Add Redis for frequently accessed data (categories, popular products)
- **CDN**: Serve frontend via CloudFlare/Vercel; cache product images on CDN
- **API**: Add rate limiting, request validation (Zod), and API versioning
- **Backend**: Deploy behind a load balancer with multiple instances; use connection pooling
- **Search**: Integrate Elasticsearch or Typesense for advanced product search and faceted filtering

### What tests would I implement?

- **Unit tests (backend)**: Route handlers with supertest — verify pagination math, filter logic, error responses
- **Unit tests (frontend)**: Component rendering with React Testing Library — card displays correct data, filter state changes, pagination navigation
- **Integration tests**: API + database round-trip — seed data, hit endpoints, verify JSON shape
- **E2E tests**: Playwright — load page, click category filter, verify products update, navigate pages
- **Snapshot tests**: Component HTML structure to catch unintended markup changes
