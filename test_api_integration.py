#!/usr/bin/env python3
"""
Test script to verify the API integration and CORS setup.
"""

import requests
import json
import sys

def test_cors_preflight():
    """Test CORS preflight request from frontend origin."""
    print("🔍 Testing CORS preflight request...")
    
    try:
        response = requests.options(
            'http://localhost:8000/flow_intro',
            headers={
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,X-API-Key'
            }
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   CORS Origin: {response.headers.get('access-control-allow-origin', 'NOT SET')}")
        print(f"   CORS Methods: {response.headers.get('access-control-allow-methods', 'NOT SET')}")
        print(f"   CORS Headers: {response.headers.get('access-control-allow-headers', 'NOT SET')}")
        
        if response.status_code == 200:
            print("   ✅ CORS preflight successful")
            return True
        else:
            print("   ❌ CORS preflight failed")
            return False
            
    except Exception as e:
        print(f"   ❌ CORS preflight error: {e}")
        return False

def test_flow_intro():
    """Test the flow_intro endpoint that frontend calls."""
    print("\n🔍 Testing /flow_intro endpoint...")
    
    try:
        response = requests.post(
            'http://localhost:8000/flow_intro',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': 'gu5xS5Dy8F4hvDJ0DlahW--QZ5nvkhxVQ2gvhu79pEk',
                'Origin': 'http://localhost:3000'  # Simulate frontend origin
            }
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Session ID: {data.get('session_id', 'NOT SET')}")
            print(f"   Session Token: {data.get('session_token', 'NOT SET')[:20]}...")
            print(f"   Messages: {len(data.get('messages', []))} messages")
            
            # Print first message for verification
            if data.get('messages'):
                first_msg = data['messages'][0]
                print(f"   First message: {first_msg.get('sender')} - {first_msg.get('text', '')[:50]}...")
            
            print("   ✅ /flow_intro successful")
            return True, data
        else:
            print(f"   ❌ /flow_intro failed: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"   ❌ /flow_intro error: {e}")
        return False, None

def test_flow_step(session_data):
    """Test the flow_step endpoint with a sample message."""
    if not session_data:
        print("\n⏭️  Skipping /flow_step test (no session data)")
        return False
        
    print("\n🔍 Testing /flow_step endpoint...")
    
    try:
        response = requests.post(
            'http://localhost:8000/flow_step',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': 'gu5xS5Dy8F4hvDJ0DlahW--QZ5nvkhxVQ2gvhu79pEk',
                'Origin': 'http://localhost:3000'
            },
            json={
                'session_id': session_data['session_id'],
                'session_token': session_data['session_token'],
                'message': 'Hallo, mein Hund bellt viel!'
            }
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Messages: {len(data.get('messages', []))} response messages")
            
            # Print response messages
            for i, msg in enumerate(data.get('messages', [])):
                print(f"   Response {i+1}: {msg.get('sender')} - {msg.get('text', '')[:50]}...")
            
            print("   ✅ /flow_step successful")
            return True
        else:
            print(f"   ❌ /flow_step failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ /flow_step error: {e}")
        return False

def main():
    """Run all integration tests."""
    print("🚀 DogBot API Integration Test")
    print("=" * 50)
    
    # Test 1: CORS preflight
    cors_ok = test_cors_preflight()
    
    # Test 2: flow_intro endpoint
    intro_ok, session_data = test_flow_intro()
    
    # Test 3: flow_step endpoint
    step_ok = test_flow_step(session_data)
    
    # Summary
    print("\n📋 Test Summary:")
    print(f"   CORS Preflight: {'✅ PASS' if cors_ok else '❌ FAIL'}")
    print(f"   Flow Intro: {'✅ PASS' if intro_ok else '❌ FAIL'}")
    print(f"   Flow Step: {'✅ PASS' if step_ok else '❌ FAIL'}")
    
    if cors_ok and intro_ok and step_ok:
        print("\n🎉 All tests passed! The API is working correctly.")
        print("   The frontend should be able to communicate with the backend without CORS errors.")
        return True
    else:
        print("\n❌ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)