from unicodedata import name
from uuid import uuid4, uuid5
import input_checkers
import error
import jwt
import database
import hashlib

DEFAULT_IMG_URL = "https://render.fineartamerica.com/images/rendered/default/print/8/6/break/images/artworkimages/medium/1/frank-heather-perry.jpg"

@input_checkers.validate_email_format
def auth_login(email, password):
    # Does email belong to a user?
    target_uid = database.get_uid_from_email(email)
    if target_uid is None:
        raise error.InputError(description="Cannot find an account with this email.")
    
    # Hash the password and see if it matches the hash in the DB
    hashed_pwd = hashlib.sha256(password.encode()).hexdigest()

    # Does the password match?
    stored_pwd_hash = database.get_password_hash(target_uid)
    if stored_pwd_hash != hashed_pwd:
        raise error.InputError(description="The password you entered is incorrect")
    
    # Is this user already logged in?
    if database.get_token_from_uid(target_uid) is not None:
        raise error.AccessError(description="Cannot login when already logged in.")
    
    # Generate a token
    payload = {'u_id': target_uid}
    token = str(jwt.encode(payload, 'jwt_secret', algorithm='HS256'))

    database.add_token(target_uid, token)

    # Now return the login dict
    result = {'u_id': target_uid, 'token': token}
    return result

@input_checkers.validate_token
def auth_logout(token):
    return {'is_success': database.revoke_token_authorisation(token)}

@input_checkers.validate_email_format
def auth_register(email, password, name_first, name_last, phone):
    
    # Check if email is already being used by another user
    for user in database.get_users():
        if user['email'] == email:
            raise error.InputError(description="The email you entered is already being used")
    
    for user in database.get_users():
        if user['phone'] == phone:
            raise error.InputError(description="The phone you entered is already being used")

    # Check if password is less than 6 characters long
    if len(password) < 6:
        raise error.InputError(description="""The password you entered is less than 6 characters long""")

    # Generate user id
    u_id = uuid4().hex   
    database.register_new_user(u_id, email, name_first, name_last, phone, DEFAULT_IMG_URL)
    hashed_pwd = hashlib.sha256(password.encode()).hexdigest()
    database.set_password(u_id, hashed_pwd)

    # We now login the user with auth_login (generating a token)
    return auth_login(email, password)
