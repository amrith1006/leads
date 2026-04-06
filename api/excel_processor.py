import pandas as pd
import re
from typing import List, Dict, Any


# Status values that are valid (from dropdown column F)
VALID_STATUSES = {
    "first call", "followup call", "rate call", "assigned to branch",
    "appointment call", "customer not interested",
    "customer interested need time", "customer dropped"
}

# Lead sources
VALID_SOURCES = {
    "whatsapp", "website", "justdial", "walkin", "telecall"
}


def is_summary_row(row: pd.Series) -> bool:
    """Detect if a row is a summary/total row (not actual lead data)."""
    lead_source = str(row.get("lead_source", "") or "").strip().lower()
    # Summary rows typically have "total calls" or no phone
    if "total" in lead_source or "calls" in lead_source:
        return True
    # Empty customer name and phone - likely blank filler row
    customer = str(row.get("customer_name", "") or "").strip()
    phone = str(row.get("phone", "") or "").strip()
    if not customer and not phone:
        return True
    return False


def read_excel_file(file_source) -> List[Dict[str, Any]]:
    """
    Read an Excel file and return a list of lead dicts.
    Accepts either:
      - A file path (str)
      - A BytesIO object (in-memory, no temp file needed on Windows)
    """
    import io

    # If BytesIO, rewind it to start before giving to pandas
    if isinstance(file_source, io.BytesIO):
        file_source.seek(0)

    # Try to open and detect sheets
    try:
        xl = pd.ExcelFile(file_source)
        sheet_name = xl.sheet_names[0]  # Use first sheet
    except Exception as e:
        raise ValueError(f"Cannot read Excel file: {e}. Ensure it is .xlsx or .xls format.")

    # If BytesIO, rewind again before second read
    if isinstance(file_source, io.BytesIO):
        file_source.seek(0)

    # Read with no header to detect header row ourselves
    df = pd.read_excel(file_source, sheet_name=sheet_name, header=None)

    # Find the header row by looking for "Phone" or "Customer" keyword
    header_row_idx = None
    for idx, row in df.iterrows():
        row_lower = [str(v).strip().lower() for v in row.values]
        if any("phone" in cell or "customer" in cell or "employee" in cell for cell in row_lower):
            header_row_idx = idx
            break

    if header_row_idx is None:
        header_row_idx = 0

    # If BytesIO, rewind again before final read
    if isinstance(file_source, io.BytesIO):
        file_source.seek(0)

    # Re-read with correct header row
    df = pd.read_excel(file_source, sheet_name=sheet_name, header=header_row_idx)

    # Normalize column names
    df.columns = [normalize_col_name(c) for c in df.columns]

    # Map to standard field names
    col_map = {
        "lead_source": find_col(df, ["lead source", "lead_source", "source"]),
        "employee_name": find_col(df, ["employee name", "employee_name", "employee"]),
        "customer_name": find_col(df, ["customer name", "customer_name", "customer"]),
        "address": find_col(df, ["address", "addr"]),
        "phone": find_col(df, ["phone", "mobile", "contact", "phone no", "phone number"]),
        "status": find_col(df, ["status"]),
        "remarks": find_col(df, ["remarks", "remark", "notes", "note"]),
    }

    leads = []
    for _, row in df.iterrows():
        lead = {}
        for field, col in col_map.items():
            if col is not None:
                val = row.get(col, None)
                lead[field] = clean_value(val)
            else:
                lead[field] = None

        # Skip summary / empty rows
        if is_lead_row_valid(lead):
            leads.append(lead)

    return leads



def is_lead_row_valid(lead: Dict) -> bool:
    """A valid lead row MUST have a phone number."""
    phone = str(lead.get("phone") or "").strip()
    lead_source = str(lead.get("lead_source") or "").strip().lower()

    # Skip pure summary or blank rows
    if "total" in lead_source or "calls" in lead_source:
        return False
    
    # NEW LOGIC: If no phone number, it's not a valid lead row for the DB
    if not phone or phone.lower() in ("nan", "none", "null"):
        return False
        
    return True


def normalize_col_name(col) -> str:
    return str(col).strip().lower().replace(" ", "_").replace("-", "_")


def find_col(df: pd.DataFrame, candidates: list):
    """Find a matching column name from a list of candidates."""
    for c in candidates:
        # Exact match
        if c.replace(" ", "_") in df.columns:
            return c.replace(" ", "_")
        # Partial match
        for col in df.columns:
            if c.replace(" ", "_") in col or col in c.replace(" ", "_"):
                return col
    return None


def clean_value(val) -> str:
    if val is None or (isinstance(val, float) and str(val) == "nan"):
        return None
    val = str(val).strip()
    if val.lower() in ("nan", "none", "null", ""):
        return None
    # Strip trailing .0 from numeric values
    if re.match(r"^\d+\.0$", val):
        val = val[:-2]
    return val
