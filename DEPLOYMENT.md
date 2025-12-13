# Deployment Guide

## Overview

This guide covers deploying the Manufacturing Quotation AI MVP to production.

## Environment Variables

### Backend (.env)

```env
# Production Settings
NODE_ENV=production
PORT=5000
API_URL=https://api.yourcompany.com
FRONTEND_URL=https://quotation.yourcompany.com

# AI Services
GEMINI_API_KEY=your_production_gemini_key
GEMINI_MODEL=gemini-1.5-flash

# Optional (future features)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
MONGODB_URI=
REDIS_URL=

# Security
JWT_SECRET=your_very_secure_secret_key_here
```

### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://api.yourcompany.com
```

## Deployment Options

### Option 1: Vercel (Recommended for MVP)

#### Backend Deployment

1. **Deploy to Vercel:**
```bash
cd backend
vercel
```

2. **Set Environment Variables:**
```bash
vercel env add GEMINI_API_KEY
vercel env add NODE_ENV production
```

3. **Deploy:**
```bash
vercel --prod
```

#### Frontend Deployment

1. **Deploy to Vercel:**
```bash
cd frontend
vercel
```

2. **Set Environment Variables:**
```bash
vercel env add NEXT_PUBLIC_API_URL
```

3. **Deploy:**
```bash
vercel --prod
```

### Option 2: Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Deploy Backend:**
```bash
cd backend
railway init
railway up
```

4. **Deploy Frontend:**
```bash
cd frontend
railway init
railway up
```

### Option 3: Docker + Cloud Run

#### Create Dockerfile (Backend)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### Create Dockerfile (Frontend)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Deploy to Google Cloud Run

```bash
# Backend
gcloud run deploy quotation-backend \
  --source backend \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated

# Frontend
gcloud run deploy quotation-frontend \
  --source frontend \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

### Option 4: Traditional VPS (AWS EC2, DigitalOcean, etc.)

#### Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### Deploy Application

```bash
# Clone repository
git clone your-repo-url
cd quotation-ai-mvp

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
cd backend
pm2 start dist/server.js --name quotation-backend

cd ../frontend
pm2 start npm --name quotation-frontend -- start

# Save PM2 process list
pm2 save
pm2 startup
```

#### Setup Nginx

```nginx
# /etc/nginx/sites-available/quotation-ai

# Backend API
server {
    listen 80;
    server_name api.yourcompany.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name quotation.yourcompany.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/quotation-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourcompany.com -d quotation.yourcompany.com
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production Gemini API key
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up logging and monitoring
- [ ] Configure backups
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test all endpoints in production
- [ ] Set up health check monitoring
- [ ] Configure auto-scaling (if needed)

## Monitoring

### Health Checks

Set up monitoring for:
- `GET /health` endpoint
- Response time < 200ms
- Uptime > 99.9%

### Error Tracking

Recommended tools:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Datadog** for infrastructure monitoring

### Cost Monitoring

Monitor Gemini API usage:
- Track requests per day
- Monitor token usage
- Set up billing alerts

## Scaling Considerations

### Horizontal Scaling

When traffic increases:
1. Add load balancer
2. Deploy multiple backend instances
3. Use shared Redis for sessions
4. Implement CDN for static assets

### Database (Future)

When adding MongoDB:
- Use MongoDB Atlas for managed hosting
- Enable automatic backups
- Set up read replicas for scaling

### Caching (Future)

When adding Redis:
- Cache Gemini API responses
- Implement request deduplication
- Store processing job status

## Backup Strategy

### Code
- Git repository with regular commits
- Tagged releases for production deployments

### Data (Future)
- Daily MongoDB backups
- Store uploaded drawings in S3/Cloud Storage
- Keep processing logs for 30 days

## Rollback Plan

If deployment fails:

1. **Vercel/Railway:** Use built-in rollback
2. **Docker:** Revert to previous image tag
3. **PM2:** Restart previous version

```bash
pm2 restart quotation-backend
pm2 logs quotation-backend
```

## Security Checklist

- [ ] API key stored securely (not in code)
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] File upload validation
- [ ] Rate limiting implemented
- [ ] Input sanitization
- [ ] Error messages don't expose sensitive info
- [ ] Dependency security audit: `npm audit`

## Performance Optimization

### Backend
- Enable compression: `npm install compression`
- Implement request caching
- Use CDN for static files
- Optimize image processing

### Frontend
- Enable Next.js image optimization
- Implement code splitting
- Use lazy loading for components
- Optimize bundle size

## Cost Estimation

### Gemini API
- ~$0.001 per request (1.5-flash)
- 1000 drawings/day ≈ $30/month

### Hosting
- **Vercel Free Tier:** $0/month (good for MVP)
- **Railway:** ~$5-20/month
- **Cloud Run:** Pay per use (~$10-50/month)
- **VPS:** $5-20/month (DigitalOcean, etc.)

**Total MVP Cost: ~$10-50/month**

## Support

For deployment issues:
- Check application logs
- Verify environment variables
- Test API connectivity
- Review error messages
