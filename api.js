/**
 * API Integration for Stock Sentiment Dashboard
 * Connects your beautiful dashboard to real Supabase data
 */

class DataAPI {
    constructor() {
        // Load from environment variables or use defaults
        this.supabaseUrl = 'https://your-project.supabase.co';
        this.supabaseKey = 'your-supabase-anon-key';
        
        // Try to load from .env file if available
        this.loadEnvConfig();
    }

    loadEnvConfig() {
        // Simple env loading for frontend
        const envScript = document.createElement('script');
        envScript.src = './config.js';
        envScript.onload = () => {
            if (window.ENV_CONFIG) {
                this.supabaseUrl = window.ENV_CONFIG.SUPABASE_URL || this.supabaseUrl;
                this.supabaseKey = window.ENV_CONFIG.SUPABASE_KEY || this.supabaseKey;
            }
        };
        document.head.appendChild(envScript);
    }

    // Generic API call method
    async makeAPICall(endpoint, params = {}) {
        try {
            const url = new URL(`${this.supabaseUrl}/rest/v1/${endpoint}`);
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url, {
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            return this.getMockData(); // Fallback to mock data
        }
    }

    // Get latest news with sentiment analysis
    async getLatestNews(limit = 10) {
        return await this.makeAPICall('market_news', {
            select: '*',
            order: 'published_at.desc',
            limit: limit
        });
    }

    // Get sentiment metrics for today
    async getSentimentMetrics() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const news = await this.makeAPICall('market_news', {
            select: 'sentiment_score,sentiment_label,published_at',
            'published_at.gte': yesterday + 'T00:00:00'
        });

        return this.calculateSentimentMetrics(news);
    }

    // Get sentiment trends over time
    async getSentimentTrends(days = 7) {
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        
        const news = await this.makeAPICall('market_news', {
            select: 'sentiment_score,published_at',
            'published_at.gte': startDate,
            order: 'published_at.asc'
        });

        return this.aggregateDailySentiment(news);
    }

    // Calculate sentiment distribution
    async getSentimentDistribution() {
        const news = await this.makeAPICall('market_news', {
            select: 'sentiment_label',
            limit: 100
        });

        const distribution = { positive: 0, negative: 0, neutral: 0 };
        news.forEach(item => {
            if (item.sentiment_label) {
                distribution[item.sentiment_label]++;
            }
        });

        return Object.entries(distribution).map(([label, count]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value: count
        }));
    }

    // Calculate metrics from news data
    calculateSentimentMetrics(news) {
        if (!news || news.length === 0) {
            return this.getMockMetrics();
        }

        const validScores = news.filter(n => n.sentiment_score !== null);
        const avgSentiment = validScores.reduce((sum, n) => sum + n.sentiment_score, 0) / validScores.length;
        
        const sentimentCounts = {
            positive: news.filter(n => n.sentiment_label === 'positive').length,
            negative: news.filter(n => n.sentiment_label === 'negative').length,
            neutral: news.filter(n => n.sentiment_label === 'neutral').length
        };

        return {
            avgSentiment: avgSentiment || 0,
            sentimentCounts: sentimentCounts,
            totalArticles: news.length,
            lastUpdate: news[0]?.published_at || new Date().toISOString()
        };
    }

    // Aggregate daily sentiment
    aggregateDailySentiment(news) {
        if (!news || news.length === 0) {
            return this.getMockTrends();
        }

        const dailyData = {};
        news.forEach(item => {
            const date = item.published_at ? item.published_at.split('T')[0] : new Date().toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { scores: [], count: 0 };
            }
            if (item.sentiment_score !== null) {
                dailyData[date].scores.push(item.sentiment_score);
                dailyData[date].count++;
            }
        });

        return Object.entries(dailyData).map(([date, data]) => ({
            date: date,
            sentiment: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
            count: data.count
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Mock data for fallback
    getMockData() {
        return [
            {
                id: '1',
                headline: 'Stock Market Shows Strong Recovery',
                content: 'Major indices posted significant gains as investors remain optimistic about economic recovery...',
                source: 'Financial Times',
                url: 'https://example.com/recovery',
                published_at: new Date().toISOString(),
                sentiment_score: 0.85,
                sentiment_label: 'positive'
            },
            {
                id: '2',
                headline: 'Tech Sector Faces Regulatory Pressure',
                content: 'Technology stocks experienced volatility as regulatory concerns continue to weigh on investor sentiment...',
                source: 'Reuters',
                url: 'https://example.com/tech-pressure',
                published_at: new Date(Date.now() - 3600000).toISOString(),
                sentiment_score: -0.45,
                sentiment_label: 'negative'
            }
        ];
    }

    getMockMetrics() {
        return {
            avgSentiment: 0.65,
            sentimentCounts: { positive: 45, negative: 25, neutral: 30 },
            totalArticles: 100,
            lastUpdate: new Date().toISOString()
        };
    }

    getMockTrends() {
        const trends = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            trends.push({
                date: date.toISOString().split('T')[0],
                sentiment: Math.random() * 2 - 1,
                count: Math.floor(Math.random() * 50) + 10
            });
        }
        return trends;
    }
}

// Initialize API
window.dataAPI = new DataAPI();