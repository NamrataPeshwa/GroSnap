import os

class Config:
    SECRET_KEY = 'your-secret-key'

    # MySQL configuration
    SQLALCHEMY_DATABASE_URI = 'mysql://root:Helloworld123@localhost:3306/shopkeeper'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
