#!/usr/bin/env python3
"""
Stock Sentiment AI - News Collection Pipeline Runner
Run this script from the project root to collect news data
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Run the news collector from the correct directory"""
    
    # Get the project root directory
    project_root = Path(__file__).parent.absolute()
    scripts_dir = project_root / "scripts"
    
    # Check if scripts directory exists
    if not scripts_dir.exists():
        print("❌ Scripts directory not found!")
        return
    
    # Check if news_collector.py exists
    collector_script = scripts_dir / "news_collector.py"
    if not collector_script.exists():
        print("❌ news_collector.py not found in scripts directory!")
        return
    
    print("🚀 Starting Stock Sentiment News Collection...")
    print(f"📁 Project root: {project_root}")
    print(f"📁 Scripts directory: {scripts_dir}")
    print()
    
    # Change to scripts directory and run collector
    try:
        os.chdir(scripts_dir)
        
        # Run the collector
        result = subprocess.run([
            sys.executable, 
            "news_collector.py"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ News collection completed successfully!")
            if result.stdout:
                print("📊 Output:")
                print(result.stdout)
        else:
            print("❌ Error running news collector:")
            print(result.stderr)
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        # Return to original directory
        os.chdir(project_root)

if __name__ == "__main__":
    main()