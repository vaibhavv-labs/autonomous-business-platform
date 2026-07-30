import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).parent / "abp_database.db"

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Customers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        product TEXT DEFAULT '',
        status TEXT DEFAULT 'Active',
        spent REAL DEFAULT 0.0,
        joined TEXT DEFAULT '',
        created_at TEXT NOT NULL
    )
    """)

    # Seed sample customers if empty
    cursor.execute("SELECT COUNT(*) as count FROM customers")
    if cursor.fetchone()["count"] == 0:
        sample_customers = [
            ("1", "Emma Johnson", "emma@example.com", "Eco Tote Bag", "Active", 124.0, "2024-01-15", datetime.utcnow().isoformat()),
            ("2", "Liam Chen", "liam@example.com", "Custom Hoodie", "Active", 89.0, "2024-02-20", datetime.utcnow().isoformat()),
            ("3", "Sofia Martinez", "sofia@example.com", "Phone Case", "Inactive", 45.0, "2024-03-10", datetime.utcnow().isoformat()),
            ("4", "Noah Williams", "noah@example.com", "Ceramic Mug Set", "Active", 210.0, "2024-03-22", datetime.utcnow().isoformat()),
            ("5", "Ava Brown", "ava@example.com", "Wall Art Print", "VIP", 560.0, "2024-04-01", datetime.utcnow().isoformat()),
        ]
        cursor.executemany(
            "INSERT INTO customers (id, name, email, product, status, spent, joined, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            sample_customers
        )

    # 2. Contacts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT DEFAULT '',
        company TEXT DEFAULT '',
        channel TEXT DEFAULT 'Email',
        score INTEGER DEFAULT 5,
        strategy TEXT DEFAULT '',
        email TEXT DEFAULT '',
        status TEXT DEFAULT 'New',
        created_at TEXT NOT NULL
    )
    """)

    # 3. Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        prompt TEXT DEFAULT '',
        style TEXT DEFAULT '',
        color_palette TEXT DEFAULT '',
        image_url TEXT NOT NULL,
        price REAL DEFAULT 29.99,
        status TEXT DEFAULT 'Active',
        created_at TEXT NOT NULL
    )
    """)

    # 4. Campaigns Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        product TEXT NOT NULL,
        audience TEXT DEFAULT '',
        budget REAL DEFAULT 5000.0,
        platforms TEXT DEFAULT '[]',
        goal TEXT DEFAULT '',
        tone TEXT DEFAULT '',
        strategy TEXT DEFAULT '',
        social_posts TEXT DEFAULT '',
        email TEXT DEFAULT '',
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

# Initial database setup
init_db()

# ─── Customers DB Helpers ───────────────────────────────────────────────────

def get_all_customers() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_customer(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    cust_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    joined_date = data.get("joined") or now[:10]
    cursor.execute(
        "INSERT INTO customers (id, name, email, product, status, spent, joined, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            cust_id,
            data["name"],
            data["email"],
            data.get("product", ""),
            data.get("status", "Active"),
            float(data.get("spent", 0.0)),
            joined_date,
            now,
        )
    )
    conn.commit()
    conn.close()
    return {"id": cust_id, "name": data["name"], "email": data["email"], "product": data.get("product", ""), "status": data.get("status", "Active"), "spent": float(data.get("spent", 0.0)), "joined": joined_date, "created_at": now}

def update_customer(cust_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE id = ?", (cust_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        return None
    
    name = data.get("name", existing["name"])
    email = data.get("email", existing["email"])
    product = data.get("product", existing["product"])
    status = data.get("status", existing["status"])
    spent = float(data.get("spent", existing["spent"]))

    cursor.execute(
        "UPDATE customers SET name = ?, email = ?, product = ?, status = ?, spent = ? WHERE id = ?",
        (name, email, product, status, spent, cust_id)
    )
    conn.commit()
    conn.close()
    return {"id": cust_id, "name": name, "email": email, "product": product, "status": status, "spent": spent, "joined": existing["joined"], "created_at": existing["created_at"]}

def delete_customer(cust_id: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customers WHERE id = ?", (cust_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

# ─── Contacts DB Helpers ────────────────────────────────────────────────────

def get_all_contacts() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_contact(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    contact_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    cursor.execute(
        "INSERT INTO contacts (id, name, role, company, channel, score, strategy, email, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            contact_id,
            data["name"],
            data.get("role", ""),
            data.get("company", ""),
            data.get("channel", "Email"),
            int(data.get("score", 5)),
            data.get("strategy", ""),
            data.get("email", ""),
            data.get("status", "New"),
            now,
        )
    )
    conn.commit()
    conn.close()
    return {"id": contact_id, **data, "created_at": now}

def update_contact(contact_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        return None
    
    updated = {
        "name": data.get("name", existing["name"]),
        "role": data.get("role", existing["role"]),
        "company": data.get("company", existing["company"]),
        "channel": data.get("channel", existing["channel"]),
        "score": int(data.get("score", existing["score"])),
        "strategy": data.get("strategy", existing["strategy"]),
        "email": data.get("email", existing["email"]),
        "status": data.get("status", existing["status"]),
    }
    cursor.execute(
        "UPDATE contacts SET name = ?, role = ?, company = ?, channel = ?, score = ?, strategy = ?, email = ?, status = ? WHERE id = ?",
        (updated["name"], updated["role"], updated["company"], updated["channel"], updated["score"], updated["strategy"], updated["email"], updated["status"], contact_id)
    )
    conn.commit()
    conn.close()
    return {"id": contact_id, **updated, "created_at": existing["created_at"]}

def delete_contact(contact_id: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

# ─── Products DB Helpers ────────────────────────────────────────────────────

def get_all_products() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_product(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    prod_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    cursor.execute(
        "INSERT INTO products (id, title, prompt, style, color_palette, image_url, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            prod_id,
            data["title"],
            data.get("prompt", ""),
            data.get("style", ""),
            data.get("color_palette", ""),
            data["image_url"],
            float(data.get("price", 29.99)),
            data.get("status", "Active"),
            now,
        )
    )
    conn.commit()
    conn.close()
    return {"id": prod_id, **data, "created_at": now}

def update_product(prod_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (prod_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        return None

    title = data.get("title", existing["title"])
    price = float(data.get("price", existing["price"]))
    status = data.get("status", existing["status"])

    cursor.execute(
        "UPDATE products SET title = ?, price = ?, status = ? WHERE id = ?",
        (title, price, status, prod_id)
    )
    conn.commit()
    conn.close()
    return {**dict(existing), "title": title, "price": price, "status": status}

def delete_product(prod_id: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (prod_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

# ─── Campaigns DB Helpers ───────────────────────────────────────────────────

def get_all_campaigns() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campaigns ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_campaign(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    camp_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    platforms = json.dumps(data.get("platforms", [])) if isinstance(data.get("platforms"), list) else str(data.get("platforms", "[]"))
    cursor.execute(
        "INSERT INTO campaigns (id, name, product, audience, budget, platforms, goal, tone, strategy, social_posts, email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            camp_id,
            data.get("name", "Campaign " + now[:10]),
            data.get("product", ""),
            data.get("audience", ""),
            float(data.get("budget", 5000.0)),
            platforms,
            data.get("goal", ""),
            data.get("tone", ""),
            data.get("strategy", ""),
            data.get("social_posts", ""),
            data.get("email", ""),
            now,
        )
    )
    conn.commit()
    conn.close()
    return {"id": camp_id, **data, "created_at": now}

def delete_campaign(camp_id: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM campaigns WHERE id = ?", (camp_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0
