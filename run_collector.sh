#!/bin/bash
echo "Starting Stock Sentiment News Collector..."
echo
cd "$(dirname "$0")"
cd scripts
python3 news_collector.py
echo
echo "News collection completed!"