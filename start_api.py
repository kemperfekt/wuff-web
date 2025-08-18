#!/usr/bin/env python3
"""
Simple script to start the DogBot API server with correct environment.
"""

import sys
import os
import subprocess

def main():
    """Start the API server."""
    # Paths
    dogbot_api_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dogbot-api')
    venv_python = os.path.join(dogbot_api_dir, '.venv', 'bin', 'python')
    
    print(f"🚀 Starting DogBot API server...")
    print(f"📁 API directory: {dogbot_api_dir}")
    print(f"🐍 Python: {venv_python}")
    
    # Check if venv exists
    if not os.path.exists(venv_python):
        print(f"❌ Virtual environment not found at: {venv_python}")
        sys.exit(1)
    
    # Change to the API directory
    original_cwd = os.getcwd()
    os.chdir(dogbot_api_dir)
    
    try:
        # Start the server
        print("🌐 Starting server on localhost:8000...")
        cmd = [
            venv_python, '-m', 'uvicorn', 
            'src.main:app', 
            '--port', '8000',
            '--host', '0.0.0.0',
            '--log-level', 'info'
        ]
        
        subprocess.run(cmd, check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    finally:
        os.chdir(original_cwd)

if __name__ == "__main__":
    main()