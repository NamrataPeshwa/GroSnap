from . import db
from flask_login import UserMixin

class KiranaShop(db.Model):
    __tablename__ = 'kirana_shops'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    phone = db.Column(db.String(15))
    latitude = db.Column(db.Float)      # location
    longitude = db.Column(db.Float) 
    owner_id = db.Column(db.Integer, db.ForeignKey('shopkeepers.id'))

    products = db.relationship('Product', backref='shop', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(300))
    category = db.Column(db.String(100))
    shop_id = db.Column(db.Integer, db.ForeignKey('kirana_shops.id'), nullable=False)

class Shopkeeper(db.Model, UserMixin):
    __tablename__ = 'shopkeepers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    shop = db.relationship('KiranaShop', backref='owner', uselist=False)
    
class Customers(db.Model, UserMixin):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # Define foreign key column here:
    shop_id = db.Column(db.Integer, db.ForeignKey('kirana_shops.id'))

    # Define relationship here:
    shop = db.relationship('KiranaShop', backref='customers', uselist=False)

