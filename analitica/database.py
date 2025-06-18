# analitica/database.py
import pandas as pd
import os
from typing import Optional, Dict, List

# Base path for data files
DATA_SOURCE_DIR = os.path.join(os.path.dirname(__file__), "data_source")

# Global cache for DataFrames
_dataframes_cache: Dict[str, Optional[pd.DataFrame]] = {
    "users": None,
    "roles": None,
    "user_roles": None,
    "employees": None,
    "hardware": None,
    "licenses": None,
    "web_accesses": None,
}

def _load_csv(filename: str, required_columns: Optional[List[str]] = None) -> Optional[pd.DataFrame]:
    """Loads a CSV file into a pandas DataFrame."""
    path = os.path.join(DATA_SOURCE_DIR, filename)
    if not os.path.exists(path):
        print(f"Warning: Data file {filename} not found at {path}")
        return None
    try:
        df = pd.read_csv(path)
        if required_columns:
            missing_cols = [col for col in required_columns if col not in df.columns]
            if missing_cols:
                print(f"Warning: Data file {filename} is missing columns: {missing_cols}")
                # Decide if this should return None or df, for now return df
        return df
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return None

def get_users_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["users"] is None:
        _dataframes_cache["users"] = _load_csv("users.csv", ["id", "username", "email"])
    return _dataframes_cache["users"]

def get_roles_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["roles"] is None:
        _dataframes_cache["roles"] = _load_csv("roles.csv", ["id", "name"])
    return _dataframes_cache["roles"]

def get_user_roles_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["user_roles"] is None:
        _dataframes_cache["user_roles"] = _load_csv("user_roles.csv", ["user_id", "role_id"])
    return _dataframes_cache["user_roles"]

def get_employees_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["employees"] is None:
        _dataframes_cache["employees"] = _load_csv("employees.csv", ["id", "name", "department", "position"])
    return _dataframes_cache["employees"]

def get_hardware_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["hardware"] is None:
        _dataframes_cache["hardware"] = _load_csv("hardware.csv", ["id", "type", "serial_number", "employee_id"])
    return _dataframes_cache["hardware"]

def get_licenses_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["licenses"] is None:
        _dataframes_cache["licenses"] = _load_csv("licenses.csv", ["id", "software_name", "license_key", "employee_id"])
    return _dataframes_cache["licenses"]

def get_web_accesses_df() -> Optional[pd.DataFrame]:
    if _dataframes_cache["web_accesses"] is None:
        _dataframes_cache["web_accesses"] = _load_csv("web_accesses.csv", ["id", "service_name", "url", "employee_id"])
    return _dataframes_cache["web_accesses"]

# The following are no longer needed with CSVs as data source in this basic setup
# - SQLAlchemy engine
# - SessionLocal
# - get_db() (the FastAPI dependency)
# - init_db()
# Models from db_models.py might still be useful for data structure reference or Pydantic conversion.
