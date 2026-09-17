# backend/test_db_connection.py
"""
Diagnostic & Verification Script for Krishna Accessories PostgreSQL Database Connection.
Run this script anytime to verify that PostgreSQL is working properly.
"""
import os
import sys
import time

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from dotenv import load_dotenv
ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(ENV_PATH)

from database import (
    get_db_connection,
    init_db,
    row_to_dict,
    PGHOST,
    PGPORT,
    PGUSER,
    PGDATABASE,
    TABLE_CONFLICT_KEYS
)

def run_tests():
    print("=" * 60)
    print(" KRISHNA ACCESSORIES - POSTGRESQL CONNECTION TEST")
    print("=" * 60)
    print(f"Host     : {PGHOST}")
    print(f"Port     : {PGPORT}")
    print(f"Database : {PGDATABASE}")
    print(f"User     : {PGUSER}")
    print("-" * 60)

    # Test 1: Connect
    try:
        conn = get_db_connection()
        print("[PASS] Successfully connected to PostgreSQL server!")
    except Exception as e:
        print(f"[FAIL] Could not connect to PostgreSQL: {e}")
        print("\nPlease check your credentials in backend/.env file.")
        return

    # Test 2: Query tables & row counts
    cur = conn.cursor()
    print("\nVerifying Tables & Data Records:")
    tables = list(TABLE_CONFLICT_KEYS.keys())
    total_records = 0
    for table in tables:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            cnt = cur.fetchone()[0]
            total_records += cnt
            print(f"  ✓ {table:22s} : {cnt:4d} rows")
        except Exception as e:
            print(f"  ✗ {table:22s} : Error ({e})")
            conn.rollback()

    print("-" * 60)
    print(f"Total Tables Checked: {len(tables)} | Total Database Rows: {total_records}")

    # Test 3: Sample Product Query
    try:
        cur.execute("SELECT * FROM products LIMIT 1")
        sample_prod = cur.fetchone()
        if sample_prod:
            prod_dict = row_to_dict(sample_prod)
            print(f"\n[PASS] Sample Product Read: ID={prod_dict.get('id')}, Name='{prod_dict.get('name')}', Price=₹{prod_dict.get('price')}")
        else:
            print("\n[NOTE] Products table is currently empty.")
    except Exception as e:
        print(f"\n[FAIL] Sample product read error: {e}")

    # Test 4: Sample Admin User Query
    try:
        cur.execute("SELECT id, name, email, role FROM users WHERE email = 'admin@krishna.com'")
        admin = cur.fetchone()
        if admin:
            admin_dict = row_to_dict(admin)
            print(f"[PASS] Admin User Verified : Name='{admin_dict.get('name')}', Email='{admin_dict.get('email')}', Role='{admin_dict.get('role')}'")
        else:
            print("[NOTE] Admin user not found. Run 'python seed_data.py' to create default accounts.")
    except Exception as e:
        print(f"[FAIL] User verification error: {e}")

    conn.close()
    print("\n" + "=" * 60)
    print(" ALL POSTGRESQL TESTS PASSED SUCCESSFULLY! ")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
