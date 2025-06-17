# analitica/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# --- H2 Database Connection using JayDeBeApi ---
# Path to the H2 JDBC driver JAR downloaded earlier
# Assumes 'analitica' is the current working directory when script/app runs
H2_JAR_PATH = os.path.join(os.path.dirname(__file__), "lib", "h2-2.1.214.jar")

# Path to the H2 database file.
# This path is RELATIVE TO WHERE THE PYTHON APP IS RUN.
# If Spring Boot saves DB to project_root/data/activos_tic_db.mv.db
# and Python app runs from project_root/analitica/
# then the path would be '../data/activos_tic_db' (without .mv.db for JDBC URL)
# For development, ensure the Spring Boot backend uses a FILE-BASED H2 database.
# Example: spring.datasource.url=jdbc:h2:file:./data/activos_tic_db
# This means the H2 file will be at project_root/data/activos_tic_db.mv.db

# Adjust this path based on your project structure and where Spring Boot saves the H2 file.
# Assuming the H2 file is in a 'data' folder at the project root.
# If 'analitica' is at the project root, then path is like './data/activos_tic_db'
# If 'analitica' is a sub-folder of project root, path is '../data/activos_tic_db'
# Let's assume Spring Boot data dir is at project root 'data/'
# and this analitica app is also at project root 'analitica/'
# So, path to DB file from 'analitica' dir is '../data/activos_tic_db'

# The path to the H2 database file (without the .mv.db extension for the JDBC URL)
# This path needs to be correct relative to where the Spring Boot app saves its H2 file.
# If Spring Boot saves to `PROJECT_ROOT/data/activos_tic_db`, then:
DB_FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'activos_tic_db'))
# For testing, let's assume the db file is in the analitica folder for now.
# DB_FILE_PATH_FOR_TESTING = os.path.join(os.path.dirname(__file__), 'test_activos_tic_db')
# SQLALCHEMY_DATABASE_URL_JDBC = f"h2+jaydebeapi://SA:{DB_FILE_PATH_FOR_TESTING}" # No password, default user SA

# PRODUCTION-LIKE PATH (assuming Spring Boot saves to PROJECT_ROOT/data/):
SQLALCHEMY_DATABASE_URL_JDBC = f"h2+jaydebeapi://SA:{DB_FILE_PATH}" # No password for H2 default 'sa' user

# SQLAlchemy engine using JayDeBeApi
# The connect_args are specific to JayDeBeApi for JDBC drivers.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL_JDBC,
    connect_args={'jars': [H2_JAR_PATH]}
    # For some H2 versions/JayDeBeApi, you might need 'driver': 'org.h2.Driver' here too,
    # but often JayDeBeApi infers it or it's part of the URL implicitly.
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create tables (optional, if Python app needs to init schema)
# from db_models import Base # Import Base from your models file
# def init_db():
#     Base.metadata.create_all(bind=engine) # This would create tables if they don't exist
