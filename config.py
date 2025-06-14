import os

class Config:
    SECRET_KEY = 'your-secret-key'

    # MySQL configuration
    SQLALCHEMY_DATABASE_URI = 'mysql://root:name@localhost:number/shopkeeper'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
