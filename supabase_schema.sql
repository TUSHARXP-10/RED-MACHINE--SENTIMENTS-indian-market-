-- Supabase Database Schema for Stock Market News
-- Run this in your Supabase SQL editor to create the required table

-- Create market_news table
CREATE TABLE IF NOT EXISTS market_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    headline TEXT NOT NULL,
    content TEXT,
    source TEXT,
    url TEXT UNIQUE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    sentiment_score NUMERIC(3,2),
    sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_market_news_published_at ON market_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_news_source ON market_news(source);
CREATE INDEX IF NOT EXISTS idx_market_news_sentiment_label ON market_news(sentiment_label);

-- Create RLS (Row Level Security) policies
ALTER TABLE market_news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON market_news FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON market_news FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_market_news_updated_at BEFORE UPDATE ON market_news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO market_news (headline, content, source, url, published_at, sentiment_score, sentiment_label) VALUES
('Stock Market Hits Record High', 'Major indices reach new peaks amid positive economic data', 'Financial Times', 'https://example.com/record-high', NOW() - INTERVAL '1 hour', 0.85, 'positive'),
('Tech Stocks Face Volatility', 'Technology sector experiences significant fluctuations', 'Reuters', 'https://example.com/tech-volatility', NOW() - INTERVAL '2 hours', -0.45, 'negative'),
('Central Bank Maintains Rates', 'Federal Reserve keeps interest rates unchanged', 'Bloomberg', 'https://example.com/fed-rates', NOW() - INTERVAL '3 hours', 0.12, 'neutral');

-- View table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'market_news';