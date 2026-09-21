# backend/database.py
import os
import re
import json
import hashlib
import secrets
import hmac
from typing import Any, List, Dict, Optional, Tuple, Union
import psycopg2
from dotenv import load_dotenv

# Load environment variables from backend/.env
ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(ENV_PATH)

PGHOST = os.getenv("PGHOST", "localhost")
PGPORT = int(os.getenv("PGPORT", "5432"))
PGUSER = os.getenv("PGUSER", "postgres")
PGPASSWORD = os.getenv("PGPASSWORD", "vrushali")
PGDATABASE = os.getenv("PGDATABASE", "krishna_db")
DATABASE_URL = os.getenv("DATABASE_URL")

TABLE_CONFLICT_KEYS = {
    'products': ['id'],
    'categories': ['name'],
    'brands': ['name'],
    'subcategories': ['id'],
    'variants': ['id'],
    'orders': ['id'],
    'users': ['email'],
    'suppliers': ['id'],
    'promotions': ['id'],
    'media_assets': ['id'],
    'roles': ['id'],
    'permissions': ['key'],
    'shipping_carriers': ['id'],
    'system_config': ['key'],
    'notifications': ['id'],
    'reviews': ['id'],
    'cart_items': ['userId', 'productId', 'itemData'],
    'wishlist_items': ['userId', 'productId'],
    'user_addresses': ['id'],
    'otp_codes': ['email', 'type'],
    'email_logs': ['id'],
}

CAMEL_CASE_MAP = {
    "oldprice": "oldPrice",
    "imageangles": "imageAngles",
    "colorimages": "colorImages",
    "variantpricedeltas": "variantPriceDeltas",
    "variationstock": "variationStock",
    "isnew": "isNew",
    "istrending": "isTrending",
    "isbestseller": "isBestSeller",
    "createdat": "createdAt",
    "itemcount": "itemCount",
    "productname": "productName",
    "attributetype": "attributeType",
    "pricemodifier": "priceModifier",
    "paymentmethod": "paymentMethod",
    "paymentstatus": "paymentStatus",
    "orderstatus": "orderStatus",
    "deliveryexpected": "deliveryExpected",
    "shippingaddress": "shippingAddress",
    "returndetails": "returnDetails",
    "returnstatus": "returnStatus",
    "orderscount": "ordersCount",
    "totalspent": "totalSpent",
    "joineddate": "joinedDate",
    "productscount": "productsCount",
    "totalearnings": "totalEarnings",
    "minorder": "minOrder",
    "maxdiscount": "maxDiscount",
    "validuntil": "validUntil",
    "usagecount": "usageCount",
    "applicablecategory": "applicableCategory",
    "uploadeddate": "uploadedDate",
    "userscount": "usersCount",
    "servicetype": "serviceType",
    "avgdays": "avgDays",
    "rateperkg": "ratePerKg",
    "apiconnected": "apiConnected",
    "productid": "productId",
    "username": "userName",
    "userid": "userId",
    "itemdata": "itemData",
    "isdefault": "isDefault",
    "expiresat": "expiresAt",
    "otpcode": "otpCode"
}

class RowDict(dict):
    """
    Dictionary-compatible and tuple-indexable row wrapper.
    Provides case-insensitive column lookup and camelCase compatibility.
    """
    def __init__(self, raw_tuple, description):
        super().__init__()
        self._tuple = raw_tuple
        if description and raw_tuple:
            for i, col in enumerate(description):
                col_name = col.name
                val = raw_tuple[i]
                self[col_name] = val
                camel = CAMEL_CASE_MAP.get(col_name.lower())
                if camel and camel != col_name:
                    self[camel] = val

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._tuple[key]
        if key in self:
            return super().__getitem__(key)
        lower = str(key).lower()
        if lower in self:
            return super().__getitem__(lower)
        camel = CAMEL_CASE_MAP.get(lower)
        if camel and camel in self:
            return super().__getitem__(camel)
        return super().__getitem__(key)

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return default

def translate_query(query: str) -> str:
    """
    Translates SQLite queries to PostgreSQL syntax:
    1. 'INSERT OR IGNORE INTO table ...' -> 'INSERT INTO table ... ON CONFLICT DO NOTHING'
    2. 'INSERT OR REPLACE INTO table ...' -> 'INSERT INTO table ... ON CONFLICT (key) DO UPDATE SET ...'
    3. Converts '?' parameter placeholders to '%s'
    """
    q = query.strip()
    
    # 1. Handle INSERT OR IGNORE
    if re.search(r'INSERT\s+OR\s+IGNORE\s+INTO', q, re.IGNORECASE):
        q = re.sub(r'INSERT\s+OR\s+IGNORE\s+INTO', 'INSERT INTO', q, flags=re.IGNORECASE)
        if not re.search(r'ON\s+CONFLICT', q, re.IGNORECASE):
            q = q.rstrip('; \t\n') + " ON CONFLICT DO NOTHING"

    # 2. Handle INSERT OR REPLACE
    elif re.search(r'INSERT\s+OR\s+REPLACE\s+INTO', q, re.IGNORECASE):
        match = re.search(r'INSERT\s+OR\s+REPLACE\s+INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES', q, re.IGNORECASE)
        if match:
            table_name = match.group(1).lower()
            columns_str = match.group(2)
            cols = [c.strip().strip('"`[]') for c in columns_str.split(',')]
            
            conflict_cols = TABLE_CONFLICT_KEYS.get(table_name, ['id'])
            actual_conflict = [c for c in conflict_cols if c.lower() in [col.lower() for col in cols]]
            if not actual_conflict:
                actual_conflict = conflict_cols

            update_cols = [c for c in cols if c.lower() not in [ac.lower() for ac in actual_conflict]]
            
            q = re.sub(r'INSERT\s+OR\s+REPLACE\s+INTO', 'INSERT INTO', q, flags=re.IGNORECASE)
            if update_cols and not re.search(r'ON\s+CONFLICT', q, re.IGNORECASE):
                conflict_clause = ", ".join(actual_conflict)
                updates = ", ".join(f'{c} = EXCLUDED.{c}' for c in update_cols)
                q = q.rstrip('; \t\n') + f' ON CONFLICT ({conflict_clause}) DO UPDATE SET {updates}'
            elif not re.search(r'ON\s+CONFLICT', q, re.IGNORECASE):
                conflict_clause = ", ".join(actual_conflict)
                q = q.rstrip('; \t\n') + f' ON CONFLICT ({conflict_clause}) DO NOTHING'

    # 3. Replace ? placeholders with %s
    q = re.sub(r'\?', '%s', q)
    return q

class PgCursorWrapper:
    """Wrapper around psycopg2 cursor providing SQLite-like ease of use."""
    def __init__(self, raw_cursor):
        self._cursor = raw_cursor

    def execute(self, query: str, params: Optional[Union[List, Tuple, Dict]] = None):
        translated = translate_query(query)
        if params is not None:
            if isinstance(params, list):
                params = tuple(params)
            self._cursor.execute(translated, params)
        else:
            self._cursor.execute(translated)
        return self

    def executemany(self, query: str, param_list: List[Union[List, Tuple]]):
        translated = translate_query(query)
        self._cursor.executemany(translated, param_list)
        return self

    def fetchone(self):
        row = self._cursor.fetchone()
        if row is None:
            return None
        return RowDict(row, self._cursor.description)

    def fetchall(self):
        rows = self._cursor.fetchall()
        if not rows:
            return []
        desc = self._cursor.description
        return [RowDict(r, desc) for r in rows]

    def fetchmany(self, size=None):
        rows = self._cursor.fetchmany(size)
        if not rows:
            return []
        desc = self._cursor.description
        return [RowDict(r, desc) for r in rows]

    @property
    def rowcount(self):
        return self._cursor.rowcount

    @property
    def description(self):
        return self._cursor.description

    def close(self):
        self._cursor.close()

    def __iter__(self):
        desc = self._cursor.description
        for r in self._cursor:
            yield RowDict(r, desc)

class PgConnectionWrapper:
    """Wrapper around psycopg2 connection for transparent execution and closing."""
    def __init__(self, raw_conn):
        self._conn = raw_conn

    def cursor(self):
        return PgCursorWrapper(self._conn.cursor())

    def execute(self, query: str, params: Optional[Union[List, Tuple, Dict]] = None):
        cur = self.cursor()
        cur.execute(query, params)
        return cur

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

def ensure_postgres_database_exists():
    """Ensure the target database exists in PostgreSQL (for local development)."""
    db_url = os.getenv("DATABASE_URL", DATABASE_URL)
    if db_url:
        # Managed cloud databases (Render, Supabase, Neon) already have their database allocated
        return

    try:
        conn = psycopg2.connect(
            host=PGHOST,
            port=PGPORT,
            user=PGUSER,
            password=PGPASSWORD,
            dbname="postgres"
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (PGDATABASE,))
        exists = cur.fetchone()
        if not exists:
            cur.execute(f'CREATE DATABASE "{PGDATABASE}"')
            print(f"[PostgreSQL] Created database '{PGDATABASE}' successfully.")
        cur.close()
        conn.close()
    except Exception:
        pass

def get_raw_pg_connection():
    db_url = os.getenv("DATABASE_URL", DATABASE_URL)
    try:
        if db_url:
            return psycopg2.connect(db_url)
        return psycopg2.connect(
            host=PGHOST,
            port=PGPORT,
            user=PGUSER,
            password=PGPASSWORD,
            dbname=PGDATABASE
        )
    except psycopg2.OperationalError as e:
        if "localhost" in str(e) or "127.0.0.1" in str(e) or "::1" in str(e):
            print("\n" + "="*70)
            print("[DATABASE CONNECTION ERROR]")
            print("Failed to connect to PostgreSQL at localhost:5432.")
            print("If deploying on cloud hosting (Render, Railway, etc.), you must configure")
            print("the 'DATABASE_URL' environment variable in your dashboard with your cloud database URI.")
            print("="*70 + "\n")
        raise

def get_db_connection() -> PgConnectionWrapper:
    """Returns an active, wrapped PostgreSQL database connection."""
    raw = get_raw_pg_connection()
    return PgConnectionWrapper(raw)

def init_db():
    """Initializes PostgreSQL schema with all required tables and constraints."""
    ensure_postgres_database_exists()
    conn = get_db_connection()
    cursor = conn.cursor()

    DDL_STATEMENTS = [
        # 1. Products
        """
        CREATE TABLE IF NOT EXISTS products (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            brand TEXT,
            category TEXT,
            subcategory TEXT,
            sku TEXT,
            price DOUBLE PRECISION NOT NULL,
            oldPrice DOUBLE PRECISION,
            discount DOUBLE PRECISION,
            stock INTEGER DEFAULT 0,
            rating DOUBLE PRECISION DEFAULT 5.0,
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
        """,
        # 2. Categories
        """
        CREATE TABLE IF NOT EXISTS categories (
            id BIGSERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL
        )
        """,
        # 3. Brands
        """
        CREATE TABLE IF NOT EXISTS brands (
            id BIGSERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            category TEXT
        )
        """,
        # 4. Subcategories
        """
        CREATE TABLE IF NOT EXISTS subcategories (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            code TEXT,
            itemCount INTEGER DEFAULT 0
        )
        """,
        # 5. Variants
        """
        CREATE TABLE IF NOT EXISTS variants (
            id BIGSERIAL PRIMARY KEY,
            productName TEXT NOT NULL,
            sku TEXT,
            attributeType TEXT,
            value TEXT,
            priceModifier DOUBLE PRECISION DEFAULT 0,
            stock INTEGER DEFAULT 0,
            status TEXT DEFAULT 'In Stock'
        )
        """,
        # 6. Orders
        """
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            date TEXT,
            customer TEXT,
            items TEXT,
            total DOUBLE PRECISION NOT NULL,
            subtotal DOUBLE PRECISION,
            discount DOUBLE PRECISION DEFAULT 0,
            shipping DOUBLE PRECISION DEFAULT 0,
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
        """,
        # 7. Users
        """
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'Customer',
            status TEXT DEFAULT 'Active',
            ordersCount INTEGER DEFAULT 0,
            totalSpent DOUBLE PRECISION DEFAULT 0,
            joinedDate TEXT,
            addresses TEXT,
            password TEXT
        )
        """,
        # 8. Suppliers
        """
        CREATE TABLE IF NOT EXISTS suppliers (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            category TEXT,
            status TEXT DEFAULT 'Pending Approval',
            joinedDate TEXT,
            rating DOUBLE PRECISION DEFAULT 5.0,
            productsCount INTEGER DEFAULT 0,
            totalEarnings DOUBLE PRECISION DEFAULT 0,
            address TEXT
        )
        """,
        # 9. Promotions / Coupons
        """
        CREATE TABLE IF NOT EXISTS promotions (
            id BIGSERIAL PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            type TEXT DEFAULT 'Percentage',
            value DOUBLE PRECISION NOT NULL,
            minOrder DOUBLE PRECISION DEFAULT 0,
            maxDiscount DOUBLE PRECISION,
            validUntil TEXT,
            status TEXT DEFAULT 'Active',
            usageCount INTEGER DEFAULT 0,
            applicableCategory TEXT DEFAULT 'All'
        )
        """,
        # 10. Media Assets
        """
        CREATE TABLE IF NOT EXISTS media_assets (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            url TEXT NOT NULL,
            size TEXT,
            dimensions TEXT,
            uploadedDate TEXT
        )
        """,
        # 11. Roles
        """
        CREATE TABLE IF NOT EXISTS roles (
            id BIGSERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            usersCount INTEGER DEFAULT 0,
            color TEXT DEFAULT 'indigo'
        )
        """,
        # 12. Permissions Matrix
        """
        CREATE TABLE IF NOT EXISTS permissions (
            key TEXT PRIMARY KEY,
            matrix TEXT
        )
        """,
        # 13. Shipping Carriers
        """
        CREATE TABLE IF NOT EXISTS shipping_carriers (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            serviceType TEXT,
            status TEXT DEFAULT 'Active',
            avgDays TEXT,
            ratePerKg DOUBLE PRECISION,
            apiConnected INTEGER DEFAULT 1
        )
        """,
        # 14. System Configuration
        """
        CREATE TABLE IF NOT EXISTS system_config (
            key TEXT PRIMARY KEY,
            data TEXT NOT NULL
        )
        """,
        # 15. Notifications
        """
        CREATE TABLE IF NOT EXISTS notifications (
            id BIGSERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT,
            time TEXT,
            type TEXT DEFAULT 'info',
            read INTEGER DEFAULT 0
        )
        """,
        # 16. Reviews
        """
        CREATE TABLE IF NOT EXISTS reviews (
            id BIGSERIAL PRIMARY KEY,
            productId BIGINT NOT NULL,
            userName TEXT NOT NULL,
            rating DOUBLE PRECISION NOT NULL,
            comment TEXT,
            date TEXT,
            verified INTEGER DEFAULT 1
        )
        """,
        # 17. Cart Items
        """
        CREATE TABLE IF NOT EXISTS cart_items (
            id BIGSERIAL PRIMARY KEY,
            userId BIGINT NOT NULL,
            productId BIGINT NOT NULL,
            itemData TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            CONSTRAINT unique_cart_item UNIQUE (userId, productId, itemData)
        )
        """,
        # 18. Wishlist Items
        """
        CREATE TABLE IF NOT EXISTS wishlist_items (
            userId BIGINT NOT NULL,
            productId BIGINT NOT NULL,
            itemData TEXT NOT NULL,
            PRIMARY KEY (userId, productId)
        )
        """,
        # 19. User Addresses
        """
        CREATE TABLE IF NOT EXISTS user_addresses (
            id BIGSERIAL PRIMARY KEY,
            userId BIGINT NOT NULL,
            address TEXT NOT NULL,
            isDefault INTEGER DEFAULT 0
        )
        """,
        # 20. OTP Codes
        """
        CREATE TABLE IF NOT EXISTS otp_codes (
            id BIGSERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            type TEXT NOT NULL,
            code TEXT NOT NULL,
            expiresAt BIGINT NOT NULL,
            attempts INTEGER DEFAULT 0,
            CONSTRAINT unique_otp_email_type UNIQUE (email, type)
        )
        """,
        # 21. Email Logs
        """
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
        """
    ]

    for stmt in DDL_STATEMENTS:
        cursor.execute(stmt)

    # Alter existing columns to BIGINT if they were created as INTEGER
    alter_statements = [
        "ALTER TABLE products ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE categories ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE brands ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE subcategories ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE variants ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE users ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE suppliers ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE promotions ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE media_assets ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE roles ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE shipping_carriers ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE notifications ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE reviews ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE reviews ALTER COLUMN productId TYPE BIGINT",
        "ALTER TABLE cart_items ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE cart_items ALTER COLUMN userId TYPE BIGINT",
        "ALTER TABLE cart_items ALTER COLUMN productId TYPE BIGINT",
        "ALTER TABLE wishlist_items ALTER COLUMN userId TYPE BIGINT",
        "ALTER TABLE wishlist_items ALTER COLUMN productId TYPE BIGINT",
        "ALTER TABLE user_addresses ALTER COLUMN id TYPE BIGINT",
        "ALTER TABLE user_addresses ALTER COLUMN userId TYPE BIGINT",
        "ALTER TABLE otp_codes ALTER COLUMN id TYPE BIGINT",
    ]
    for alt in alter_statements:
        try:
            cursor.execute(alt)
        except Exception:
            pass

    conn.commit()
    conn.close()

def sync_sequences():
    """Synchronizes PostgreSQL auto-increment sequences with existing max table IDs."""
    conn = get_db_connection()
    cursor = conn.cursor()
    SERIAL_TABLES = [
        "products", "categories", "brands", "subcategories", "variants",
        "users", "suppliers", "promotions", "media_assets", "roles",
        "shipping_carriers", "notifications", "reviews", "cart_items",
        "user_addresses", "otp_codes"
    ]
    for table in SERIAL_TABLES:
        try:
            cursor.execute(f"""
                SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM {table}), 0) + 1, false);
            """)
            conn.commit()
        except Exception:
            conn.rollback()
    conn.close()

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

def row_to_dict(row: Any) -> dict:
    if row is None:
        return {}
    
    raw_dict = dict(row)
    d = {}
    for k, v in raw_dict.items():
        normal_key = CAMEL_CASE_MAP.get(k.lower(), k)
        d[normal_key] = v

    # JSON fields to unpack
    json_fields = [
        'images', 'imageAngles', 'features', 'specifications', 'colors',
        'sizes', 'variants', 'colorImages', 'variantPriceDeltas',
        'variationStock', 'customer', 'items', 'timeline', 'returnDetails',
        'shippingAddress', 'addresses', 'matrix', 'data', 'itemData', 'address'
    ]
    for key in json_fields:
        if key in d and d[key] is not None:
            d[key] = parse_json_field(d[key])
    return d

if __name__ == "__main__":
    print(f"Testing PostgreSQL connection to {PGHOST}:{PGPORT}/{PGDATABASE} (User: {PGUSER})...")
    init_db()
    sync_sequences()
    print("PostgreSQL Database initialized successfully!")
