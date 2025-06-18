import re
from dash import html

def validate_password_strength(password):
    """Validate password against all requirements"""
    if not password:
        return {
            'length_valid': False,
            'has_lower': False,
            'has_upper': False,
            'has_numbers': False,
            'has_special': False,
            'no_consecutive': False,
            'mixed_valid': False,
            'all_valid': False
        }
    
    # Individual checks
    length_valid = len(password) >= 8
    has_lower = bool(re.search(r'[a-z]', password))
    has_upper = bool(re.search(r'[A-Z]', password))
    has_numbers = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[!@#$%\-*&()_+=\[\]{};\':"\\|,.<>\/?]', password))
    no_consecutive = not bool(re.search(r'(.)\1{2,}', password))
    
    # At least one character type
    mixed_valid = has_lower or has_upper or has_numbers or has_special
    
    # All requirements met
    all_valid = all([length_valid, mixed_valid, has_lower, has_upper, has_numbers, has_special, no_consecutive])
    
    return {
        'length_valid': length_valid,
        'has_lower': has_lower,
        'has_upper': has_upper,
        'has_numbers': has_numbers,
        'has_special': has_special,
        'no_consecutive': no_consecutive,
        'mixed_valid': mixed_valid,
        'all_valid': all_valid
    }

def validate_email_format(email, return_bool=False):
    """Validate email format"""
    if not email:
        return "" if not return_bool else False
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    is_valid = re.match(email_pattern, email) is not None
    
    if return_bool:
        return is_valid
    
    if is_valid:
        return html.Div([
            html.I(className="fas fa-check-circle", style={"color": "#10B981", "margin-right": "6px"}),
            html.Span("Valid email", style={"color": "#10B981", "font-size": "12px"})
        ])
    else:
        return html.Div([
            html.I(className="fas fa-exclamation-circle", style={"color": "#EF4444", "margin-right": "6px"}),
            html.Span("Please enter a valid email", style={"color": "#EF4444", "font-size": "12px"})
        ])
