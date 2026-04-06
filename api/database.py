import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# ============================================================
# Database Configuration — uses environment variable for production
# ============================================================
# Default local MySQL string
DEFAULT_LOCAL_DB = "mysql+pymysql://root:password@localhost:3306/la?charset=utf8mb4"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_LOCAL_DB)
# ============================================================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,     # auto-reconnect if connection drops
    pool_recycle=3600,      # recycle connections every 1 hr
    echo=False,
    connect_args={"ssl": {}} if "aivencloud" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    lead_source = Column(String(100), nullable=True)
    employee_name = Column(String(200), nullable=True)
    customer_name = Column(String(200), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)          # normalized phone
    phone_raw = Column(String(50), nullable=True)       # original phone as-is
    status = Column(String(100), nullable=True)
    remarks = Column(Text, nullable=True)
    lead_date = Column(DateTime, nullable=True)         # date from Excel / upload date
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    source_file = Column(String(300), nullable=True)


class UploadLog(Base):
    __tablename__ = "upload_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(300))
    total_rows = Column(Integer, default=0)
    inserted = Column(Integer, default=0)
    duplicates = Column(Integer, default=0)
    errors = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.utcnow)


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
