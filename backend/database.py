# backend/database.py
import sqlite3
import json
import os
import hashlib
import secrets
import hmac
from typing import Any, List, Dict, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "krishna.db")

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000)
    return f"{salt}${digest.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, digest = stored_hash.split("$", 1)
        expected = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000).hex()
        return hmac.compare_digest(expected, digest)
    except (ValueError, AttributeError):
        return False

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Products
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT,
        category TEXT,
        subcategory TEXT,
        sku TEXT,
        price REAL NOT NULL,
        oldPrice REAL,
        discount REAL,
        stock INTEGER DEFAULT 0,
        rating REAL DEFAULT 5.0,
        reviews INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Active',
        supplier TEXT,
        image TEXT,
        images TEXT,
        imageAngles TEXT,
        description TEXT,
        features TEXT,
        specifications TEXT,
        colors TEXT,
        sizes TEXT,
        variants TEXT,
        colorImages TEXT,
        variantPriceDeltas TEXT,
        variationStock TEXT,
        badge TEXT,
        isNew INTEGER DEFAULT 0,
        isTrending INTEGER DEFAULT 0,
        isBestSeller INTEGER DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Categories
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )
    """)

    # 3. Brands
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT
    )
    """)

    # 4. Subcategories
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subcategories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        code TEXT,
        itemCount INTEGER DEFAULT 0
    )
    """)

    # 5. Variants
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS variants (
        id INTEGER PRIMARY KEY,
        productName TEXT NOT NULL,
        sku TEXT,
        attributeType TEXT,
        value TEXT,
        priceModifier REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        status TEXT DEFAULT 'In Stock'
    )
    """)

    # 6. Orders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        date TEXT,
        customer TEXT,
        items TEXT,
        total REAL NOT NULL,
        subtotal REAL,
        discount REAL DEFAULT 0,
        shipping REAL DEFAULT 0,
        paymentMethod TEXT,
        paymentStatus TEXT DEFAULT 'Paid',
        orderStatus TEXT DEFAULT 'Processing',
        deliveryExpected TEXT,
        shippingAddress TEXT,
        timeline TEXT,
        returnDetails TEXT,
        returnStatus TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 7. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'Customer',
        status TEXT DEFAULT 'Active',
        ordersCount INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0,
        joinedDate TEXT,
        addresses TEXT,
        password TEXT
    )
    """)

    # 8. Suppliers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        category TEXT,
        status TEXT DEFAULT 'Pending Approval',
        joinedDate TEXT,
        rating REAL DEFAULT 5.0,
        productsCount INTEGER DEFAULT 0,
        totalEarnings REAL DEFAULT 0,
        address TEXT
    )
    """)

    # 9. Promotions / Coupons
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS promotions (
        id INTEGER PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        type TEXT DEFAULT 'Percentage',
        value REAL NOT NULL,
        minOrder REAL DEFAULT 0,
        maxDiscount REAL,
        validUntil TEXT,
        status TEXT DEFAULT 'Active',
        usageCount INTEGER DEFAULT 0,
        applicableCategory TEXT DEFAULT 'All'
    )
    """)

    # 10. Media Assets
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS media_assets (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        url TEXT NOT NULL,
        size TEXT,
        dimensions TEXT,
        uploadedDate TEXT
    )
    """)

    # 11. Roles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        usersCount INTEGER DEFAULT 0,
        color TEXT DEFAULT 'indigo'
    )
    """)

    # 12. Permissions Matrix
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS permissions (
        key TEXT PRIMARY KEY,
        matrix TEXT
    )
    """)

    # 13. Shipping Carriers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shipping_carriers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        serviceType TEXT,
        status TEXT DEFAULT 'Active',
        avgDays TEXT,
        ratePerKg REAL,
        apiConnected INTEGER DEFAULT 1
    )
    """)

    # 14. System Configuration
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )
    """)

    # 15. Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT,
        time TEXT,
        type TEXT DEFAULT 'info',
        read INTEGER DEFAULT 0,
        link TEXT DEFAULT '',
        actionText TEXT DEFAULT ''
    )
    """)
    try:
        cursor.execute("ALTER TABLE notifications ADD COLUMN link TEXT DEFAULT ''")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE notifications ADD COLUMN actionText TEXT DEFAULT ''")
    except Exception:
        pass

    # 16. Reviews
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        userName TEXT NOT NULL,
        rating REAL NOT NULL,
        comment TEXT,
        date TEXT,
        verified INTEGER DEFAULT 1
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        itemData TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        UNIQUE(userId, productId, itemData)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wishlist_items (
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        itemData TEXT NOT NULL,
        PRIMARY KEY(userId, productId)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        address TEXT NOT NULL,
        isDefault INTEGER DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        type TEXT NOT NULL,
        code TEXT NOT NULL,
        expiresAt INTEGER NOT NULL,
        attempts INTEGER DEFAULT 0,
        UNIQUE(email, type)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY,
        recipient TEXT NOT NULL,
        subject TEXT NOT NULL,
        type TEXT,
        body TEXT,
        otpCode TEXT,
        status TEXT DEFAULT 'Delivered',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

def parse_json_field(val: Any) -> Any:
    if val is None:
        return None
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except:
        return val

def dump_json_field(val: Any) -> str:
    if val is None:
        return None
    if isinstance(val, str):
        return val
    return json.dumps(val)

def row_to_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    # JSON fields
    json_fields = [
        'images', 'imageAngles', 'features', 'specifications', 'colors',
        'sizes', 'variants', 'colorImages', 'variantPriceDeltas',
        'variationStock', 'customer', 'items', 'timeline', 'returnDetails',
        'shippingAddress', 'addresses', 'matrix', 'data'
    ]
    for key in json_fields:
        if key in d and d[key] is not None:
            d[key] = parse_json_field(d[key])
    return d
