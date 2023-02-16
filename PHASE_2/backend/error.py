"""
Errors used accross the files
"""

class HTTPException(Exception):
    """
    Parent class for errors below
    """
    def __init__(self):
        self.code = 200
        self.description = "No description specified"

class AccessError(HTTPException):
    """
    HTTP error if there is invalid access.
    """
    def __init__(self, description: str):
        self.code = 400
        self.description = description

class InputError(HTTPException):
    """
    HTTP error if there is invalid input.
    """
    def __init__(self, description: str):
        self.code = 400
        self.description = description
