import os
import requests
import feedparser
from bs4 import BeautifulSoup
from supabase import create_client
from datetime import datetime
from dateutil import parser

class NewsCollector:
    def __init__(self):
        self.supabase = create_client(
            os.getenv('SUPABASE_URL'),
            os.getenv('SUPABASE_KEY')
        )
        self.newsapi_key = os.getenv('NEWSAPI_KEY')
        self.rss_feeds = [
            'https://www.moneycontrol.com/rss/business.xml',
            'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
            'https://www.business-standard.com/rss/markets-106.rss',
            'https://www.livemint.com/rss/markets',
            'https://www.financialexpress.com/market/rss'
        ]

    def _parse_date(self, date_str):
        try:
            return parser.parse(date_str).isoformat()
        except:
            return datetime.now().isoformat()

    def collect_rss(self):
        for url in self.rss_feeds:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                existing = self.supabase.table('market_news') \
                    .select('id') \
                    .eq('url', entry.link) \
                    .execute()
                if existing.data:
                    continue
                news = {
                    'headline': entry.title,
                    'content': entry.get('summary', ''),
                    'source': feed.feed.get('title', ''),
                    'url': entry.link,
                    'published_at': self._parse_date(entry.get('published')),
                }
                self.supabase.table('market_news').insert(news).execute()

    def collect_newsapi(self):
        if not self.newsapi_key:
            return
        resp = requests.get(
            'https://newsapi.org/v2/top-headlines',
            params={
                'country': 'in',
                'category': 'business',
                'apiKey': self.newsapi_key,
                'pageSize': 20
            }
        )
        data = resp.json()
        for art in data.get('articles', []):
            existing = self.supabase.table('market_news') \
                .select('id') \
                .eq('url', art['url']) \
                .execute()
            if existing.data:
                continue
            news = {
                'headline': art['title'],
                'content': art['description'] or '',
                'source': art['source']['name'],
                'url': art['url'],
                'published_at': art['publishedAt'],
            }
            self.supabase.table('market_news').insert(news).execute()

    def run(self):
        print("Collecting RSS feeds..."); self.collect_rss()
        print("Collecting NewsAPI..."); self.collect_newsapi()
        print("Done.")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    NewsCollector().run()