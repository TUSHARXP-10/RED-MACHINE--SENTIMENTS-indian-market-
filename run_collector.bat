@echo off
echo Starting Stock Sentiment News Collector...
echo.
cd /d "%~dp0"
cd scripts
python news_collector.py
echo.
echo Press any key to exit...
pause