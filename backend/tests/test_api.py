"""
FastAPI Backend Unit Test Suite — Phase 6
Extended with Comprehensive Tests for API Health, CRUD Lifecycles, and Pydantic Validation
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from api_server import app

client = TestClient(app)

# 1. Health and Root Endpoints Test
def test_health_and_root_endpoints():
    root_res = client.get("/")
    assert root_res.status_code == 200
    assert root_res.json()["status"] == "running"

    health_res = client.get("/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"

# 2. Customers CRUD Lifecycle Test
def test_customers_crud_lifecycle():
    # Create Customer
    payload = {
        "name": "Pytest User",
        "email": "pytest@abp.ai",
        "product": "Pro Subscription",
        "status": "Active",
        "spent": 199.99
    }
    create_res = client.post("/api/customers", json=payload)
    assert create_res.status_code == 200
    customer = create_res.json()["customer"]
    cust_id = customer["id"]
    assert customer["name"] == "Pytest User"

    # Read Customers
    list_res = client.get("/api/customers")
    assert list_res.status_code == 200
    customers = list_res.json()["customers"]
    assert any(c["id"] == cust_id for c in customers)

    # Update Customer
    update_res = client.put(f"/api/customers/{cust_id}", json={"status": "VIP", "spent": 299.99})
    assert update_res.status_code == 200
    assert update_res.json()["customer"]["status"] == "VIP"

    # Delete Customer
    delete_res = client.delete(f"/api/customers/{cust_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Customer deleted"

# 3. Contacts CRUD Lifecycle Test
def test_contacts_crud_lifecycle():
    # Create Contact
    payload = {
        "name": "Alex Influencer",
        "role": "Fashion Creator",
        "company": "AlexMedia",
        "channel": "Instagram",
        "score": 9,
        "email": "alex@influencer.com"
    }
    create_res = client.post("/api/contacts/db", json=payload)
    assert create_res.status_code == 200
    contact = create_res.json()["contact"]
    contact_id = contact["id"]
    assert contact["name"] == "Alex Influencer"

    # Read Contacts
    list_res = client.get("/api/contacts/db")
    assert list_res.status_code == 200
    contacts = list_res.json()["contacts"]
    assert any(c["id"] == contact_id for c in contacts)

    # Delete Contact
    delete_res = client.delete(f"/api/contacts/db/{contact_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Contact deleted"

# 4. Products CRUD Lifecycle Test
def test_products_crud_lifecycle():
    # Create Product
    payload = {
        "title": "Pytest Neon Mug",
        "prompt": "Cyberpunk ceramic mug",
        "style": "Cyberpunk",
        "color_palette": "Neon",
        "image_url": "https://example.com/mug.png",
        "price": 34.99
    }
    create_res = client.post("/api/products/db", json=payload)
    assert create_res.status_code == 200
    prod = create_res.json()["product"]
    prod_id = prod["id"]
    assert prod["title"] == "Pytest Neon Mug"

    # Read Products
    list_res = client.get("/api/products/db")
    assert list_res.status_code == 200
    products = list_res.json()["products"]
    assert any(p["id"] == prod_id for p in products)

    # Delete Product
    delete_res = client.delete(f"/api/products/db/{prod_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Product deleted"

# 5. Campaigns CRUD Lifecycle Test
def test_campaigns_crud_lifecycle():
    # Create Campaign
    payload = {
        "name": "Winter Clearance Promo",
        "product": "Waterproof Snow Boots",
        "audience": "Skiers and snowboarders",
        "budget": 2500.0,
        "platforms": ["Instagram", "Facebook"],
        "goal": "Sales Conversion",
        "tone": "Bold",
        "strategy": "Launch discounts and targeted ad graphics",
        "social_posts": "Grab your boots at 20% off!",
        "email": "Winter Clearance is here!"
    }
    create_res = client.post("/api/campaigns/db", json=payload)
    assert create_res.status_code == 200
    campaign = create_res.json()["campaign"]
    camp_id = campaign["id"]
    assert campaign["name"] == "Winter Clearance Promo"

    # Read Campaigns
    list_res = client.get("/api/campaigns/db")
    assert list_res.status_code == 200
    campaigns = list_res.json()["campaigns"]
    assert any(c["id"] == camp_id for c in campaigns)

    # Delete Campaign
    delete_res = client.delete(f"/api/campaigns/db/{camp_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Campaign deleted"

# 6. Scheduled Posts CRUD Lifecycle Test
def test_scheduled_posts_crud_lifecycle():
    # Create Scheduled Post
    payload = {
        "title": "Weekly Tech Tips",
        "content": "Make sure to backup your databases hourly! #DevOps #Tech",
        "platform": "Twitter/X",
        "scheduled_time": "2025-12-25T12:00:00Z",
        "status": "Scheduled"
    }
    create_res = client.post("/api/schedule", json=payload)
    assert create_res.status_code == 200
    post = create_res.json()["post"]
    post_id = post["id"]
    assert post["title"] == "Weekly Tech Tips"

    # Read Scheduled Posts
    list_res = client.get("/api/schedule")
    assert list_res.status_code == 200
    posts = list_res.json()["scheduled_posts"]
    assert any(p["id"] == post_id for p in posts)

    # Delete Scheduled Post
    delete_res = client.delete(f"/api/schedule/{post_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Post deleted successfully"

# 7. Pydantic Validation Error Rejection Test
def test_pydantic_validation_rejection():
    # Missing required 'product_description'
    invalid_payload = {
        "target_audience": "Techies"
    }
    res = client.post("/api/campaigns/generate", json=invalid_payload)
    assert res.status_code == 422  # Unprocessable Entity (Pydantic validation error)
