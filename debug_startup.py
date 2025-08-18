#!/usr/bin/env python3
"""
Debug script to identify startup issues in the DogBot API.
"""

import sys
import os
import traceback

# Add the dogbot-api src directory to the Python path
parent_dir = os.path.dirname(os.path.dirname(__file__))  # Go up two levels to /Users/philippkemper/Code/dogbot
dogbot_api_dir = os.path.join(parent_dir, 'dogbot-api')
dogbot_api_src = os.path.join(dogbot_api_dir, 'src')
sys.path.insert(0, dogbot_api_dir)  # Add the parent directory so 'src' can be found
sys.path.insert(0, dogbot_api_src)  # Also add src directly

def test_imports():
    """Test all critical imports one by one to identify issues."""
    print("🔍 Testing imports...")
    
    try:
        print("1. Testing basic FastAPI imports...")
        from fastapi import FastAPI, HTTPException
        print("   ✅ FastAPI imports successful")
    except Exception as e:
        print(f"   ❌ FastAPI imports failed: {e}")
        return False
    
    try:
        print("2. Testing pydantic imports...")
        from pydantic import BaseModel
        print("   ✅ Pydantic imports successful")
    except Exception as e:
        print(f"   ❌ Pydantic imports failed: {e}")
        return False
    
    try:
        print("3. Testing security module...")
        from src.core.security import init_secure_session_store, get_secure_session_store
        print("   ✅ Security module imports successful")
    except Exception as e:
        print(f"   ❌ Security module imports failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("4. Testing orchestrator module...")
        from src.core.orchestrator import V2Orchestrator, init_orchestrator
        print("   ✅ Orchestrator module imports successful")
    except Exception as e:
        print(f"   ❌ Orchestrator module imports failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("5. Testing session models...")
        from src.models.session_state import SessionStore
        print("   ✅ Session models imports successful")
    except Exception as e:
        print(f"   ❌ Session models imports failed: {e}")
        traceback.print_exc()
        return False
        
    try:
        print("6. Testing flow models...")
        from src.models.flow_models import FlowStep
        print("   ✅ Flow models imports successful")
    except Exception as e:
        print(f"   ❌ Flow models imports failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("7. Testing logging config...")
        from src.core.logging_config import setup_logging
        print("   ✅ Logging config imports successful")
    except Exception as e:
        print(f"   ❌ Logging config imports failed: {e}")
        traceback.print_exc()
        return False
        
    print("✅ All imports successful!")
    return True

def test_main_module():
    """Test importing the main module directly."""
    print("\n🔍 Testing main module import...")
    
    try:
        import src.main
        print("   ✅ Main module import successful")
        return True
    except Exception as e:
        print(f"   ❌ Main module import failed: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests."""
    print("🚀 DogBot API Startup Debug")
    print("=" * 50)
    
    # Test working directory
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path: {sys.path[:3]}...")  # Show first 3 entries
    
    # Check if dogbot-api directory exists
    dogbot_api_path = os.path.join(parent_dir, 'dogbot-api')
    if not os.path.exists(dogbot_api_path):
        print(f"❌ dogbot-api directory not found at: {dogbot_api_path}")
        return False
    else:
        print(f"✅ dogbot-api directory found at: {dogbot_api_path}")
        print(f"✅ Python path includes: {dogbot_api_src}")
    
    # Test individual imports
    if not test_imports():
        print("\n❌ Import tests failed")
        return False
    
    # Test main module
    if not test_main_module():
        print("\n❌ Main module test failed")
        return False
    
    print("\n✅ All tests passed! The API should start successfully.")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)