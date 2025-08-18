#!/usr/bin/env python3
"""
Simple script to start the DogBot frontend in development mode.
"""

import sys
import os
import subprocess

def main():
    """Start the frontend server."""
    # Path to frontend
    frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dogbot-web')
    
    print(f"🚀 Starting DogBot Frontend...")
    print(f"📁 Frontend directory: {frontend_dir}")
    
    # Check if directory exists
    if not os.path.exists(frontend_dir):
        print(f"❌ Frontend directory not found at: {frontend_dir}")
        sys.exit(1)
    
    # Check if node_modules exists
    node_modules = os.path.join(frontend_dir, 'node_modules')
    if not os.path.exists(node_modules):
        print(f"❌ node_modules not found. Please run 'npm install' in {frontend_dir}")
        sys.exit(1)
    
    # Change to frontend directory
    original_cwd = os.getcwd()
    os.chdir(frontend_dir)
    
    try:
        # Start the development server
        print("🌐 Starting development server on localhost:3000...")
        cmd = ['npm', 'run', 'dev']
        
        subprocess.run(cmd, check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Frontend stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend failed to start: {e}")
        sys.exit(1)
    finally:
        os.chdir(original_cwd)

if __name__ == "__main__":
    main()