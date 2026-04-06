import re


def normalize_phone(phone_raw) -> str:
    """
    Normalize a phone number to a consistent 10-digit format (India-centric).
    Handles:
      - +91XXXXXXXXXX  -> XXXXXXXXXX
      - 0XXXXXXXXXX    -> XXXXXXXXXX
      - 91XXXXXXXXXX   -> XXXXXXXXXX
      - Spaces, dashes, dots stripped
      - Returns empty string if unparseable
    """
    if phone_raw is None:
        return ""

    # Convert to string and strip whitespace
    phone = str(phone_raw).strip()

    # If numeric float like 9876543210.0, strip the decimal
    if phone.endswith(".0"):
        phone = phone[:-2]

    # Remove all non-digit characters except leading +
    digits_only = re.sub(r"[^\d+]", "", phone)

    # Strip + sign for processing
    digits_only = digits_only.replace("+", "")

    # Handle country code prefixes for India
    if len(digits_only) == 12 and digits_only.startswith("91"):
        digits_only = digits_only[2:]
    elif len(digits_only) == 11 and digits_only.startswith("0"):
        digits_only = digits_only[1:]

    # Validate: must be exactly 10 digits
    if len(digits_only) == 10 and digits_only.isdigit():
        return digits_only

    # If not 10 digits, return cleaned version anyway (for non-Indian numbers)
    return digits_only if digits_only else ""


def phones_are_duplicate(phone1: str, phone2: str) -> bool:
    """Check if two phone numbers are effectively the same."""
    n1 = normalize_phone(phone1)
    n2 = normalize_phone(phone2)
    if not n1 or not n2:
        return False
    return n1 == n2
