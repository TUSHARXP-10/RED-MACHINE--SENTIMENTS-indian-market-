# News Collection Setup Guide

## Quick Setup Steps

### 1. Get Your API Keys

**NewsAPI Key:**
1. Visit https://newsapi.org
2. Sign up for a free account
3. Copy your API key from the dashboard

**Supabase Credentials:**
1. Go to https://supabase.com
2. Create a new project or use existing
3. Copy your project URL and anon key from Settings > API

### 2. Configure Environment Variables

Update the `.env` file with your actual credentials:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
NEWSAPI_KEY=your-newsapi-key-from-newsapi.org
```

### 3. Install Dependencies (Already Done)

✅ Python dependencies are already installed via `pip install -r requirements.txt`

### 4. Test the News Collector

```bash
cd scripts
python news_collector.py
```

You should see output like:
```
Collecting RSS feeds...
Collecting NewsAPI...
Done.
```

## Troubleshooting

### Common Issues

1. **Module Not Found**: Run `pip install -r requirements.txt` again
2. **Environment Variables**: Ensure `.env` file exists in project root
3. **NewsAPI Limit**: Free tier allows 100 requests/day
4. **Supabase Connection**: Check if your Supabase project is active

### Verify Setup

Test individual components:

```python
# Test RSS collection
python -c "from scripts.news_collector import NewsCollector; nc = NewsCollector(); nc.collect_rss()"

# Test NewsAPI
python -c "from scripts.news_collector import NewsCollector; nc = NewsCollector(); nc.collect_newsapi()"
```

## Database Schema

The script expects a Supabase table named `market_news` with these columns:
- `id` (auto-generated)
- `headline` (text)
- `content` (text)
- `source` (text)
- `url` (text, unique)
- `published_at` (timestamp)
- `sentiment_score` (float, optional)
- `sentiment_label` (text, optional)

## Next Steps

1. ✅ News collection setup complete
2. 🔄 Next: Sentiment analysis engine
3. 🔄 Next: Real-time dashboard integration
4. 🔄 Next: Automated scheduling