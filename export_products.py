from app import create_app, db
from app.models import Product

import csv
import os

app = create_app()

output_path = "D:/GroSnap/products.csv"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with app.app_context():
    products = Product.query.all()
    with open(output_path, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'name', 'price', 'stock', 'image_url', 'shop_id'])
        for p in products:
            writer.writerow([p.id, p.name, p.price, p.stock, p.image_url, p.shop_id])

print(f"✅ Exported successfully to {output_path}")
