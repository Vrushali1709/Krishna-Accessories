# backend/migrate_to_postgres.py
"""
Migration script to migrate all existing data from SQLite (krishna.db)
or seed fixtures (all_seed_data.json) into PostgreSQL (krishna_db).
"""
import sys
import os
import sqlite3
import json
import psycopg2
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Load backend/.env
ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(ENV_PATH)

from database import (
    init_db,
    get_db_connection,
    sync_sequences,
    PGHOST,
    PGPORT,
    PGUSER,
    PGDATABASE
)

TABLES_IN_ORDER = [
    "categories",
    "brands",
    "subcategories",
    "variants",
    "products",
    "users",
    "suppliers",
    "promotions",
    "media_assets",
    "roles",
    "permissions",
    "shipping_carriers",
    "system_config",
    "notifications",
    "orders",
    "reviews",
    "cart_items",
    "wishlist_items",
    "user_addresses",
    "otp_codes",
    "email_logs"
]

def migrate_from_sqlite(sqlite_file="krishna.db"):
    full_sqlite_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), sqlite_file)
    if not os.path.exists(full_sqlite_path):
        print(f"[Migration] SQLite file '{full_sqlite_path}' not found. Skipping SQLite transfer.")
        return False

    print(f"[Migration] Reading data from SQLite: {full_sqlite_path}")
    s_conn = sqlite3.connect(full_sqlite_path)
    s_conn.row_factory = sqlite3.Row
    s_cur = s_conn.cursor()

    p_conn = get_db_connection()
    p_cur = p_conn.cursor()

    total_migrated = 0
    for table in TABLES_IN_ORDER:
        try:
            s_cur.execute(f"SELECT * FROM {table}")
            rows = s_cur.fetchall()
            if not rows:
                print(f"  - {table}: 0 rows (skipped)")
                continue

            first = rows[0]
            cols = [c.lower() for c in first.keys()]
            placeholders = ", ".join(["%s"] * len(cols))
            insert_sql = f'INSERT INTO {table} ({", ".join(cols)}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'

            data_tuples = []
            for r in rows:
                data_tuples.append([r[key] for key in first.keys()])

            p_cur.executemany(insert_sql, data_tuples)
            p_conn.commit()
            print(f"  [OK] {table}: Migrated {len(rows)} rows")
            total_migrated += len(rows)
        except Exception as e:
            print(f"  [ERROR] {table}: Error during migration: {e}")
            p_conn.rollback()

    s_conn.close()
    p_conn.close()
    print(f"[Migration] Total rows migrated: {total_migrated}")
    return True

def verify_postgres_counts():
    p_conn = get_db_connection()
    p_cur = p_conn.cursor()
    print("\n--- Current PostgreSQL Table Counts (krishna_db) ---")
    for table in TABLES_IN_ORDER:
        try:
            p_cur.execute(f"SELECT COUNT(*) FROM {table}")
            cnt = p_cur.fetchone()[0]
            print(f"  {table:20s}: {cnt:4d} rows")
        except Exception as e:
            print(f"  {table:20s}: Error: {e}")
    p_conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print(f" Krishna Accessories PostgreSQL Migration Tool")
    print(f" Target: PostgreSQL {PGHOST}:{PGPORT}/{PGDATABASE} (User: {PGUSER})")
    print("=" * 60)
    
    print("\n1. Initializing PostgreSQL tables...")
    init_db()
    
    print("\n2. Migrating SQLite data into PostgreSQL...")
    migrate_from_sqlite()
    
    print("\n3. Synchronizing auto-increment sequences...")
    sync_sequences()
    
    print("\n4. Verifying PostgreSQL table records...")
    verify_postgres_counts()
    
    print("\n" + "=" * 60)
    print(" PostgreSQL Migration Completed Successfully!")
    print("=" * 60)
