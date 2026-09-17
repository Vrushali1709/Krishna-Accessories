# backend/main.py
import os
import time
import json
import base64
import hashlib
import hmac
import secrets
from collections import defaultdict
from datetime import datetime
from typing import Optional, List, Any, Dict
from fastapi import FastAPI, HTTPException, Query, Body, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import init_db, get_db_connection, row_to_dict, dump_json_field, parse_json_field, hash_password, verify_password
from seed_data import seed_database

AUTH_SECRET = os.getenv("AUTH_SECRET", "krishna-accessories-dev-secret").encode("utf-8")

def create_session_token(user: Dict[str, Any]) -> str:
    payload = f"{user['id']}:{user['email']}:{user['role']}:{int(time.time()) + 86400}"
    encoded = base64.urlsafe_b64encode(payload.encode("utf-8")).decode("ascii").rstrip("=")
    signature = hmac.new(AUTH_SECRET, encoded.encode("ascii"), hashlib.sha256).hexdigest()
    return f"{encoded}.{signature}"

def get_authenticated_user(authorization: Optional[str]) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        encoded, signature = authorization[7:].split(".", 1)
        expected = hmac.new(AUTH_SECRET, encoded.encode("ascii"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise ValueError("Invalid signature")
        padded = encoded + "=" * (-len(encoded) % 4)
        user_id, email, role, expires_at = base64.urlsafe_b64decode(padded).decode("utf-8").split(":", 3)
        if int(expires_at) < int(time.time()):
            raise ValueError("Expired token")
        return {"id": int(user_id), "email": email, "role": role}
    except (ValueError, TypeError, IndexError, UnicodeDecodeError):
        raise HTTPException(status_code=401, detail="Invalid or expired session")

# Initialize FastAPI App
app = FastAPI(
    title="Krishna Accessories Backend API",
    description="Python FastAPI REST backend for Krishna Accessories Store & Admin Dashboard",
    version="1.0.0"
)

# Enable CORS for Frontend (Vite runs on localhost:5173 / localhost:3000 / all origins for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_database()

# -------------------------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM products")
        product_count = cur.fetchone()[0]
        conn.close()
        db_status = f"Connected to PostgreSQL (krishna_db, {product_count} products)"
    except Exception as e:
        db_status = f"PostgreSQL Error: {str(e)}"

    return {
        "status": "healthy",
        "service": "Krishna Accessories Python API",
        "database": "PostgreSQL (krishna_db)",
        "databaseStatus": db_status,
        "timestamp": int(time.time())
    }

# -------------------------------------------------------------------
# 1. PRODUCTS & CATALOG
# -------------------------------------------------------------------
@app.get("/api/products")
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    status: Optional[str] = None,
    supplier: Optional[str] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)
    if brand and brand != "All":
        query += " AND brand = ?"
        params.append(brand)
    if status and status != "All":
        query += " AND status = ?"
        params.append(status)
    if supplier:
        query += " AND supplier = ?"
        params.append(supplier)
    if search:
        query += " AND (name LIKE ? OR brand LIKE ? OR category LIKE ? OR sku LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return row_to_dict(row)

@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(product_data: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()

    product_id = product_data.get("id") or int(time.time() * 1000)
    name = product_data.get("name", "Untitled Product")
    brand = product_data.get("brand", "")
    category = product_data.get("category", "Watches")
    subcategory = product_data.get("subcategory", "")
    sku = product_data.get("sku") or f"KA-{category[:3].upper()}-{str(product_id)[-4:]}"
    price = float(product_data.get("price", 0))
    oldPrice = float(product_data.get("oldPrice", price * 1.25))
    discount = float(product_data.get("discount", 0))
    stock = int(product_data.get("stock", 10))
    rating = float(product_data.get("rating", 5.0))
    reviews = int(product_data.get("reviews", 0))
    prod_status = product_data.get("status", "Active")
    supplier = product_data.get("supplier", "Krishna Accessories Official")
    image = product_data.get("image", "")
    images = dump_json_field(product_data.get("images", [image] if image else []))
    imageAngles = dump_json_field(product_data.get("imageAngles", []))
    description = product_data.get("description", "")
    features = dump_json_field(product_data.get("features", []))
    specifications = dump_json_field(product_data.get("specifications", {}))
    colors = dump_json_field(product_data.get("colors", ["Standard"]))
    sizes = dump_json_field(product_data.get("sizes", []))
    variants = dump_json_field(product_data.get("variants", ["Standard"]))
    colorImages = dump_json_field(product_data.get("colorImages", {}))
    variantPriceDeltas = dump_json_field(product_data.get("variantPriceDeltas", {}))
    variationStock = dump_json_field(product_data.get("variationStock", {}))
    badge = product_data.get("badge", "")
    isNew = 1 if product_data.get("isNew") else 0
    isTrending = 1 if product_data.get("isTrending") else 0
    isBestSeller = 1 if product_data.get("isBestSeller") else 0

    cursor.execute("""
    INSERT OR REPLACE INTO products (
        id, name, brand, category, subcategory, sku, price, oldPrice, discount, stock,
        rating, reviews, status, supplier, image, images, imageAngles, description,
        features, specifications, colors, sizes, variants, colorImages, variantPriceDeltas,
        variationStock, badge, isNew, isTrending, isBestSeller
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        product_id, name, brand, category, subcategory, sku, price, oldPrice, discount, stock,
        rating, reviews, prod_status, supplier, image, images, imageAngles, description,
        features, specifications, colors, sizes, variants, colorImages, variantPriceDeltas,
        variationStock, badge, isNew, isTrending, isBestSeller
    ))
    conn.commit()

    # Fetch created product
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)

@app.put("/api/products/{product_id}")
def update_product(product_id: int, product_data: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    existing_dict = row_to_dict(existing)
    merged = {**existing_dict, **product_data, "id": product_id}

    cursor.execute("""
    UPDATE products SET
        name = ?, brand = ?, category = ?, subcategory = ?, sku = ?, price = ?,
        oldPrice = ?, discount = ?, stock = ?, rating = ?, reviews = ?, status = ?,
        supplier = ?, image = ?, images = ?, imageAngles = ?, description = ?,
        features = ?, specifications = ?, colors = ?, sizes = ?, variants = ?,
        colorImages = ?, variantPriceDeltas = ?, variationStock = ?, badge = ?,
        isNew = ?, isTrending = ?, isBestSeller = ?
    WHERE id = ?
    """, (
        merged.get("name"), merged.get("brand"), merged.get("category"), merged.get("subcategory"),
        merged.get("sku"), float(merged.get("price", 0)), float(merged.get("oldPrice", 0)),
        float(merged.get("discount", 0)), int(merged.get("stock", 0)), float(merged.get("rating", 5.0)),
        int(merged.get("reviews", 0)), merged.get("status", "Active"), merged.get("supplier"),
        merged.get("image"), dump_json_field(merged.get("images", [])),
        dump_json_field(merged.get("imageAngles", [])), merged.get("description"),
        dump_json_field(merged.get("features", [])), dump_json_field(merged.get("specifications", {})),
        dump_json_field(merged.get("colors", [])), dump_json_field(merged.get("sizes", [])),
        dump_json_field(merged.get("variants", [])), dump_json_field(merged.get("colorImages", {})),
        dump_json_field(merged.get("variantPriceDeltas", {})), dump_json_field(merged.get("variationStock", {})),
        merged.get("badge"), 1 if merged.get("isNew") else 0, 1 if merged.get("isTrending") else 0,
        1 if merged.get("isBestSeller") else 0, product_id
    ))
    conn.commit()

    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Product {product_id} deleted"}

# -------------------------------------------------------------------
# 2. CATEGORIES & BRANDS
# -------------------------------------------------------------------
@app.get("/api/categories")
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM categories ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [r["name"] for r in rows]

@app.post("/api/categories")
def add_category(payload: Dict[str, str] = Body(...)):
    name = payload.get("name", "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name required")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (name,))
    conn.commit()
    cursor.execute("SELECT name FROM categories ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [r["name"] for r in rows]

@app.delete("/api/categories/{category_name}")
def delete_category(category_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categories WHERE name = ?", (category_name,))
    conn.commit()
    cursor.execute("SELECT name FROM categories ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [r["name"] for r in rows]

@app.get("/api/brands")
def get_brands(category: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if category and category != "All":
        cursor.execute("SELECT name, category FROM brands WHERE category = ? ORDER BY name ASC", (category,))
    else:
        cursor.execute("SELECT name, category FROM brands ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [{"name": r["name"], "category": r["category"]} for r in rows]

@app.post("/api/brands")
def add_brand(payload: Dict[str, str] = Body(...)):
    name = payload.get("name", "").strip()
    cat = payload.get("category", "Watches")
    if not name:
        raise HTTPException(status_code=400, detail="Brand name required")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO brands (name, category) VALUES (?, ?)", (name, cat))
    conn.commit()
    cursor.execute("SELECT name, category FROM brands ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [{"name": r["name"], "category": r["category"]} for r in rows]

@app.delete("/api/brands/{brand_name}")
def delete_brand(brand_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM brands WHERE name = ?", (brand_name,))
    conn.commit()
    cursor.execute("SELECT name, category FROM brands ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    return [{"name": r["name"], "category": r["category"]} for r in rows]

# -------------------------------------------------------------------
# 3. SUBCATEGORIES & VARIANTS
# -------------------------------------------------------------------
@app.get("/api/subcategories")
def get_subcategories(category: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if category and category != "All":
        cursor.execute("SELECT * FROM subcategories WHERE category = ? ORDER BY id DESC", (category,))
    else:
        cursor.execute("SELECT * FROM subcategories ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/subcategories")
def save_subcategory(subcat: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    sub_id = subcat.get("id") or int(time.time() * 1000)
    name = subcat.get("name", "").strip()
    category = subcat.get("category", "Watches")
    code = subcat.get("code") or f"SUB-{str(sub_id)[-4:]}"
    itemCount = int(subcat.get("itemCount", 0))

    cursor.execute("""
    INSERT OR REPLACE INTO subcategories (id, name, category, code, itemCount)
    VALUES (?, ?, ?, ?, ?)
    """, (sub_id, name, category, code, itemCount))
    conn.commit()

    cursor.execute("SELECT * FROM subcategories ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/subcategories/{sub_id}")
def delete_subcategory(sub_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM subcategories WHERE id = ?", (sub_id,))
    conn.commit()
    cursor.execute("SELECT * FROM subcategories ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/variants")
def get_variants():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM variants ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/variants")
def save_variant(variant: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    var_id = variant.get("id") or int(time.time() * 1000)
    productName = variant.get("productName", "")
    sku = variant.get("sku") or f"VAR-{str(var_id)[-4:]}"
    attributeType = variant.get("attributeType", "Size")
    value = variant.get("value", "Standard")
    priceModifier = float(variant.get("priceModifier", 0))
    stock = int(variant.get("stock", 0))
    status_str = variant.get("status", "In Stock")

    cursor.execute("""
    INSERT OR REPLACE INTO variants (id, productName, sku, attributeType, value, priceModifier, stock, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (var_id, productName, sku, attributeType, value, priceModifier, stock, status_str))
    conn.commit()

    cursor.execute("SELECT * FROM variants ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/variants/{var_id}")
def delete_variant(var_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM variants WHERE id = ?", (var_id,))
    conn.commit()
    cursor.execute("SELECT * FROM variants ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# -------------------------------------------------------------------
# 4. ORDERS & RETURNS
# -------------------------------------------------------------------
@app.get("/api/orders")
def get_orders(
    customer_email: Optional[str] = None,
    order_status: Optional[str] = None,
    search: Optional[str] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM orders WHERE 1=1"
    params = []

    if order_status and order_status != "All":
        query += " AND orderStatus = ?"
        params.append(order_status)
    if search:
        query += " AND (id LIKE ? OR customer LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    query += " ORDER BY createdAt DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    orders = [row_to_dict(r) for r in rows]

    if customer_email:
        orders = [
            o for o in orders
            if isinstance(o.get("customer"), dict) and o["customer"].get("email", "").lower() == customer_email.lower()
        ]
    return orders

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Order not found")
    return row_to_dict(row)

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(order_data: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()

    order_id = order_data.get("id") or f"KA-{int(time.time() * 1000) % 1000000:06d}"
    date_str = order_data.get("date") or time.strftime("%d %b %Y, %I:%M %p")
    customer = dump_json_field(order_data.get("customer", {}))
    items = dump_json_field(order_data.get("items", []))
    total = float(order_data.get("total", 0))
    subtotal = float(order_data.get("subtotal", total))
    discount = float(order_data.get("discount", 0))
    shipping = float(order_data.get("shipping", 0))
    paymentMethod = order_data.get("paymentMethod", "UPI / Card")
    paymentStatus = order_data.get("paymentStatus", "Paid")
    orderStatus = order_data.get("orderStatus", "Processing")
    deliveryExpected = order_data.get("deliveryExpected", "3-5 Business Days")
    shippingAddress = dump_json_field(order_data.get("shippingAddress", {}))

    timeline = order_data.get("timeline") or [
        {"status": "Order Placed", "time": date_str, "completed": True},
        {"status": "Processing", "time": date_str, "completed": True},
        {"status": "Shipped", "time": "Pending", "completed": False},
        {"status": "Delivered", "time": "Pending", "completed": False}
    ]

    cursor.execute("""
    INSERT INTO orders (
        id, date, customer, items, total, subtotal, discount, shipping,
        paymentMethod, paymentStatus, orderStatus, deliveryExpected,
        shippingAddress, timeline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_id, date_str, customer, items, total, subtotal, discount, shipping,
        paymentMethod, paymentStatus, orderStatus, deliveryExpected,
        shippingAddress, dump_json_field(timeline)
    ))

    # Add notification for admin
    cursor.execute("""
    INSERT INTO notifications (id, title, message, time, type, read)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        int(time.time() * 1000),
        "New Order Received",
        f"Order #{order_id} placed for ₹{total:,.0f}",
        "Just now",
        "order",
        0
    ))

    conn.commit()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: str, payload: Dict[str, Any] = Body(...)):
    new_status = payload.get("status")
    note = payload.get("note", "")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")

    order = row_to_dict(row)
    timeline = order.get("timeline", []) or []

    # Update timeline
    timeline.append({
        "status": f"Status updated to {new_status}",
        "time": time.strftime("%d %b %Y, %I:%M %p"),
        "note": note,
        "completed": True
    })

    cursor.execute("""
    UPDATE orders SET orderStatus = ?, timeline = ? WHERE id = ?
    """, (new_status, dump_json_field(timeline), order_id))
    conn.commit()

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    updated = cursor.fetchone()
    conn.close()
    return row_to_dict(updated)

@app.post("/api/orders/{order_id}/cancel")
def cancel_order(order_id: str, payload: Dict[str, Any] = Body(...)):
    reason = payload.get("reason", "Cancelled by customer")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")

    order = row_to_dict(row)
    timeline = order.get("timeline", []) or []
    timeline.append({
        "status": "Order Cancelled",
        "time": time.strftime("%d %b %Y, %I:%M %p"),
        "note": reason,
        "completed": True
    })

    cursor.execute("""
    UPDATE orders SET orderStatus = 'Cancelled', timeline = ? WHERE id = ?
    """, (dump_json_field(timeline), order_id))
    conn.commit()

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    updated = cursor.fetchone()
    conn.close()
    return row_to_dict(updated)

@app.post("/api/orders/{order_id}/return")
def process_return(order_id: str, payload: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")

    returnDetails = dump_json_field(payload.get("returnDetails", {}))
    returnStatus = payload.get("returnStatus", "Return Requested")

    cursor.execute("""
    UPDATE orders SET returnDetails = ?, returnStatus = ? WHERE id = ?
    """, (returnDetails, returnStatus, order_id))
    conn.commit()

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    updated = cursor.fetchone()
    conn.close()
    return row_to_dict(updated)

# -------------------------------------------------------------------
# 5. SUPPLIERS
# -------------------------------------------------------------------
@app.get("/api/suppliers")
def get_suppliers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM suppliers ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/suppliers")
def add_supplier(supplier: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    sup_id = supplier.get("id") or int(time.time() * 1000)
    name = supplier.get("name", "")
    email = supplier.get("email", "")
    phone = supplier.get("phone", "")
    category = supplier.get("category", "General")
    status_str = supplier.get("status", "Pending Approval")
    joinedDate = supplier.get("joinedDate", time.strftime("%d %b %Y"))
    rating = float(supplier.get("rating", 5.0))
    productsCount = int(supplier.get("productsCount", 0))
    totalEarnings = float(supplier.get("totalEarnings", 0))
    address = supplier.get("address", "")

    cursor.execute("""
    INSERT OR REPLACE INTO suppliers (id, name, email, phone, category, status, joinedDate, rating, productsCount, totalEarnings, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (sup_id, name, email, phone, category, status_str, joinedDate, rating, productsCount, totalEarnings, address))
    conn.commit()

    cursor.execute("SELECT * FROM suppliers ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.put("/api/suppliers/{sup_id}")
def update_supplier(sup_id: int, payload: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM suppliers WHERE id = ?", (sup_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Supplier not found")

    merged = {**dict(existing), **payload}
    cursor.execute("""
    UPDATE suppliers SET
        name = ?, email = ?, phone = ?, category = ?, status = ?,
        rating = ?, productsCount = ?, totalEarnings = ?, address = ?
    WHERE id = ?
    """, (
        merged.get("name"), merged.get("email"), merged.get("phone"),
        merged.get("category"), merged.get("status"), float(merged.get("rating", 5.0)),
        int(merged.get("productsCount", 0)), float(merged.get("totalEarnings", 0)),
        merged.get("address"), sup_id
    ))
    conn.commit()

    cursor.execute("SELECT * FROM suppliers WHERE id = ?", (sup_id,))
    updated = cursor.fetchone()
    conn.close()
    return dict(updated)

@app.delete("/api/suppliers/{sup_id}")
def delete_supplier(sup_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM suppliers WHERE id = ?", (sup_id,))
    conn.commit()
    conn.close()
    return {"success": True}

# -------------------------------------------------------------------
# 6. USERS & AUTHENTICATION
# -------------------------------------------------------------------
@app.get("/api/users")
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, phone, role, status, ordersCount, totalSpent, joinedDate, addresses FROM users ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.post("/api/users")
def create_user(user_data: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    user_id = user_data.get("id") or int(time.time() * 1000)
    name = user_data.get("name", "").strip()
    email = user_data.get("email", "").strip().lower()
    phone = user_data.get("phone", "").strip()
    role = user_data.get("role", "Customer")
    status_str = user_data.get("status", "Active")
    joinedDate = user_data.get("joinedDate", time.strftime("%d %b %Y"))
    addresses = dump_json_field(user_data.get("addresses", []))
    password = user_data.get("password", "")

    # Check if a user with this email already exists
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
    existing_row = cursor.fetchone()

    if existing_row:
        existing_id = existing_row["id"] if isinstance(existing_row, dict) else existing_row[0]
        cursor.execute("""
        UPDATE users SET
            name = ?, phone = ?, role = ?, status = ?, addresses = ?,
            password = COALESCE(?, password)
        WHERE id = ?
        """, (name, phone, role, status_str, addresses, hash_password(password) if password else None, existing_id))
        conn.commit()
        user_id = existing_id
    else:
        cursor.execute("""
        INSERT INTO users (id, name, email, phone, role, status, joinedDate, addresses, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, email, phone, role, status_str, joinedDate, addresses, hash_password(password) if password else None))
        conn.commit()

    cursor.execute("SELECT id, name, email, phone, role, status, ordersCount, totalSpent, joinedDate, addresses FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)

@app.put("/api/users/{user_id}")
def update_user(user_id: int, payload: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    merged = {**row_to_dict(existing), **payload}
    cursor.execute("""
    UPDATE users SET
        name = ?, phone = ?, role = ?, status = ?, addresses = ?
    WHERE id = ?
    """, (
        merged.get("name"), merged.get("phone"), merged.get("role"),
        merged.get("status"), dump_json_field(merged.get("addresses", [])),
        user_id
    ))
    conn.commit()

    cursor.execute("SELECT id, name, email, phone, role, status, ordersCount, totalSpent, joinedDate, addresses FROM users WHERE id = ?", (user_id,))
    updated = cursor.fetchone()
    conn.close()
    return row_to_dict(updated)

@app.post("/api/auth/login")
def login(credentials: Dict[str, str] = Body(...)):
    email = credentials.get("email", "").strip().lower()
    password = credentials.get("password", "")
    role = credentials.get("role", "customer").lower()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = row_to_dict(row)
    if user.get("status") != "Active":
        raise HTTPException(status_code=403, detail="This account is not active")
    if not user.get("password") or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user.pop("password", None)
    return {"success": True, "token": create_session_token(user), "user": user}

# -------------------------------------------------------------------
# 7. PROMOTIONS & COUPONS
# -------------------------------------------------------------------
@app.get("/api/promotions")
def get_promotions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM promotions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/promotions")
def save_promotion(promo: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    promo_id = promo.get("id") or int(time.time() * 1000)
    code = promo.get("code", "").upper()
    ptype = promo.get("type", "Percentage")
    value = float(promo.get("value", 0))
    minOrder = float(promo.get("minOrder", 0))
    maxDiscount = float(promo.get("maxDiscount", 0)) if promo.get("maxDiscount") else None
    validUntil = promo.get("validUntil", "2026-12-31")
    status_str = promo.get("status", "Active")
    usageCount = int(promo.get("usageCount", 0))
    applicableCategory = promo.get("applicableCategory", "All")

    cursor.execute("""
    INSERT OR REPLACE INTO promotions (id, code, type, value, minOrder, maxDiscount, validUntil, status, usageCount, applicableCategory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (promo_id, code, ptype, value, minOrder, maxDiscount, validUntil, status_str, usageCount, applicableCategory))
    conn.commit()

    cursor.execute("SELECT * FROM promotions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/promotions/{promo_id}")
def delete_promotion(promo_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM promotions WHERE id = ?", (promo_id,))
    conn.commit()
    cursor.execute("SELECT * FROM promotions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/coupons/validate")
def validate_coupon(payload: Dict[str, Any] = Body(...)):
    code = payload.get("code", "").strip().upper()
    subtotal = float(payload.get("subtotal", 0))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM promotions WHERE UPPER(code) = ? AND status = 'Active'", (code,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"valid": False, "message": "Invalid or expired coupon code."}

    promo = dict(row)
    if subtotal < promo["minOrder"]:
        return {
            "valid": False,
            "message": f"Minimum order value of ₹{promo['minOrder']:,.0f} required for coupon {code}."
        }

    discount_amount = (subtotal * promo["value"] / 100) if promo["type"] == "Percentage" else promo["value"]
    if promo["maxDiscount"] and discount_amount > promo["maxDiscount"]:
        discount_amount = promo["maxDiscount"]

    return {
        "valid": True,
        "discount": round(discount_amount, 2),
        "coupon": promo,
        "message": f"Coupon {code} applied successfully!"
    }

# -------------------------------------------------------------------
# 8. MEDIA ASSETS
# -------------------------------------------------------------------
@app.get("/api/media")
def get_media():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM media_assets ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/media")
def add_media(asset: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    m_id = asset.get("id") or int(time.time() * 1000)
    name = asset.get("name", "Asset")
    category = asset.get("category", "General")
    url = asset.get("url", "")
    size = asset.get("size", "1 MB")
    dimensions = asset.get("dimensions", "1000x1000")
    uploadedDate = asset.get("uploadedDate", time.strftime("%d %b %Y"))

    cursor.execute("""
    INSERT OR REPLACE INTO media_assets (id, name, category, url, size, dimensions, uploadedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (m_id, name, category, url, size, dimensions, uploadedDate))
    conn.commit()

    cursor.execute("SELECT * FROM media_assets ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/media/{media_id}")
def delete_media(media_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM media_assets WHERE id = ?", (media_id,))
    conn.commit()
    cursor.execute("SELECT * FROM media_assets ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# -------------------------------------------------------------------
# 9. ROLES & PERMISSIONS
# -------------------------------------------------------------------
@app.get("/api/roles")
def get_roles():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM roles ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/roles")
def save_role(role_data: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    r_id = role_data.get("id") or int(time.time() * 1000)
    name = role_data.get("name", "")
    description = role_data.get("description", "")
    usersCount = int(role_data.get("usersCount", 0))
    color = role_data.get("color", "indigo")

    cursor.execute("""
    INSERT OR REPLACE INTO roles (id, name, description, usersCount, color)
    VALUES (?, ?, ?, ?, ?)
    """, (r_id, name, description, usersCount, color))
    conn.commit()

    cursor.execute("SELECT * FROM roles ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/permissions")
def get_permissions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT matrix FROM permissions WHERE key = 'matrix'")
    row = cursor.fetchone()
    conn.close()
    return parse_json_field(row["matrix"]) if row else {}

@app.put("/api/permissions")
def update_permissions(payload: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO permissions (key, matrix) VALUES ('matrix', ?)", (dump_json_field(payload),))
    conn.commit()
    conn.close()
    return payload

# -------------------------------------------------------------------
# 10. SHIPPING CARRIERS
# -------------------------------------------------------------------
@app.get("/api/shipping-carriers")
def get_shipping_carriers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shipping_carriers ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.put("/api/shipping-carriers/{carrier_id}")
def update_shipping_carrier(carrier_id: int, payload: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shipping_carriers WHERE id = ?", (carrier_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Carrier not found")

    merged = {**dict(existing), **payload}
    cursor.execute("""
    UPDATE shipping_carriers SET
        name = ?, code = ?, serviceType = ?, status = ?, avgDays = ?, ratePerKg = ?, apiConnected = ?
    WHERE id = ?
    """, (
        merged.get("name"), merged.get("code"), merged.get("serviceType"),
        merged.get("status"), merged.get("avgDays"), float(merged.get("ratePerKg", 0)),
        1 if merged.get("apiConnected") else 0, carrier_id
    ))
    conn.commit()

    cursor.execute("SELECT * FROM shipping_carriers ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# -------------------------------------------------------------------
# 11. SYSTEM CONFIGURATION
# -------------------------------------------------------------------
@app.get("/api/system-config")
def get_system_config():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM system_config WHERE key = 'settings'")
    row = cursor.fetchone()
    conn.close()
    return parse_json_field(row["data"]) if row else {}

@app.post("/api/system-config")
def save_system_config(config_data: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO system_config (key, data) VALUES ('settings', ?)", (dump_json_field(config_data),))
    conn.commit()
    conn.close()
    return config_data

# -------------------------------------------------------------------
# 12. NOTIFICATIONS
# -------------------------------------------------------------------
@app.get("/api/notifications")
def get_notifications():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notifications ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/notifications")
def add_notification(notif: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    n_id = notif.get("id") or int(time.time() * 1000)
    title = notif.get("title", "Notification")
    message = notif.get("message", "")
    time_str = notif.get("time", "Just now")
    ntype = notif.get("type", "info")
    read = 1 if notif.get("read") else 0

    cursor.execute("""
    INSERT INTO notifications (id, title, message, time, type, read)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (n_id, title, message, time_str, ntype, read))
    conn.commit()

    cursor.execute("SELECT * FROM notifications ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.put("/api/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE notifications SET read = 1 WHERE id = ?", (notif_id,))
    conn.commit()
    cursor.execute("SELECT * FROM notifications ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.put("/api/notifications/read-all")
def mark_all_notifications_read():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE notifications SET read = 1")
    conn.commit()
    cursor.execute("SELECT * FROM notifications ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/notifications")
def clear_notifications():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notifications")
    conn.commit()
    conn.close()
    return []

# -------------------------------------------------------------------
# 13. REVIEWS & RATINGS
# -------------------------------------------------------------------
@app.get("/api/reviews/{product_id}")
def get_reviews(product_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reviews WHERE productId = ? ORDER BY id DESC", (product_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/reviews")
def add_review(rev: Dict[str, Any] = Body(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    productId = int(rev.get("productId", 0))
    userName = rev.get("userName", "Customer")
    rating = float(rev.get("rating", 5.0))
    comment = rev.get("comment", "")
    date_str = rev.get("date", time.strftime("%d %b %Y"))

    cursor.execute("""
    INSERT INTO reviews (productId, userName, rating, comment, date)
    VALUES (?, ?, ?, ?, ?)
    """, (productId, userName, rating, comment, date_str))

    # Update product rating average & count
    cursor.execute("SELECT AVG(rating), COUNT(*) FROM reviews WHERE productId = ?", (productId,))
    avg_r, count_r = cursor.fetchone()
    if avg_r:
        cursor.execute("UPDATE products SET rating = ?, reviews = ? WHERE id = ?", (round(avg_r, 1), count_r, productId))

    conn.commit()
    cursor.execute("SELECT * FROM reviews WHERE productId = ? ORDER BY id DESC", (productId,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# -------------------------------------------------------------------
# 14. CUSTOMER DATA & EMAIL AUTH FLOWS
# -------------------------------------------------------------------
def user_id_from_auth(authorization: Optional[str]) -> int:
    return get_authenticated_user(authorization)["id"]

@app.get("/api/cart")
def get_cart(authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    rows = conn.execute("SELECT itemData, quantity FROM cart_items WHERE userId = ? ORDER BY id", (user_id,)).fetchall()
    conn.close()
    result = []
    for row in rows:
        item = parse_json_field(row["itemData"])
        item["quantity"] = row["quantity"]
        result.append(item)
    return result

@app.post("/api/cart")
def save_cart(payload: Dict[str, Any] = Body(...), authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    items = payload.get("items", [])
    conn = get_db_connection()
    conn.execute("DELETE FROM cart_items WHERE userId = ?", (user_id,))
    for item in items:
        item_copy = {**item, "quantity": max(1, int(item.get("quantity", 1)))}
        conn.execute("INSERT INTO cart_items (userId, productId, itemData, quantity) VALUES (?, ?, ?, ?)", (user_id, int(item_copy.get("id", 0)), dump_json_field(item_copy), item_copy["quantity"]))
    conn.commit()
    conn.close()
    return items

@app.delete("/api/cart")
def clear_cart_backend(authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    conn.execute("DELETE FROM cart_items WHERE userId = ?", (user_id,))
    conn.commit()
    conn.close()
    return []

@app.get("/api/wishlist")
def get_wishlist(authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    rows = conn.execute("SELECT itemData FROM wishlist_items WHERE userId = ? ORDER BY productId DESC", (user_id,)).fetchall()
    conn.close()
    return [parse_json_field(row["itemData"]) for row in rows]

@app.post("/api/wishlist")
def save_wishlist(payload: Dict[str, Any] = Body(...), authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    items = payload.get("items", [])
    conn = get_db_connection()
    conn.execute("DELETE FROM wishlist_items WHERE userId = ?", (user_id,))
    for item in items:
        conn.execute("INSERT OR REPLACE INTO wishlist_items (userId, productId, itemData) VALUES (?, ?, ?)", (user_id, int(item.get("id", 0)), dump_json_field(item)))
    conn.commit()
    conn.close()
    return items

@app.delete("/api/wishlist")
def clear_wishlist_backend(authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    conn.execute("DELETE FROM wishlist_items WHERE userId = ?", (user_id,))
    conn.commit()
    conn.close()
    return []

@app.get("/api/addresses")
def get_addresses(authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    rows = conn.execute("SELECT id, address, isDefault FROM user_addresses WHERE userId = ? ORDER BY isDefault DESC, id DESC", (user_id,)).fetchall()
    conn.close()
    return [{**parse_json_field(row["address"]), "id": row["id"], "isDefault": bool(row["isDefault"])} for row in rows]

@app.post("/api/addresses")
def save_address(address: Dict[str, Any] = Body(...), authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    if address.get("isDefault"):
        conn.execute("UPDATE user_addresses SET isDefault = 0 WHERE userId = ?", (user_id,))
    if address.get("id"):
        conn.execute("UPDATE user_addresses SET address = ?, isDefault = ? WHERE id = ? AND userId = ?", (dump_json_field(address), int(bool(address.get("isDefault"))), int(address["id"]), user_id))
    else:
        conn.execute("INSERT INTO user_addresses (userId, address, isDefault) VALUES (?, ?, ?)", (user_id, dump_json_field(address), int(bool(address.get("isDefault")))))
    conn.commit()
    conn.close()
    return get_addresses(authorization)

@app.delete("/api/addresses/{address_id}")
def delete_address(address_id: int, authorization: Optional[str] = Header(default=None)):
    user_id = user_id_from_auth(authorization)
    conn = get_db_connection()
    conn.execute("DELETE FROM user_addresses WHERE id = ? AND userId = ?", (address_id, user_id))
    conn.commit()
    conn.close()
    return get_addresses(authorization)

@app.post("/api/auth/otp/send")
def send_otp(payload: Dict[str, str] = Body(...)):
    email = payload.get("email", "").strip().lower()
    otp_type = payload.get("type", "forgot_password")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    code = f"{secrets.randbelow(900000) + 100000}"
    conn = get_db_connection()
    conn.execute("INSERT OR REPLACE INTO otp_codes (email, type, code, expiresAt, attempts) VALUES (?, ?, ?, ?, 0)", (email, otp_type, code, int(time.time()) + 300))
    conn.commit()
    conn.close()
    return {"success": True, "email": email, "type": otp_type, "otpCode": code, "expiresIn": 300}

@app.post("/api/auth/otp/verify")
def verify_otp(payload: Dict[str, str] = Body(...)):
    email = payload.get("email", "").strip().lower()
    otp_type = payload.get("type", "forgot_password")
    code = payload.get("code", "")
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM otp_codes WHERE email = ? AND type = ?", (email, otp_type)).fetchone()
    if not row or int(row["expiresAt"]) < int(time.time()) or not hmac.compare_digest(str(row["code"]), str(code)):
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    conn.execute("DELETE FROM otp_codes WHERE email = ? AND type = ?", (email, otp_type))
    user = None
    if otp_type == "login_otp":
        user_row = conn.execute("SELECT * FROM users WHERE LOWER(email) = ? AND status = 'Active'", (email,)).fetchone()
        if user_row:
            user = row_to_dict(user_row)
            user.pop("password", None)
    conn.commit()
    conn.close()
    response = {"success": True, "verified": True}
    if user:
        response.update({"token": create_session_token(user), "user": user})
    return response

@app.post("/api/auth/password/reset")
def reset_password(payload: Dict[str, str] = Body(...)):
    email = payload.get("email", "").strip().lower()
    new_password = payload.get("password", "")
    if len(new_password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")
    conn = get_db_connection()
    updated = conn.execute("UPDATE users SET password = ? WHERE LOWER(email) = ?", (hash_password(new_password), email)).rowcount
    conn.commit()
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}

@app.post("/api/email/log")
def log_email(payload: Dict[str, Any] = Body(...)):
    email_id = payload.get("id") or f"EML-{int(time.time() * 1000)}"
    conn = get_db_connection()
    conn.execute("INSERT OR REPLACE INTO email_logs (id, recipient, subject, type, body, otpCode, status) VALUES (?, ?, ?, ?, ?, ?, ?)", (email_id, payload.get("to", ""), payload.get("subject", ""), payload.get("type", "notification"), payload.get("textBody", ""), payload.get("otpCode", ""), payload.get("status", "Delivered")))
    conn.commit()
    conn.close()
    return {"success": True, "emailId": email_id}

# -------------------------------------------------------------------
# 14. ADMIN ANALYTICS & STATS
# -------------------------------------------------------------------
@app.get("/api/admin/analytics")
def get_admin_analytics():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Product metrics
    cursor.execute("SELECT COUNT(*) FROM products")
    total_products = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM products WHERE stock < 5")
    low_stock = cursor.fetchone()[0]

    # Order metrics and report dimensions are calculated from persisted order lines.
    cursor.execute("SELECT * FROM orders ORDER BY createdAt DESC")
    order_rows = [row_to_dict(row) for row in cursor.fetchall()]
    valid_orders = [o for o in order_rows if o.get("orderStatus") not in ("Cancelled", "Refunded")]
    total_orders = len(valid_orders)
    total_revenue = sum(float(o.get("total") or 0) for o in valid_orders)

    daily_sales = defaultdict(lambda: {"orders": 0, "revenue": 0})
    monthly_sales = defaultdict(lambda: {"orders": 0, "revenue": 0})
    product_sales = defaultdict(lambda: {"product": "", "category": "", "units": 0, "revenue": 0})
    supplier_sales = defaultdict(lambda: {"supplier": "", "orders": 0, "revenue": 0})
    customer_orders = defaultdict(int)

    for order in valid_orders:
        order_date = order.get("date") or order.get("createdAt") or "Unknown"
        try:
            parsed_date = datetime.strptime(str(order_date)[:11], "%d %b %Y")
            day_key = parsed_date.strftime("%d %b")
            month_key = parsed_date.strftime("%b %Y")
        except ValueError:
            day_key = str(order_date)[:10]
            month_key = str(order_date)[-4:] if str(order_date)[-4:].isdigit() else "Unknown"
        daily_sales[day_key]["orders"] += 1
        daily_sales[day_key]["revenue"] += float(order.get("total") or 0)
        monthly_sales[month_key]["orders"] += 1
        monthly_sales[month_key]["revenue"] += float(order.get("total") or 0)

        customer = parse_json_field(order.get("customer")) or {}
        customer_name = customer.get("name") or " ".join(filter(None, [customer.get("firstName"), customer.get("lastName")])) or "Guest"
        customer_orders[customer_name] += 1
        for item in parse_json_field(order.get("items")) or []:
            product_name = item.get("name") or "Unknown product"
            product = product_sales[product_name]
            product["product"] = product_name
            product["category"] = item.get("category") or "Uncategorised"
            product["units"] += int(item.get("quantity") or 1)
            product["revenue"] += float(item.get("price") or 0) * int(item.get("quantity") or 1)
            supplier_name = item.get("supplier") or "Unassigned"
            supplier = supplier_sales[supplier_name]
            supplier["supplier"] = supplier_name
            supplier["orders"] += 1
            supplier["revenue"] += float(item.get("price") or 0) * int(item.get("quantity") or 1)

    cursor.execute("SELECT COUNT(*) FROM orders WHERE orderStatus = 'Processing'")
    pending_orders = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM orders WHERE orderStatus = 'Delivered'")
    delivered_orders = cursor.fetchone()[0]

    # User metrics
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    # Supplier metrics
    cursor.execute("SELECT COUNT(*) FROM suppliers")
    total_suppliers = cursor.fetchone()[0]

    recent_orders = order_rows[:5]

    conn.close()

    return {
        "totalRevenue": total_revenue,
        "totalOrders": total_orders,
        "totalProducts": total_products,
        "totalUsers": total_users,
        "totalSuppliers": total_suppliers,
        "pendingOrders": pending_orders,
        "deliveredOrders": delivered_orders,
        "lowStockCount": low_stock,
        "recentOrders": recent_orders,
        "dailySales": [{"date": key, **value} for key, value in sorted(daily_sales.items())],
        "monthlySales": [{"month": key, **value} for key, value in sorted(monthly_sales.items())],
        "productPerformance": sorted(product_sales.values(), key=lambda item: item["revenue"], reverse=True),
        "supplierPerformance": sorted(supplier_sales.values(), key=lambda item: item["revenue"], reverse=True),
        "repeatCustomers": sum(1 for count in customer_orders.values() if count > 1),
        "uniqueCustomers": len(customer_orders)
    }

# -------------------------------------------------------------------
# 15. BACKUP & RESTORE
# -------------------------------------------------------------------
@app.get("/api/system/backup")
def export_backup():
    conn = get_db_connection()
    cursor = conn.cursor()
    tables = ["products", "categories", "brands", "subcategories", "variants", "orders", "users", "suppliers", "promotions", "media_assets", "roles", "shipping_carriers"]
    backup = {}
    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        backup[table] = [row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return backup

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
