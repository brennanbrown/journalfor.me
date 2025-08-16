# Deployment Guide - Netlify DB (Neon) Architecture

This guide covers deploying journalfor.me using the new serverless architecture with Netlify DB (Neon) and Netlify Functions.

## Architecture Overview

The application now uses a fully serverless architecture:
- **Frontend**: Static site hosted on Netlify
- **Backend**: Netlify Functions (serverless API endpoints)
- **Database**: Netlify DB (powered by Neon PostgreSQL)

## Prerequisites

- Node.js 18+ installed
- Netlify account with Netlify DB access
- GitHub repository
- Domain name (optional)

---

## Quick Start Deployment

### 1. Database Setup

Your Neon database is already configured:
- **Database**: `late-bread-79709708`
- **Connection**: Automatically available via `NETLIFY_DATABASE_URL`
- **Tables**: Already created (users, entries)

### 2. Deploy to Netlify

1. **Connect Repository**
   ```bash
   git push origin main
   ```

2. **Netlify Configuration**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import from Git"
   - Select your GitHub repo
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: `18`

3. **Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```bash
   NETLIFY_DATABASE_URL=postgresql://neondb_owner:npg_NvsiMb5Wlx9L@ep-late-butterfly-aeb4oy12-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

4. **Deploy**
   - Netlify will automatically build and deploy
   - Functions will be available at `/.netlify/functions/`

---

## API Endpoints

The following Netlify Functions replace the Express server:

### Authentication
- **POST** `/.netlify/functions/auth-register` - User registration
- **POST** `/.netlify/functions/auth-login` - User login

### Entries Management
- **GET** `/.netlify/functions/entries` - Get all entries
- **POST** `/.netlify/functions/entries` - Create new entry
- **GET** `/.netlify/functions/entries/{id}` - Get specific entry
- **PUT** `/.netlify/functions/entries/{id}` - Update entry
- **DELETE** `/.netlify/functions/entries/{id}` - Delete entry

---

## Environment Variables Reference

### **Netlify Site Environment Variables**
```bash
# Database (automatically provided by Netlify DB)
NETLIFY_DATABASE_URL=postgresql://neondb_owner:npg_NvsiMb5Wlx9L@ep-late-butterfly-aeb4oy12-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production
```

### **Frontend Build Environment**
```bash
# API URL points to Netlify Functions
VITE_API_URL=/.netlify/functions
```

---

## Database Management

### Current Database Status
- ✅ Tables created: `users`, `entries`
- ✅ Indexes created for performance
- ✅ Connection tested and working
- ⏰ **Expires**: 2025-08-23 (7 days from creation)

### To Keep Database Active
1. Connect your Neon account to claim the database
2. Visit [Netlify DB documentation](https://docs.netlify.com/storage/netlify-db/)
3. Follow the claiming process to prevent deletion

### Manual Database Operations
```bash
# Connect via psql
psql 'postgresql://neondb_owner:npg_NvsiMb5Wlx9L@ep-late-butterfly-aeb4oy12-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Or use the setup script
node setup-neon-db.js
```

---

## Migration from Railway

### Changes Made
1. **Database**: Migrated from Railway PostgreSQL to Netlify DB (Neon)
2. **Backend**: Converted Express server to Netlify Functions
3. **API Client**: Updated to use template literals instead of parameterized queries
4. **Environment**: Updated to use `NETLIFY_DATABASE_URL`

### Files Updated
- `server/src/database/postgres-connection.ts` - Now uses `@netlify/neon`
- `server/src/controllers/authController.ts` - Updated for Neon client
- `server/src/controllers/entriesController.ts` - Updated for Neon client
- `netlify/functions/` - New serverless functions
- `netlify.toml` - Updated configuration

---

## Testing & Validation

### Database Connection Test
```bash
# Run the connection test
node test-neon-connection.js
```

Expected output:
```
🧪 Testing Neon database connection...
✅ Connection successful. Tables found: [ 'entries', 'users' ]
✅ Test user created successfully
✅ User query successful
✅ Test entry created successfully
✅ Entry query successful: 1 entries found
✅ Entry update successful
✅ Test data cleaned up
🎉 All tests passed! Neon database is ready for production.
```

### Function Testing
After deployment, test the API endpoints:
```bash
# Test registration
curl -X POST https://your-site.netlify.app/.netlify/functions/auth-register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","passwordHash":"hashedpassword","encryptedUserData":"encrypted"}'

# Test login
curl -X POST https://your-site.netlify.app/.netlify/functions/auth-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","passwordHash":"hashedpassword"}'
```

---

## Deployment Checklist

### Pre-Deployment
- [x] Database tables created in Neon
- [x] Netlify Functions created
- [x] Server code updated for Neon client
- [x] Connection tested successfully
- [ ] Environment variables configured in Netlify
- [ ] JWT secret generated

### Deployment
- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Site deployed successfully
- [ ] Functions deployed and accessible

### Post-Deployment
- [ ] Test user registration
- [ ] Test user login
- [ ] Test entry creation/editing
- [ ] Test cross-device sync
- [ ] Claim Neon database to prevent expiration
- [ ] Set up custom domain (optional)

---

## Cost Estimates

### **Netlify + Neon (Current Setup)**
- **Netlify**: Free tier (100GB bandwidth, 300 build minutes)
- **Netlify Functions**: 125K requests/month free
- **Netlify DB (Neon)**: Free tier initially, then pay-per-use
- **Total**: $0-10/month depending on usage

### **Production Scaling**
- **Netlify Pro**: $19/month (more bandwidth, build minutes)
- **Neon Pro**: $25/month (dedicated compute, more storage)
- **Total**: $44/month for production workloads

---

## Monitoring & Maintenance

### **Built-in Monitoring**
- Netlify Analytics (site performance)
- Netlify Functions logs
- Neon database metrics

### **Recommended Tools**
- **Uptime**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Performance**: Netlify Analytics

---

## Troubleshooting

### **Common Issues**

1. **Function Timeout**
   - Netlify Functions have 10s timeout on free tier
   - Optimize database queries for performance

2. **Database Connection**
   ```bash
   # Verify connection string
   echo $NETLIFY_DATABASE_URL
   ```

3. **CORS Issues**
   - Functions include CORS headers automatically
   - Check browser network tab for errors

4. **Build Failures**
   ```bash
   # Test build locally
   npm run build
   ```

### **Debug Commands**
```bash
# Test database connection
node test-neon-connection.js

# Check function logs in Netlify dashboard
# Functions → Function name → Logs

# Local development with Netlify CLI
npm install -g netlify-cli
netlify dev
```

---

## Next Steps

1. **Deploy to Netlify** using the steps above
2. **Set environment variables** in Netlify dashboard
3. **Test all functionality** end-to-end
4. **Claim Neon database** to prevent expiration
5. **Set up monitoring** and alerts
6. **Configure custom domain** (optional)

Your serverless architecture is now production-ready with automatic scaling and zero-knowledge encryption!
