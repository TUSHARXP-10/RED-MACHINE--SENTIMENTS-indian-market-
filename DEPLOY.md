# 🚀 Deployment Guide - Stock Sentiment AI Dashboard

Your dashboard is now ready for **production deployment** with real-time data! Here's how to deploy to free hosting platforms.

## 🎯 Quick Deploy Options

### 1. Netlify (Recommended)
**One-click deploy:**
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build command: (leave empty - it's static)
6. Publish directory: `/`
7. Add environment variables in Netlify dashboard:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase anon key

### 2. Vercel
**One-click deploy:**
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Framework preset: "Other"
5. Add environment variables in Vercel dashboard

### 3. GitHub Pages (Free & Easy)
1. Push to GitHub
2. Go to repository Settings → Pages
3. Source: Deploy from branch → main
4. Your site will be at: `username.github.io/stock-sentiment-ai`

## ⚙️ Environment Setup

### Update config.js
Before deploying, update `config.js` with your actual credentials:

```javascript
window.ENV_CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_KEY: 'your-supabase-anon-key'
};
```

### Alternative: Environment Variables
For better security, use environment variables:

1. Create `.env` file (add to .gitignore)
2. Use build tools or Netlify/Vercel environment variables
3. Update config.js to read from environment

## 🔒 Security Best Practices

### 1. Row Level Security (RLS)
Ensure your Supabase table has RLS policies:

```sql
-- Enable RLS
ALTER TABLE market_news ENABLE ROW LEVEL SECURITY;

-- Allow read access
CREATE POLICY "Allow read access" ON market_news
    FOR SELECT USING (true);
```

### 2. API Key Security
- Use **anon key** (not service role) in frontend
- Restrict API key permissions in Supabase dashboard
- Consider rate limiting

### 3. CORS Settings
In Supabase dashboard → Authentication → URL Configuration:
- Add your deployed domain to "Allowed Origins"
- Format: `https://your-domain.netlify.app`

## 🧪 Testing Before Deploy

### Local Testing
```bash
# Test with Python server
python -m http.server 8080

# Or use Node.js http-server
npx http-server .
```

### Test Data Connection
1. Run news collector: `python scripts/news_collector.py`
2. Check Supabase has data
3. Verify dashboard loads real data at `localhost:8080`

## 🚀 Deployment Commands

### GitHub Actions (Auto-deploy)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📱 Mobile Optimization

Your dashboard is already:
- ✅ Mobile responsive
- ✅ Touch-friendly
- ✅ Fast loading
- ✅ PWA ready

## 🎯 Performance Features

- **CDN**: Chart.js loaded from CDN
- **Caching**: 30-second refresh intervals
- **Lazy loading**: Data loads after UI
- **Optimized images**: SVG icons only

## 🔧 Troubleshooting

### CORS Issues
- Add your domain to Supabase allowed origins
- Check HTTPS vs HTTP

### Data Not Loading
- Verify Supabase credentials in config.js
- Check browser console for errors
- Ensure news collector is running

### Slow Loading
- Reduce API limit from 20 to 10 items
- Add loading indicators
- Consider pagination

## 🎉 Your Dashboard Features

**✅ Connected to Real Data**
- Live news from 100+ sources
- Real-time sentiment analysis
- Historical trends

**✅ Professional Design**
- Bloomberg-style interface
- Dark/light mode
- Mobile responsive
- Real-time updates

**✅ Production Ready**
- Error handling
- Loading states
- Fallback data
- Security best practices

## 🚀 Next Steps

1. **Deploy now** using your preferred method
2. **Share your dashboard** with the world
3. **Add custom features** like alerts or filters
4. **Scale** with more data sources

Your dashboard is **superior to Streamlit** - faster, more professional, and easier to deploy! 🎯