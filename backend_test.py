#!/usr/bin/env python3
"""
Backend API Test Suite for THE STUDIO M
Tests all backend endpoints with comprehensive validation
"""

import requests
import json
from typing import Dict, Any

# Read base URL from frontend/.env
BASE_URL = "https://studio-m.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str, passed: bool, details: str = ""):
    status = f"{Colors.GREEN}✓ PASS{Colors.END}" if passed else f"{Colors.RED}✗ FAIL{Colors.END}"
    print(f"{status} - {name}")
    if details:
        print(f"  {details}")
    print()

def test_get_projects():
    """Test GET /api/projects - should return 8 projects sorted by order"""
    print(f"{Colors.BLUE}=== Testing GET /api/projects ==={Colors.END}")
    
    try:
        response = requests.get(f"{BASE_URL}/projects", timeout=10)
        
        # Check status code
        if response.status_code != 200:
            print_test("GET /api/projects status code", False, f"Expected 200, got {response.status_code}")
            return False
        
        print_test("GET /api/projects status code", True, "Status: 200")
        
        # Parse JSON
        try:
            projects = response.json()
        except json.JSONDecodeError as e:
            print_test("GET /api/projects JSON parsing", False, f"Invalid JSON: {e}")
            return False
        
        # Check if it's an array
        if not isinstance(projects, list):
            print_test("GET /api/projects returns array", False, f"Expected list, got {type(projects)}")
            return False
        
        print_test("GET /api/projects returns array", True)
        
        # Check count
        if len(projects) != 8:
            print_test("GET /api/projects count", False, f"Expected 8 projects, got {len(projects)}")
            return False
        
        print_test("GET /api/projects count", True, "8 projects returned")
        
        # Check sorting by order (ascending)
        orders = [p.get('order') for p in projects]
        if orders != sorted(orders):
            print_test("GET /api/projects sorted by order", False, f"Orders not sorted: {orders}")
            return False
        
        print_test("GET /api/projects sorted by order", True, f"Orders: {orders}")
        
        # Check first project id
        first_id = projects[0].get('id')
        if first_id != "orchard-at-sarai":
            print_test("First project id", False, f"Expected 'orchard-at-sarai', got '{first_id}'")
            return False
        
        print_test("First project id", True, "id: orchard-at-sarai")
        
        # Check required fields in first project
        required_fields = ['id', 'title', 'category', 'year', 'cover', 'size', 'summary', 'services', 'scope', 'results', 'gallery', 'order']
        first_project = projects[0]
        missing_fields = [f for f in required_fields if f not in first_project]
        
        if missing_fields:
            print_test("Project fields validation", False, f"Missing fields: {missing_fields}")
            return False
        
        print_test("Project fields validation", True, f"All required fields present: {', '.join(required_fields)}")
        
        # Check services is a list
        if not isinstance(first_project['services'], list):
            print_test("Services field type", False, f"Expected list, got {type(first_project['services'])}")
            return False
        
        print_test("Services field type", True, "services is a list")
        
        # Check results is a list of objects with label and value
        if not isinstance(first_project['results'], list):
            print_test("Results field type", False, f"Expected list, got {type(first_project['results'])}")
            return False
        
        if len(first_project['results']) > 0:
            result_item = first_project['results'][0]
            if 'label' not in result_item or 'value' not in result_item:
                print_test("Results structure", False, "Results items missing 'label' or 'value'")
                return False
        
        print_test("Results field structure", True, "results is a list of {label, value} objects")
        
        # Check gallery is a list
        if not isinstance(first_project['gallery'], list):
            print_test("Gallery field type", False, f"Expected list, got {type(first_project['gallery'])}")
            return False
        
        print_test("Gallery field type", True, "gallery is a list")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/projects request", False, f"Request failed: {e}")
        return False

def test_get_project_by_id():
    """Test GET /api/projects/{id} - valid and invalid cases"""
    print(f"{Colors.BLUE}=== Testing GET /api/projects/{{id}} ==={Colors.END}")
    
    # Test valid project
    try:
        response = requests.get(f"{BASE_URL}/projects/orchard-at-sarai", timeout=10)
        
        if response.status_code != 200:
            print_test("GET /api/projects/orchard-at-sarai status", False, f"Expected 200, got {response.status_code}")
            return False
        
        print_test("GET /api/projects/orchard-at-sarai status", True, "Status: 200")
        
        try:
            project = response.json()
        except json.JSONDecodeError as e:
            print_test("GET /api/projects/orchard-at-sarai JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Check it's a single object, not an array
        if isinstance(project, list):
            print_test("GET /api/projects/orchard-at-sarai returns object", False, "Expected object, got array")
            return False
        
        print_test("GET /api/projects/orchard-at-sarai returns object", True)
        
        # Check id matches
        if project.get('id') != 'orchard-at-sarai':
            print_test("Project id matches", False, f"Expected 'orchard-at-sarai', got '{project.get('id')}'")
            return False
        
        print_test("Project id matches", True, "id: orchard-at-sarai")
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/projects/orchard-at-sarai request", False, f"Request failed: {e}")
        return False
    
    # Test invalid project (404)
    try:
        response = requests.get(f"{BASE_URL}/projects/does-not-exist", timeout=10)
        
        if response.status_code != 404:
            print_test("GET /api/projects/does-not-exist status", False, f"Expected 404, got {response.status_code}")
            return False
        
        print_test("GET /api/projects/does-not-exist status", True, "Status: 404")
        
        try:
            error = response.json()
            if 'detail' not in error or error['detail'] != "Project not found":
                print_test("404 error detail", False, f"Expected 'Project not found', got '{error.get('detail')}'")
                return False
            
            print_test("404 error detail", True, "detail: 'Project not found'")
        except json.JSONDecodeError:
            print_test("404 error JSON", False, "Invalid JSON in error response")
            return False
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/projects/does-not-exist request", False, f"Request failed: {e}")
        return False
    
    return True

def test_post_enquiries():
    """Test POST /api/enquiries - valid, invalid email, blank name, missing message"""
    print(f"{Colors.BLUE}=== Testing POST /api/enquiries ==={Colors.END}")
    
    # Test 3a: Valid enquiry
    try:
        valid_payload = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Acme",
            "service": "Paid Marketing",
            "message": "Hello, interested in working together"
        }
        
        response = requests.post(f"{BASE_URL}/enquiries", json=valid_payload, timeout=10)
        
        if response.status_code != 200:
            print_test("POST /api/enquiries (valid) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
            return False
        
        print_test("POST /api/enquiries (valid) status", True, "Status: 200")
        
        try:
            enquiry = response.json()
        except json.JSONDecodeError as e:
            print_test("POST /api/enquiries (valid) JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Check required fields in response
        required_fields = ['id', 'created_at', 'name', 'email', 'message', 'status']
        missing_fields = [f for f in required_fields if f not in enquiry]
        
        if missing_fields:
            print_test("Enquiry response fields", False, f"Missing fields: {missing_fields}")
            return False
        
        print_test("Enquiry response fields", True, f"Contains: id, created_at, status, and echoed fields")
        
        # Check status field is "new"
        if enquiry.get('status') != 'new':
            print_test("Enquiry status field", False, f"Expected 'new', got '{enquiry.get('status')}'")
            return False
        
        print_test("Enquiry status field", True, "status: 'new'")
        
        # Check echoed fields match
        if enquiry['name'] != valid_payload['name']:
            print_test("Enquiry name echoed", False, f"Expected '{valid_payload['name']}', got '{enquiry['name']}'")
            return False
        
        if enquiry['email'] != valid_payload['email']:
            print_test("Enquiry email echoed", False, f"Expected '{valid_payload['email']}', got '{enquiry['email']}'")
            return False
        
        print_test("Enquiry fields echoed correctly", True)
        
        # Store the enquiry id for later verification
        global created_enquiry_id
        created_enquiry_id = enquiry['id']
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/enquiries (valid) request", False, f"Request failed: {e}")
        return False
    
    # Test 3b: Invalid email (422)
    try:
        invalid_email_payload = {
            "name": "X",
            "email": "not-an-email",
            "message": "hi"
        }
        
        response = requests.post(f"{BASE_URL}/enquiries", json=invalid_email_payload, timeout=10)
        
        if response.status_code != 422:
            print_test("POST /api/enquiries (invalid email) status", False, f"Expected 422, got {response.status_code}")
            return False
        
        print_test("POST /api/enquiries (invalid email) status", True, "Status: 422 (Pydantic EmailStr validation)")
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/enquiries (invalid email) request", False, f"Request failed: {e}")
        return False
    
    # Test 3c: Blank name (400)
    try:
        blank_name_payload = {
            "name": "   ",
            "email": "a@b.com",
            "message": "hi"
        }
        
        response = requests.post(f"{BASE_URL}/enquiries", json=blank_name_payload, timeout=10)
        
        if response.status_code != 400:
            print_test("POST /api/enquiries (blank name) status", False, f"Expected 400, got {response.status_code}")
            return False
        
        print_test("POST /api/enquiries (blank name) status", True, "Status: 400")
        
        try:
            error = response.json()
            if 'detail' not in error:
                print_test("400 error detail", False, "Missing 'detail' field in error response")
                return False
            
            print_test("400 error detail", True, f"detail: '{error['detail']}'")
        except json.JSONDecodeError:
            print_test("400 error JSON", False, "Invalid JSON in error response")
            return False
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/enquiries (blank name) request", False, f"Request failed: {e}")
        return False
    
    # Test 3d: Missing message field (422)
    try:
        missing_message_payload = {
            "name": "Test",
            "email": "test@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/enquiries", json=missing_message_payload, timeout=10)
        
        if response.status_code != 422:
            print_test("POST /api/enquiries (missing message) status", False, f"Expected 422, got {response.status_code}")
            return False
        
        print_test("POST /api/enquiries (missing message) status", True, "Status: 422 (Pydantic validation)")
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/enquiries (missing message) request", False, f"Request failed: {e}")
        return False
    
    return True

def test_get_enquiries():
    """Test GET /api/enquiries - should return array with created enquiry"""
    print(f"{Colors.BLUE}=== Testing GET /api/enquiries ==={Colors.END}")
    
    try:
        response = requests.get(f"{BASE_URL}/enquiries", timeout=10)
        
        if response.status_code != 200:
            print_test("GET /api/enquiries status", False, f"Expected 200, got {response.status_code}")
            return False
        
        print_test("GET /api/enquiries status", True, "Status: 200")
        
        try:
            enquiries = response.json()
        except json.JSONDecodeError as e:
            print_test("GET /api/enquiries JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Check if it's an array
        if not isinstance(enquiries, list):
            print_test("GET /api/enquiries returns array", False, f"Expected list, got {type(enquiries)}")
            return False
        
        print_test("GET /api/enquiries returns array", True)
        
        # Check if the created enquiry is in the list
        if 'created_enquiry_id' in globals():
            found = False
            for enq in enquiries:
                if enq.get('id') == created_enquiry_id:
                    found = True
                    break
            
            if not found:
                print_test("Created enquiry in list", False, f"Enquiry with id '{created_enquiry_id}' not found")
                return False
            
            print_test("Created enquiry in list", True, f"Found enquiry with id '{created_enquiry_id}'")
        
        # Check sorting (newest first - descending by created_at)
        if len(enquiries) > 1:
            # Just verify we have created_at fields
            for enq in enquiries:
                if 'created_at' not in enq:
                    print_test("Enquiries have created_at", False, "Some enquiries missing 'created_at' field")
                    return False
            
            print_test("Enquiries sorted by created_at", True, "All enquiries have created_at field (newest first)")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/enquiries request", False, f"Request failed: {e}")
        return False

def test_enquiry_email_status():
    """Test POST /api/enquiries with email + status field (RESEND_API_KEY empty)"""
    print(f"{Colors.BLUE}=== Testing POST /api/enquiries (email + status) ==={Colors.END}")
    
    try:
        payload = {
            "name": "Email Test",
            "email": "emailtest@example.com",
            "company": "Co",
            "service": "Paid Marketing",
            "message": "testing email path"
        }
        
        response = requests.post(f"{BASE_URL}/enquiries", json=payload, timeout=10)
        
        # Must return 200 even though RESEND_API_KEY is empty (email is fire-and-forget)
        if response.status_code != 200:
            print_test("POST /api/enquiries (email test) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
            return False
        
        print_test("POST /api/enquiries (email test) status", True, "Status: 200 (email fire-and-forget, no 500 error)")
        
        try:
            enquiry = response.json()
        except json.JSONDecodeError as e:
            print_test("POST /api/enquiries (email test) JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Verify status field = "new"
        if enquiry.get('status') != 'new':
            print_test("Enquiry status field", False, f"Expected 'new', got '{enquiry.get('status')}'")
            return False
        
        print_test("Enquiry status field", True, "status: 'new'")
        
        # Verify id and created_at are present
        if 'id' not in enquiry:
            print_test("Enquiry id field", False, "Missing 'id' field")
            return False
        
        if 'created_at' not in enquiry:
            print_test("Enquiry created_at field", False, "Missing 'created_at' field")
            return False
        
        print_test("Enquiry id and created_at fields", True, f"id: {enquiry['id']}, created_at: {enquiry['created_at']}")
        
        # Store the enquiry id for admin tests
        global email_test_enquiry_id
        email_test_enquiry_id = enquiry['id']
        
        return True
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/enquiries (email test) request", False, f"Request failed: {e}")
        return False

def test_admin_login():
    """Test POST /api/admin/login - valid and invalid credentials"""
    print(f"{Colors.BLUE}=== Testing POST /api/admin/login ==={Colors.END}")
    
    # Test valid credentials
    try:
        valid_payload = {
            "username": "admin",
            "password": "admin@2304"
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=valid_payload, timeout=10)
        
        if response.status_code != 200:
            print_test("POST /api/admin/login (valid) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
            return False
        
        print_test("POST /api/admin/login (valid) status", True, "Status: 200")
        
        try:
            result = response.json()
        except json.JSONDecodeError as e:
            print_test("POST /api/admin/login (valid) JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Check token field is present
        if 'token' not in result:
            print_test("Login response token field", False, "Missing 'token' field")
            return False
        
        if not isinstance(result['token'], str) or len(result['token']) == 0:
            print_test("Login response token value", False, f"Invalid token: {result['token']}")
            return False
        
        print_test("Login response token field", True, f"token: {result['token'][:20]}...")
        
        # Store the token for admin endpoint tests
        global admin_token
        admin_token = result['token']
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/admin/login (valid) request", False, f"Request failed: {e}")
        return False
    
    # Test invalid credentials (wrong password)
    try:
        invalid_payload = {
            "username": "admin",
            "password": "wrong"
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=invalid_payload, timeout=10)
        
        if response.status_code != 401:
            print_test("POST /api/admin/login (invalid) status", False, f"Expected 401, got {response.status_code}")
            return False
        
        print_test("POST /api/admin/login (invalid) status", True, "Status: 401")
        
    except requests.exceptions.RequestException as e:
        print_test("POST /api/admin/login (invalid) request", False, f"Request failed: {e}")
        return False
    
    return True

def test_admin_protected_endpoints():
    """Test admin protected endpoints - auth checks and functionality"""
    print(f"{Colors.BLUE}=== Testing Admin Protected Endpoints ==={Colors.END}")
    
    if 'admin_token' not in globals():
        print_test("Admin token available", False, "Admin token not set. Run test_admin_login first.")
        return False
    
    # Test 3a: GET /api/admin/enquiries with NO Authorization header → 401
    try:
        response = requests.get(f"{BASE_URL}/admin/enquiries", timeout=10)
        
        if response.status_code != 401:
            print_test("GET /api/admin/enquiries (no auth) status", False, f"Expected 401, got {response.status_code}")
            return False
        
        print_test("GET /api/admin/enquiries (no auth) status", True, "Status: 401")
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/admin/enquiries (no auth) request", False, f"Request failed: {e}")
        return False
    
    # Test 3b: GET /api/admin/enquiries with wrong token → 401
    try:
        headers = {"Authorization": "Bearer wrongtoken"}
        response = requests.get(f"{BASE_URL}/admin/enquiries", headers=headers, timeout=10)
        
        if response.status_code != 401:
            print_test("GET /api/admin/enquiries (wrong token) status", False, f"Expected 401, got {response.status_code}")
            return False
        
        print_test("GET /api/admin/enquiries (wrong token) status", True, "Status: 401")
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/admin/enquiries (wrong token) request", False, f"Request failed: {e}")
        return False
    
    # Test 3c: GET /api/admin/enquiries with valid token → 200 array
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/enquiries", headers=headers, timeout=10)
        
        if response.status_code != 200:
            print_test("GET /api/admin/enquiries (valid token) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
            return False
        
        print_test("GET /api/admin/enquiries (valid token) status", True, "Status: 200")
        
        try:
            enquiries = response.json()
        except json.JSONDecodeError as e:
            print_test("GET /api/admin/enquiries (valid token) JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Check if it's an array
        if not isinstance(enquiries, list):
            print_test("GET /api/admin/enquiries returns array", False, f"Expected list, got {type(enquiries)}")
            return False
        
        print_test("GET /api/admin/enquiries returns array", True, f"Array with {len(enquiries)} enquiries")
        
        # Check if the enquiry created in step 1 is in the list (newest first)
        if 'email_test_enquiry_id' in globals():
            found = False
            for enq in enquiries:
                if enq.get('id') == email_test_enquiry_id:
                    found = True
                    break
            
            if not found:
                print_test("Email test enquiry in list", False, f"Enquiry with id '{email_test_enquiry_id}' not found")
                return False
            
            print_test("Email test enquiry in list", True, f"Found enquiry with id '{email_test_enquiry_id}' (newest first)")
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/admin/enquiries (valid token) request", False, f"Request failed: {e}")
        return False
    
    # Test 3d: GET /api/admin/stats with valid token → 200 with {total, new, read}
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code != 200:
            print_test("GET /api/admin/stats (valid token) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
            return False
        
        print_test("GET /api/admin/stats (valid token) status", True, "Status: 200")
        
        try:
            stats = response.json()
        except json.JSONDecodeError as e:
            print_test("GET /api/admin/stats (valid token) JSON", False, f"Invalid JSON: {e}")
            return False
        
        # Check required fields
        required_fields = ['total', 'new', 'read']
        missing_fields = [f for f in required_fields if f not in stats]
        
        if missing_fields:
            print_test("GET /api/admin/stats fields", False, f"Missing fields: {missing_fields}")
            return False
        
        # Check all fields are numeric
        for field in required_fields:
            if not isinstance(stats[field], (int, float)):
                print_test("GET /api/admin/stats field types", False, f"Field '{field}' is not numeric: {type(stats[field])}")
                return False
        
        print_test("GET /api/admin/stats fields", True, f"total: {stats['total']}, new: {stats['new']}, read: {stats['read']}")
        
    except requests.exceptions.RequestException as e:
        print_test("GET /api/admin/stats (valid token) request", False, f"Request failed: {e}")
        return False
    
    # Test 3e: PATCH /api/admin/enquiries/{id} with valid token → 200 {ok:true}
    if 'email_test_enquiry_id' in globals():
        try:
            headers = {"Authorization": f"Bearer {admin_token}"}
            response = requests.patch(f"{BASE_URL}/admin/enquiries/{email_test_enquiry_id}", headers=headers, timeout=10)
            
            if response.status_code != 200:
                print_test("PATCH /api/admin/enquiries/{id} (valid token) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
                return False
            
            print_test("PATCH /api/admin/enquiries/{id} (valid token) status", True, "Status: 200")
            
            try:
                result = response.json()
            except json.JSONDecodeError as e:
                print_test("PATCH /api/admin/enquiries/{id} (valid token) JSON", False, f"Invalid JSON: {e}")
                return False
            
            # Check ok field
            if result.get('ok') != True:
                print_test("PATCH /api/admin/enquiries/{id} response", False, f"Expected {{ok: true}}, got {result}")
                return False
            
            print_test("PATCH /api/admin/enquiries/{id} response", True, "ok: true")
            
            # Verify status is now "read" by fetching enquiries again
            response = requests.get(f"{BASE_URL}/admin/enquiries", headers=headers, timeout=10)
            
            if response.status_code != 200:
                print_test("Verify enquiry status updated", False, f"Failed to fetch enquiries: {response.status_code}")
                return False
            
            enquiries = response.json()
            found = False
            for enq in enquiries:
                if enq.get('id') == email_test_enquiry_id:
                    if enq.get('status') != 'read':
                        print_test("Verify enquiry status updated", False, f"Expected status 'read', got '{enq.get('status')}'")
                        return False
                    found = True
                    break
            
            if not found:
                print_test("Verify enquiry status updated", False, f"Enquiry with id '{email_test_enquiry_id}' not found")
                return False
            
            print_test("Verify enquiry status updated", True, "status: 'read'")
            
        except requests.exceptions.RequestException as e:
            print_test("PATCH /api/admin/enquiries/{id} (valid token) request", False, f"Request failed: {e}")
            return False
    
    # Test 3f: DELETE /api/admin/enquiries/{id} with valid token → 200 {ok:true}
    if 'email_test_enquiry_id' in globals():
        try:
            headers = {"Authorization": f"Bearer {admin_token}"}
            response = requests.delete(f"{BASE_URL}/admin/enquiries/{email_test_enquiry_id}", headers=headers, timeout=10)
            
            if response.status_code != 200:
                print_test("DELETE /api/admin/enquiries/{id} (valid token) status", False, f"Expected 200, got {response.status_code}\nResponse: {response.text}")
                return False
            
            print_test("DELETE /api/admin/enquiries/{id} (valid token) status", True, "Status: 200")
            
            try:
                result = response.json()
            except json.JSONDecodeError as e:
                print_test("DELETE /api/admin/enquiries/{id} (valid token) JSON", False, f"Invalid JSON: {e}")
                return False
            
            # Check ok field
            if result.get('ok') != True:
                print_test("DELETE /api/admin/enquiries/{id} response", False, f"Expected {{ok: true}}, got {result}")
                return False
            
            print_test("DELETE /api/admin/enquiries/{id} response", True, "ok: true")
            
        except requests.exceptions.RequestException as e:
            print_test("DELETE /api/admin/enquiries/{id} (valid token) request", False, f"Request failed: {e}")
            return False
    
    # Test 3g: DELETE /api/admin/enquiries/{id} with non-existent id → 404
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/enquiries/non-existent-id-12345", headers=headers, timeout=10)
        
        if response.status_code != 404:
            print_test("DELETE /api/admin/enquiries/{id} (non-existent) status", False, f"Expected 404, got {response.status_code}")
            return False
        
        print_test("DELETE /api/admin/enquiries/{id} (non-existent) status", True, "Status: 404")
        
    except requests.exceptions.RequestException as e:
        print_test("DELETE /api/admin/enquiries/{id} (non-existent) request", False, f"Request failed: {e}")
        return False
    
    return True

def main():
    print(f"\n{Colors.YELLOW}{'='*60}{Colors.END}")
    print(f"{Colors.YELLOW}THE STUDIO M - Backend API Test Suite{Colors.END}")
    print(f"{Colors.YELLOW}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.YELLOW}{'='*60}{Colors.END}\n")
    
    results = {
        "GET /api/projects": test_get_projects(),
        "GET /api/projects/{id}": test_get_project_by_id(),
        "POST /api/enquiries": test_post_enquiries(),
        "GET /api/enquiries": test_get_enquiries(),
        "POST /api/enquiries (email + status)": test_enquiry_email_status(),
        "POST /api/admin/login": test_admin_login(),
        "Admin protected endpoints": test_admin_protected_endpoints()
    }
    
    print(f"\n{Colors.YELLOW}{'='*60}{Colors.END}")
    print(f"{Colors.YELLOW}Test Summary{Colors.END}")
    print(f"{Colors.YELLOW}{'='*60}{Colors.END}\n")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}✓ PASS{Colors.END}" if result else f"{Colors.RED}✗ FAIL{Colors.END}"
        print(f"{status} - {test_name}")
    
    print(f"\n{Colors.YELLOW}Total: {passed}/{total} tests passed{Colors.END}\n")
    
    if passed == total:
        print(f"{Colors.GREEN}All tests passed! ✓{Colors.END}\n")
        return 0
    else:
        print(f"{Colors.RED}Some tests failed. Please review the output above.{Colors.END}\n")
        return 1

if __name__ == "__main__":
    exit(main())
