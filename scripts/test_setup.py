"""
Simple test script to verify NewsCollector setup
Run this after configuring your .env file
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_env_vars():
    """Test if environment variables are properly loaded"""
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY', 'NEWSAPI_KEY']
    
    print("🔍 Testing Environment Variables:")
    for var in required_vars:
        value = os.getenv(var)
        if value and value != f'your-{var.lower().replace("_", "-")}':
            print(f"✅ {var}: Set")
        else:
            print(f"❌ {var}: Missing or default value")
    
    return all(os.getenv(var) and os.getenv(var) != f'your-{var.lower().replace("_", "-")}' 
               for var in required_vars)

def test_imports():
    """Test if all required packages are installed"""
    try:
        import requests
        import feedparser
        from supabase import create_client
        from bs4 import BeautifulSoup
        from dateutil import parser
        print("✅ All packages imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def main():
    print("🚀 Testing News Collection Setup...\n")
    
    # Test imports
    imports_ok = test_imports()
    
    # Test environment variables
    env_ok = test_env_vars()
    
    if imports_ok and env_ok:
        print("\n✅ Setup is ready! You can now run:")
        print("   python news_collector.py")
    else:
        print("\n❌ Please fix the issues above before running the collector.")

if __name__ == "__main__":
    main()