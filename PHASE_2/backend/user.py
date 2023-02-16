from distutils.dist import DistributionMetadata
import input_checkers
import error
import database

@input_checkers.validate_token
def get_user_details(token):
    u_id = database.get_uid_from_token(token)
    user_data = database.get_user_data(u_id)
    return user_data

@input_checkers.validate_token
def update_user_details(token, email, first_name, last_name, country, state, phone, city):
    user_data = get_user_details(token)
    if database.get_uid_from_email(email) is None:
        user_data['email'] = email
    elif database.get_uid_from_email(email) is not None and database.get_uid_from_email(email) != database.get_uid_from_token(token):
        raise error.InputError(description="Email already in use")

    user_data['name_first'] = first_name
    user_data['name_last'] = last_name
    user_data['country'] = country
    user_data['state']  = state
    user_data['city']  = city
    user_data['phone'] = phone
