from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from .models import KiranaShop, Product, Shopkeeper, Customers
from . import db
from flask import jsonify
from math import radians, cos, sin, sqrt, atan2
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_required, current_user
from collections import defaultdict
import re, urllib.parse


main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/customer-signup', methods=['GET', 'POST'])
def customer_register():
    if request.method == 'POST':
        # Get data from form
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        
        # Save to database (example with SQLAlchemy)
        new_customer = Customers(name=name, email=email, password=password)
        db.session.add(new_customer)
        db.session.commit()

        return redirect(url_for('main.customer_login'))

    return render_template('customer_signup.html')

@main.route('/customer-signin', methods=['GET', 'POST'])
def customer_login():
    if request.method == 'POST':
        # Handle login form submission
        email = request.form['email']
        password = request.form['password']
        
        # Authenticate user (example)
        user = Customers.query.filter_by(email=email).first()
        if user and user.password == password:
            # Set session or do login
            session['user_id'] = user.id
            return redirect(url_for('main.index'))
        else:
            error = "Invalid email or password"
            return render_template('customer_signin.html', error=error)
    
    # For GET request just render the login page
    return render_template('customer_signin.html')


@main.route('/base')
def base():
    return render_template('base.html')

@main.route('/ocr-upload')
def ocr_upload():
    return render_template('ocr_upload.html')

@main.route('/shops')
def shop_list():
    shops = KiranaShop.query.all()
    return render_template('shop_list.html', shops=shops)

@main.route('/shop/<int:shop_id>')
def shop_detail(shop_id):
    shop = KiranaShop.query.get_or_404(shop_id)
    products = shop.products
    products_by_category = defaultdict(list)
    for product in products:
        products_by_category[product.category].append(product)

    return render_template("shop_detail.html", shop=shop, products_by_category=products_by_category)


# 🛒 Add to cart
@main.route('/add_to_cart/<int:product_id>')
def add_to_cart(product_id):
    cart = session.get('cart', {})

    if str(product_id) in cart:
        cart[str(product_id)] += 1
    else:
        cart[str(product_id)] = 1

    session['cart'] = cart
    flash('Product added to cart!')
    return redirect(url_for('main.view_cart'))

@main.route('/map')
def shop_map():
    return render_template('shop_map.html')

@main.route('/nearby')
def nearby_page():
    return render_template('nearby_shops.html')

@main.route('/search')
def product_search():
    query = request.args.get('q', '')
    if query:
        results = Product.query.filter(Product.name.ilike(f"%{query}%")).all()
    else:
        results = []

    return render_template('search_results.html', query=query, results=results)

@main.route('/cart')
def view_cart():
    cart = session.get('cart', {})
    items = []
    subtotal = 0

    for product_id, quantity in cart.items():
        product = Product.query.get(int(product_id))
        subtotal_item = product.price * quantity
        items.append({
            'product': product,
            'quantity': quantity,
            'subtotal': subtotal_item
        })
        subtotal += subtotal_item

    delivery_fee = 25  # fixed for now
    total = subtotal + delivery_fee

    return render_template('cart.html', items=items, subtotal=subtotal, delivery_fee=delivery_fee, total=total)

# ✅ Confirm order
@main.route('/place_order')
def place_order():
    cart = session.get('cart', {})
    if not cart:
        flash("Your cart is empty.")
        return redirect(url_for('main.view_cart'))
    total_price = 0
    cart_items = []
    shop = None

    # Loop through the cart to calculate total price and prepare the order items
    for product_id, quantity in cart.items():
        product = Product.query.get(int(product_id))
        if not product:
            continue

        subtotal = product.price * quantity
        total_price += subtotal
        cart_items.append({
            'name': product.name,
            'quantity': quantity,
            'price': product.price,
            'subtotal': subtotal
        })

        if not shop:
            shop = product.shop  # assuming all products are from the same shop

    # Clear the cart after placing the order
    session.pop('cart', None)
    flash("✅ Order placed successfully!")

    # Send WhatsApp message to shopkeeper if phone number is available
    if shop and shop.phone:
        phone_number = shop.phone.strip() # Clean the phone number if there are spaces
        
        # Prepare the order summary for WhatsApp message
        order_summary = f"Order Summary:\n\n"
        for item in cart_items:
            order_summary += f"{item['name']} x {item['quantity']} = ₹{item['subtotal']}\n"
        order_summary += f"\nTotal: ₹{total_price}\n"
        order_summary += f"\nCustomer Name: {current_user.name}\n"
        order_summary += f"Customer Phone: {getattr(current_user, 'phone', 'Not provided')}\n"

        # URL-encode the message for WhatsApp
        encoded_message = urllib.parse.quote(order_summary)

        # Create the WhatsApp URL
        whatsapp_url = f"https://wa.me/{phone_number}?text={encoded_message}"

        # Redirect to WhatsApp URL (opens WhatsApp directly)
        return redirect(whatsapp_url)

    # If no phone number, send email notification
    elif shop and shop.owner and shop.owner.email:
        # Send email notification
        shopkeeper = shop.owner
        email_body = f"""Hello {shopkeeper.name},

Customer: {current_user.name}
Phone: {getattr(current_user, 'phone', 'Not provided')}

Items:
""" + "\n".join([f"- {item['name']} x {item['quantity']} = ₹{item['subtotal']}" for item in cart_items]) + f"""

Total: ₹{total_price}

Please log in to your dashboard to fulfill the order.
"""
    def send_order_email(shopkeeper_email, order_details):
        send_order_email(shopkeeper.email, "🛒 New Order Received – GroSnap", email_body)

    return render_template("order_success.html")
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Radius of Earth in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2)*2 + cos(lat1) * cos(lat2) * sin(dlon / 2)*2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

# Helper function to calculate distance between two lat/lng points
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in KM
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@main.route('/api/nearby_shops', methods=['POST'])
def nearby_shops():
    data = request.get_json()
    user_lat = data.get('lat')
    user_lng = data.get('lng')

    if user_lat is None or user_lng is None:
        return jsonify({'error': 'Invalid coordinates'}), 400

    all_shops = KiranaShop.query.all()
    nearby = []

    for shop in all_shops:
        if shop.latitude and shop.longitude:
            distance = calculate_distance(user_lat, user_lng, shop.latitude, shop.longitude)
            if distance <= 5.0:  # only within 5 km
                nearby.append({
                    
                    'id': shop.id,
                    'name': shop.name,
                    'address': shop.address,
                    'latitude': shop.latitude,
                    'longitude': shop.longitude

                })

    return jsonify({'shops': nearby})

@main.route('/shopkeeper/register', methods=['GET', 'POST'])
def shopkeeper_register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])

        if Shopkeeper.query.filter_by(email=email).first():
            flash('Email already registered')
            return redirect(url_for('main.shopkeeper_register'))

        shopkeeper = Shopkeeper(name=name, email=email, password=password)
        db.session.add(shopkeeper)
        db.session.commit()
        flash('Registration successful. Please log in.')
        return redirect(url_for('main.shopkeeper_login'))

    return render_template('shopkeeper_register.html')


@main.route('/shopkeeper/login', methods=['GET', 'POST'])
def shopkeeper_login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        shopkeeper = Shopkeeper.query.filter_by(email=email).first()
        if shopkeeper and check_password_hash(shopkeeper.password, password):
            login_user(shopkeeper)
            return redirect(url_for('main.shopkeeper_dashboard'))
        else:
            flash('Invalid login details')
            return redirect(url_for('main.shopkeeper_login'))

    return render_template('shopkeeper_login.html')


@main.route('/shopkeeper/logout')
@login_required
def shopkeeper_logout():
    logout_user()
    return redirect(url_for('main.index'))

@main.route('/shopkeeper/dashboard', methods=['GET', 'POST'])
@login_required
def shopkeeper_dashboard():
    shop = current_user.shop  # may be None if not created yet

    if request.method == 'POST':
        name = request.form['name']
        address = request.form['address']
        phone = request.form['phone']
        latitude = request.form.get('latitude', type=float)
        longitude = request.form.get('longitude', type=float)

        if shop is None:
            # Create new shop
            shop = KiranaShop(
                name=name,
                address=address,
                phone=phone,
                latitude=latitude,
                longitude=longitude,
                owner=current_user
            )
            db.session.add(shop)
        else:
            # Update existing shop
            shop.name = name
            shop.address = address
            shop.phone = phone
            shop.latitude = latitude
            shop.longitude = longitude

        db.session.commit()
        flash('Shop details saved successfully.')
        return redirect(url_for('main.shopkeeper_dashboard'))

    return render_template('shopkeeper_dashboard.html', shop=shop)

@main.route('/shopkeeper/products')
@login_required
def manage_products():
    shop = current_user.shop
    if not shop:
        flash('Please create your shop details first.')
        return redirect(url_for('main.shopkeeper_dashboard'))

    products = shop.products
    return render_template('manage_products.html', products=products)


@main.route('/shopkeeper/products/add', methods=['GET', 'POST'])
@login_required
def add_product():
    shop = current_user.shop
    if not shop:
        flash('Please create your shop details first.')
        return redirect(url_for('main.shopkeeper_dashboard'))

    if request.method == 'POST':
        name = request.form['name']
        price = float(request.form['price'])
        stock = int(request.form['stock'])
        category = str(request.form['category'])
        image_url = request.form.get('image_url', '')

        product = Product(name=name, price=price, category=category, stock=stock, image_url=image_url, shop=shop)
        db.session.add(product)
        db.session.commit()

        flash('Product added successfully.')
        return redirect(url_for('main.manage_products'))

    return render_template('add_product.html')


@main.route('/shopkeeper/products/edit/<int:product_id>', methods=['GET', 'POST'])
@login_required
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    if product.shop.owner != current_user:
        flash('Unauthorized access.')
        return redirect(url_for('main.manage_products'))

    if request.method == 'POST':
        product.name = request.form['name']
        product.price = float(request.form['price'])
        product.stock = int(request.form['stock'])
        product.category = str(request.form['category'])
        product.image_url = request.form.get('image_url', '')
        db.session.commit()
        flash('Product updated successfully.')
        return redirect(url_for('main.manage_products'))

    return render_template('edit_product.html', product=product)


@main.route('/shopkeeper/products/delete/<int:product_id>', methods=['POST'])
@login_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    if product.shop.owner != current_user:
        flash('Unauthorized access.')
        return redirect(url_for('main.manage_products'))

    db.session.delete(product)
    db.session.commit()
    flash('Product deleted.')
    return redirect(url_for('main.manage_products'))

def clean_ocr_output(text):
    # Normalize spaces, remove unwanted chars, preserve lines
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        cleaned_line = re.sub(r'[^\w\s]', '', line).strip()  # Remove punctuation
        cleaned_line = re.sub(r'\s+', ' ', cleaned_line)  # Normalize spaces
        cleaned_lines.append(cleaned_line)
    return '\n'.join(cleaned_lines)

@main.route('/find-items', methods=['POST'])
def find_items():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    text = data['text'].lower()
    # Split items by newlines and commas to get individual grocery items
    raw_items = re.split(r'[\n,]+', text)
    items = [item.strip() for item in raw_items if item.strip()]

    results = nearby_shops(items)
    total_items = len(items)
    total_found = sum(len(r['found_items']) for r in results['found'])
    message = f"{total_found} out of {total_items} items found."

    return jsonify({
        'message': message,
        'store_results': results['found']
    })
