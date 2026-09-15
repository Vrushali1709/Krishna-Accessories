# backend/seed_data.py
import json
import os
from database import get_db_connection, dump_json_field

DEFAULT_CATEGORIES = [
    "Watches", "Bags & Wallets", "Shoes", "Mobiles", "Clothes & Fashion",
    "Laptops", "Electronics", "Smart Gadgets", "Gaming", "Fitness", "Fashion Accessories"
]

DEFAULT_BRANDS = [
    # Watches
    ("Titan", "Watches"), ("Fossil", "Watches"), ("Casio", "Watches"), ("Rolex", "Watches"),
    ("Fastrack", "Watches"), ("Timex", "Watches"), ("Omega", "Watches"), ("Tissot", "Watches"),
    ("Rado", "Watches"), ("Seiko", "Watches"),
    # Bags & Wallets
    ("Wildcraft", "Bags & Wallets"), ("American Tourister", "Bags & Wallets"),
    ("Samsonite", "Bags & Wallets"), ("Tommy Hilfiger", "Bags & Wallets"),
    ("Lavie", "Bags & Wallets"), ("Hidesign", "Bags & Wallets"),
    # Shoes
    ("Nike", "Shoes"), ("Adidas", "Shoes"), ("Puma", "Shoes"),
    ("Reebok", "Shoes"), ("Jordan", "Shoes"), ("Woodland", "Shoes"), ("Asics", "Shoes"),
    # Mobiles
    ("Apple", "Mobiles"), ("Samsung", "Mobiles"), ("OnePlus", "Mobiles"),
    ("Google Pixel", "Mobiles"), ("Xiaomi", "Mobiles"), ("Vivo", "Mobiles"),
    # Clothes & Fashion
    ("Levis", "Clothes & Fashion"), ("Zara", "Clothes & Fashion"),
    ("Tommy Hilfiger", "Clothes & Fashion"), ("Calvin Klein", "Clothes & Fashion"),
    ("Allen Solly", "Clothes & Fashion"), ("Van Heusen", "Clothes & Fashion"),
    # Laptops
    ("Dell", "Laptops"), ("HP", "Laptops"), ("Apple", "Laptops"),
    ("Asus", "Laptops"), ("Lenovo", "Laptops"), ("Acer", "Laptops"),
    # Electronics
    ("Sony", "Electronics"), ("Bose", "Electronics"), ("JBL", "Electronics"),
    ("Samsung", "Electronics"), ("boAt", "Electronics"), ("Marshall", "Electronics"),
    # Smart Gadgets
    ("Apple", "Smart Gadgets"), ("Samsung", "Smart Gadgets"), ("Noise", "Smart Gadgets"),
    # Gaming
    ("Razer", "Gaming"), ("Logitech", "Gaming"), ("Corsair", "Gaming"),
    # Fitness
    ("Garmin", "Fitness"), ("Fitbit", "Fitness"),
    # Fashion Accessories
    ("Ray-Ban", "Fashion Accessories"), ("Police", "Fashion Accessories")
]

DEFAULT_PROMOTIONS = [
    {"id": 1, "code": "KRISHNA10", "type": "Percentage", "value": 10, "minOrder": 1999, "maxDiscount": 500, "validUntil": "2026-12-31", "status": "Active", "usageCount": 142, "applicableCategory": "All"},
    {"id": 2, "code": "FESTIVE20", "type": "Percentage", "value": 20, "minOrder": 4999, "maxDiscount": 2000, "validUntil": "2026-11-15", "status": "Active", "usageCount": 89, "applicableCategory": "Watches"},
    {"id": 3, "code": "WELCOME500", "type": "Fixed", "value": 500, "minOrder": 2999, "maxDiscount": 500, "validUntil": "2026-10-30", "status": "Active", "usageCount": 210, "applicableCategory": "All"}
]

DEFAULT_MEDIA = [
    {"id": 1, "name": "Hero Banner Watches 2026", "category": "Banners", "url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600", "size": "1.2 MB", "dimensions": "1920x800", "uploadedDate": "10 Sep 2026"},
    {"id": 2, "name": "Titan Grandmaster Showcase", "category": "Product Photos", "url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000", "size": "840 KB", "dimensions": "1200x1200", "uploadedDate": "12 Sep 2026"},
    {"id": 3, "name": "Festival Promo Badge", "category": "Icons & Badges", "url": "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600", "size": "210 KB", "dimensions": "600x600", "uploadedDate": "14 Sep 2026"}
]

DEFAULT_ROLES = [
    {"id": 1, "name": "Super Admin", "description": "Full access to all system modules, finances, user roles and database backup.", "usersCount": 2, "color": "purple"},
    {"id": 2, "name": "Catalog Manager", "description": "Can manage products, categories, subcategories, variants and inventory stock.", "usersCount": 4, "color": "blue"},
    {"id": 3, "name": "Order Specialist", "description": "Can review, ship, track and process customer orders, returns and refunds.", "usersCount": 5, "color": "emerald"},
    {"id": 4, "name": "Support Representative", "description": "Can view customer profiles, order history and reply to support inquiries.", "usersCount": 6, "color": "amber"}
]

DEFAULT_PERMISSIONS_MATRIX = {
    "super_admin": {"products_view": True, "products_edit": True, "orders_view": True, "orders_edit": True, "users_manage": True, "system_settings": True, "finance_view": True},
    "catalog_manager": {"products_view": True, "products_edit": True, "orders_view": True, "orders_edit": False, "users_manage": False, "system_settings": False, "finance_view": False},
    "order_specialist": {"products_view": True, "products_edit": False, "orders_view": True, "orders_edit": True, "users_manage": False, "system_settings": False, "finance_view": False},
    "support_rep": {"products_view": True, "products_edit": False, "orders_view": True, "orders_edit": False, "users_manage": False, "system_settings": False, "finance_view": False}
}

DEFAULT_SHIPPING = [
    {"id": 1, "name": "BlueDart Express", "code": "BD-EXP", "serviceType": "Air Express (Next Day)", "status": "Active", "avgDays": "1-2 Days", "ratePerKg": 120, "apiConnected": 1},
    {"id": 2, "name": "Delhivery Surface", "code": "DL-SUR", "serviceType": "Surface Standard", "status": "Active", "avgDays": "3-5 Days", "ratePerKg": 65, "apiConnected": 1},
    {"id": 3, "name": "DTDC Prime", "code": "DT-PRM", "serviceType": "Priority Cargo", "status": "Active", "avgDays": "2-3 Days", "ratePerKg": 85, "apiConnected": 1}
]

DEFAULT_SYSTEM_CONFIG = {
    "storeName": "Krishna Accessories",
    "supportEmail": "support@krishnaaccessories.com",
    "supportPhone": "+91 98765 43210",
    "currency": "INR",
    "currencySymbol": "₹",
    "taxRate": 18,
    "freeShippingThreshold": 999,
    "defaultShippingFee": 99,
    "maintenanceMode": False,
    "enableGuestCheckout": True,
    "emailNotifications": True,
    "smsOrderAlerts": True,
    "autoApproveSuppliers": False,
    "lowStockAlertThreshold": 5,
    "allowCustomerReturns": True,
    "returnWindowDays": 7
}

DEFAULT_NOTIFICATIONS = [
    {"id": 1, "title": "New Order Placed", "message": "Order #KA-98421 placed by Rahul Patel (₹4,999)", "time": "10 mins ago", "type": "order", "read": 0},
    {"id": 2, "title": "Low Stock Warning", "message": "Rolex Submariner Date 41mm has only 3 units left in stock.", "time": "1 hour ago", "type": "inventory", "read": 0},
    {"id": 3, "title": "New Supplier Application", "message": "Vogue Apparel India submitted vendor registration.", "time": "3 hours ago", "type": "supplier", "read": 0}
]

def seed_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Load from all_seed_data.json if present
    fixtures_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "all_seed_data.json")
    all_data = {}
    if os.path.exists(fixtures_path):
        with open(fixtures_path, "r", encoding="utf-8") as f:
            all_data = json.load(f)

    # 1. Categories
    for cat in DEFAULT_CATEGORIES:
        cursor.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (cat,))

    # 2. Brands
    for brand, cat in DEFAULT_BRANDS:
        cursor.execute("INSERT OR IGNORE INTO brands (name, category) VALUES (?, ?)", (brand, cat))

    # 3. Subcategories
    subcategories = all_data.get("subcategories", [])
    for sub in subcategories:
        cursor.execute("""
        INSERT OR REPLACE INTO subcategories (id, name, category, code, itemCount)
        VALUES (?, ?, ?, ?, ?)
        """, (sub["id"], sub["name"], sub["category"], sub.get("code"), sub.get("itemCount", 0)))

    # 4. Variants
    variants = all_data.get("variants", [])
    for var in variants:
        cursor.execute("""
        INSERT OR REPLACE INTO variants (id, productName, sku, attributeType, value, priceModifier, stock, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (var["id"], var["productName"], var.get("sku"), var.get("attributeType"), var.get("value"), var.get("priceModifier", 0), var.get("stock", 0), var.get("status", "In Stock")))

    # 5. Products (Populate all products)
    products = all_data.get("products", [])
    for p in products:
        cursor.execute("""
        INSERT OR REPLACE INTO products (
            id, name, brand, category, subcategory, sku, price, oldPrice, discount,
            stock, rating, reviews, status, supplier, image, images, imageAngles, description,
            specifications, colors, sizes, variants, colorImages, variantPriceDeltas,
            variationStock, badge, isNew, isTrending, isBestSeller
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["id"], p.get("name", "Product"), p.get("brand"), p.get("category"), p.get("subcategory"),
            p.get("sku"), p.get("price", 0), p.get("oldPrice"), p.get("discount", 0),
            p.get("stock", 15), p.get("rating", 5.0), p.get("reviews", 0),
            p.get("status", "Active"), p.get("supplier"), p.get("image"),
            dump_json_field(p.get("images", [p.get("image")] if p.get("image") else [])),
            dump_json_field(p.get("imageAngles", [])),
            p.get("description"),
            dump_json_field(p.get("specifications", {})),
            dump_json_field(p.get("colors", [])),
            dump_json_field(p.get("sizes", [])),
            dump_json_field(p.get("variants", [])),
            dump_json_field(p.get("colorImages", {})),
            dump_json_field(p.get("variantPriceDeltas", {})),
            dump_json_field(p.get("variationStock", {})),
            p.get("badge", ""),
            1 if p.get("isNew") else 0,
            1 if p.get("isTrending") else 0,
            1 if p.get("isBestSeller") else 0
        ))

    # 6. Suppliers
    suppliers = all_data.get("suppliers", [])
    for s in suppliers:
        cursor.execute("""
        INSERT OR REPLACE INTO suppliers (id, name, email, phone, category, status, joinedDate, rating, productsCount, totalEarnings, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (s["id"], s["name"], s["email"], s["phone"], s["category"], s["status"], s["joinedDate"], s.get("rating", 5.0), s.get("productsCount", 0), s.get("totalEarnings", 0), s.get("address", "")))

    # 7. Users
    users = all_data.get("users", [])
    for u in users:
        cursor.execute("""
        INSERT OR REPLACE INTO users (id, name, email, phone, role, status, ordersCount, totalSpent, joinedDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u["id"], u["name"], u["email"], u["phone"], u["role"], u["status"], u.get("ordersCount", 0), u.get("totalSpent", 0), u.get("joinedDate", "")))

    # 8. Orders
    orders = all_data.get("orders", [])
    for o in orders:
        cursor.execute("""
        INSERT OR REPLACE INTO orders (id, date, customer, items, total, subtotal, discount, shipping, paymentMethod, paymentStatus, orderStatus, deliveryExpected, timeline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            o["id"], o["date"], dump_json_field(o.get("customer", {})), dump_json_field(o.get("items", [])),
            o.get("total", 0), o.get("subtotal", o.get("total", 0)), o.get("discount", 0), o.get("shipping", 0),
            o.get("paymentMethod", "Online Gateway"), o.get("paymentStatus", "Paid"),
            o.get("status") or o.get("orderStatus") or "Processing",
            o.get("deliveryExpected"), dump_json_field(o.get("timeline", []))
        ))

    # 9. Promotions
    for pr in DEFAULT_PROMOTIONS:
        cursor.execute("""
        INSERT OR REPLACE INTO promotions (id, code, type, value, minOrder, maxDiscount, validUntil, status, usageCount, applicableCategory)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (pr["id"], pr["code"], pr["type"], pr["value"], pr["minOrder"], pr.get("maxDiscount"), pr["validUntil"], pr["status"], pr["usageCount"], pr["applicableCategory"]))

    # 10. Media Assets
    for m in DEFAULT_MEDIA:
        cursor.execute("""
        INSERT OR REPLACE INTO media_assets (id, name, category, url, size, dimensions, uploadedDate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (m["id"], m["name"], m["category"], m["url"], m["size"], m["dimensions"], m["uploadedDate"]))

    # 11. Roles & Permissions
    for r in DEFAULT_ROLES:
        cursor.execute("""
        INSERT OR REPLACE INTO roles (id, name, description, usersCount, color)
        VALUES (?, ?, ?, ?, ?)
        """, (r["id"], r["name"], r["description"], r["usersCount"], r["color"]))

    cursor.execute("INSERT OR REPLACE INTO permissions (key, matrix) VALUES (?, ?)", ("matrix", dump_json_field(DEFAULT_PERMISSIONS_MATRIX)))

    # 12. Shipping
    for sh in DEFAULT_SHIPPING:
        cursor.execute("""
        INSERT OR REPLACE INTO shipping_carriers (id, name, code, serviceType, status, avgDays, ratePerKg, apiConnected)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (sh["id"], sh["name"], sh["code"], sh["serviceType"], sh["status"], sh["avgDays"], sh["ratePerKg"], sh["apiConnected"]))

    # 13. System Config
    cursor.execute("INSERT OR REPLACE INTO system_config (key, data) VALUES (?, ?)", ("settings", dump_json_field(DEFAULT_SYSTEM_CONFIG)))

    # 14. Notifications
    for n in DEFAULT_NOTIFICATIONS:
        cursor.execute("""
        INSERT OR REPLACE INTO notifications (id, title, message, time, type, read)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (n["id"], n["title"], n["message"], n["time"], n["type"], n["read"]))

    conn.commit()
    conn.close()
    print("Database seeded with full fixtures successfully!")

if __name__ == "__main__":
    from database import init_db
    init_db()
    seed_database()
