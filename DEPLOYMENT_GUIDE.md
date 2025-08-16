# Deployment Guide 🚀

## Architecture Overview

Your journalfor.me app uses a **hybrid architecture** requiring two separate deployments:

1. **Frontend**: Static React/TypeScript app (Vite build)
2. **Backend**: Node.js/Express API server with database

## Recommended Deployment Strategy

### 🎯 **Option 1: Railway + Netlify (Recommended)**

**Why this combination:**
- Railway: Excellent Node.js + PostgreSQL integration
- Netlify: Best-in-class static site hosting
- Combined cost: ~$5-15/month for production
- Automatic deployments from GitHub

---

## Frontend Deployment

### **Netlify (Recommended)**

#### Setup Steps:
1. **Connect Repository**
   ```bash
   # Push your code to GitHub first
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
   ```bash
   # In Netlify dashboard → Site settings → Environment variables
   VITE_API_URL=https://your-backend-url.railway.app
   ```

4. **Custom Domain** (Optional)
   - Add your domain in Netlify dashboard
   - Update DNS records as instructed

#### Alternative: **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Backend Deployment

### **Railway (Recommended)**

#### Why Railway:
- ✅ Automatic PostgreSQL setup
- ✅ GitHub integration
- ✅ Environment variable management
- ✅ $5/month starter plan
- ✅ Built-in monitoring

#### Setup Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # From your project root
   cd server
   
   # Create railway.json (optional)
   echo '{
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/health"
     }
   }' > railway.json
   ```

3. **Connect Repository**
   - In Railway dashboard: "New Project" → "Deploy from GitHub repo"
   - Select your repo
   - Choose the `server` folder as root

4. **Add PostgreSQL Database**
   - In Railway project: "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

5. **Environment Variables**
   ```bash
   # In Railway dashboard → Variables
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-here
   JWT_EXPIRES_IN=7d
   PORT=3001
   ALLOWED_ORIGINS=https://your-netlify-domain.netlify.app,https://yourdomain.com
   ```

6. **Update Backend for Production**
   ```javascript
   // server/src/database/connection.ts
   // Update to use PostgreSQL in production
   import { Pool } from 'pg';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
   });
   ```

#### Alternative Backend Options:

**Render** (Free tier available)
- ✅ Free PostgreSQL for 90 days
- ❌ Spins down after 15min inactivity
- ❌ 50s cold start time

**Fly.io** (Best performance)
- ✅ Global edge deployment
- ✅ Best performance
- ❌ More complex setup
- ❌ Limited free tier

---

## Database Options

### **Production Database Recommendations:**

1. **Railway PostgreSQL** (Included)
   - $5/month with Railway plan
   - Automatic backups
   - Easy setup

2. **Supabase** (Alternative)
   - $25/month for production
   - Real-time features
   - Built-in auth (if you want to migrate)

3. **Neon** (Serverless)
   - Pay-per-use pricing
   - Automatic scaling
   - Great for variable traffic

---

## Deployment Checklist

### Pre-Deployment:
- [ ] Update API URLs in frontend environment variables
- [ ] Set up production environment variables
- [ ] Test build process locally
- [ ] Update CORS origins for production domains
- [ ] Generate secure JWT secret

### Backend Deployment:
- [ ] Deploy to Railway/Render
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Test API endpoints
- [ ] Run database migrations

### Frontend Deployment:
- [ ] Deploy to Netlify/Vercel
- [ ] Configure build settings
- [ ] Set API URL environment variable
- [ ] Test frontend functionality
- [ ] Set up custom domain (optional)

### Post-Deployment:
- [ ] Test cross-device sync functionality
- [ ] Verify authentication flow
- [ ] Test entry creation/editing
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## Cost Estimates

### **Budget Option (~$5-10/month):**
- Railway Starter: $5/month (backend + PostgreSQL)
- Netlify: Free tier (100GB bandwidth)

### **Production Option (~$15-25/month):**
- Railway Pro: $20/month (better performance)
- Netlify Pro: $19/month (more bandwidth, analytics)

### **Enterprise Option (~$50+/month):**
- Dedicated database hosting
- CDN optimization
- Advanced monitoring

---

## Environment Variables Reference

### **Frontend (.env.production)**
```bash
VITE_API_URL=https://your-backend.railway.app
```

### **Backend (Railway/Production)**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
PORT=3001
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

---

## Monitoring & Maintenance

### **Essential Monitoring:**
- Railway built-in metrics
- Netlify analytics
- Database performance monitoring

### **Recommended Tools:**
- **Uptime**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Analytics**: Plausible or Google Analytics

---

## Troubleshooting

### **Common Issues:**

1. **CORS Errors**
   ```javascript
   // Ensure ALLOWED_ORIGINS includes your frontend domain
   ALLOWED_ORIGINS=https://yourapp.netlify.app
   ```

2. **Database Connection Issues**
   ```bash
   # Check DATABASE_URL format
   postgresql://username:password@host:port/database
   ```

3. **Build Failures**
   ```bash
   # Test build locally first
   npm run build
   ```

4. **API Not Responding**
   - Check Railway logs
   - Verify environment variables
   - Test health endpoint: `/health`

---

## Next Steps

1. **Choose your deployment platforms**
2. **Set up backend on Railway**
3. **Deploy frontend to Netlify**
4. **Test the complete flow**
5. **Set up monitoring**
6. **Configure custom domain**

Your hybrid architecture is production-ready! The zero-knowledge encryption ensures user privacy while providing seamless cross-device sync.
