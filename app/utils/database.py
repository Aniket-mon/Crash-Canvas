# utils/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from auth.models import Base

# Create database engine
engine = create_engine(Config.DATABASE_URL, echo=Config.DEBUG)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def get_db_session():
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        pass  # Session will be closed by caller

def init_database():
    """Initialize database with tables"""
    create_tables()
    print("Database tables created successfully!")
