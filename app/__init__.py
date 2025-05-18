from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config
from dotenv import load_dotenv
import os


db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'main.shopkeeper_login'


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    # Import models here to avoid circular imports
    from . import models

    @login_manager.user_loader
    def load_user(user_id):
        from .models import Shopkeeper
        return Shopkeeper.query.get(int(user_id))

    return app

    