import os

class Config:
    SECRET_KEY = 'your-secret-key'

    # MySQL configuration
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/grosnap_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
