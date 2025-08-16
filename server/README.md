# Journal for Me - Backend API

Zero-knowledge encrypted journaling backend with PostgreSQL storage.

## Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

3. **Set up database:**
   ```bash
   # Create database
   createdb journalfor_me
   
   # Run migrations
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Entries (Authenticated)
- `GET /api/entries` - Get all user entries
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Health Check
- `GET /health` - Server health status

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/journalfor_me
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,https://journalfor.me
```

## Security Features

- **Zero-knowledge encryption**: Server never sees unencrypted data
- **JWT authentication**: Secure token-based auth
- **Rate limiting**: 100 requests per 15 minutes per IP
- **CORS protection**: Configurable allowed origins
- **Input validation**: Zod schema validation
- **SQL injection protection**: Parameterized queries

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Test coverage
npm test -- --coverage
```

## Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## Architecture

- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Input validation
- **Helmet** - Security headers
