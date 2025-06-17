# analitica/db_models.py
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Date, Table, Enum as SAEnum
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

# Enum for Role names (must match ERole in Java)
class ERoleEnum(enum.Enum):
    ROLE_USER = "ROLE_USER"
    ROLE_ADMIN = "ROLE_ADMIN"

# Association table for User and Role (many-to-many)
user_roles_table = Table('user_roles', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True)
)

class Role(Base):
    __tablename__ = 'roles'
    # Assuming 'roles' table as defined by Spring Boot (check actual table name if different)
    # Spring Boot typically uses GenerationType.IDENTITY for IDs.
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(SAEnum(ERoleEnum), unique=True, nullable=False)

    users = relationship("User", secondary=user_roles_table, back_populates="roles")

class User(Base):
    __tablename__ = 'users'
    # Assuming 'users' table
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(120), nullable=False) # Hashed password

    roles = relationship("Role", secondary=user_roles_table, back_populates="users")

class Employee(Base):
    __tablename__ = 'employees'
    # Assuming 'employees' table
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    department = Column(String(100))
    position = Column(String(100))

    hardware = relationship("Hardware", back_populates="assigned_employee")
    licenses = relationship("License", back_populates="assigned_employee")
    web_accesses = relationship("WebAccess", back_populates="assigned_employee")


class Hardware(Base):
    __tablename__ = 'hardware'
    # Assuming 'hardware' table
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(String(100), nullable=False)
    brand = Column(String(100))
    serial_number = Column(String(100), unique=True, nullable=False)
    location = Column(String(255))
    employee_id = Column(Integer, ForeignKey('employees.id'), nullable=True) # Name in DB often employee_id

    assigned_employee = relationship("Employee", back_populates="hardware")

class License(Base):
    __tablename__ = 'licenses'
    # Assuming 'licenses' table
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    software_name = Column(String(100), nullable=False)
    license_key = Column(String(255), unique=True, nullable=False)
    purchase_date = Column(Date, nullable=True)
    expiration_date = Column(Date, nullable=True)
    employee_id = Column(Integer, ForeignKey('employees.id'), nullable=True)

    assigned_employee = relationship("Employee", back_populates="licenses")

class WebAccess(Base):
    __tablename__ = 'web_accesses' # Table name from Spring Boot: web_accesses
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_name = Column(String(100), nullable=False) # Added to match Spring Boot model
    url = Column(String(255), nullable=False)
    access_username = Column(String(100), nullable=False) # Changed from username
    access_password = Column(String(255), nullable=False) # Changed from password
    employee_id = Column(Integer, ForeignKey('employees.id'), nullable=True)

    assigned_employee = relationship("Employee", back_populates="web_accesses")

# Note: Table names ('users', 'roles', 'employees', etc.) and column names ('employee_id')
# must exactly match what Spring Data JPA creates in the H2 database.
# Spring Boot by default converts camelCase entity field names to snake_case table/column names.
# e.g., `serialNumber` in Java class Hardware becomes `serial_number` column.
# The models above try to reflect this common convention.
# `assignedEmployee` in Java becomes `employee_id` foreign key column.
