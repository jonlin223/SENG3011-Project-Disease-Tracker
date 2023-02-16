# [ {u_id, email, phone, name_first, name_last, country, state, profile_img_url} ]
from datetime import datetime
from nis import match
from operator import truediv


USERS = []

# [ {u_id, token} ]
CURRENT_USERS = []

# [ {u_id, password} ]
PASSWORD_DATA = []

# [ {disease, [symptoms], report_date, report_loc} ]
REPORTS = []


### search report helper functions ###
def matches_any_term(report, key_terms):
    match = False

    terms = key_terms.split()
    for term in terms:
        if report["disease"].lower() in term.lower():
            match = True
    
    return match

def matches_location(report, location):
    match = False
    report_loc = report["report_loc"].lower()
    location = location.lower()

    if (report_loc in location or location in report_loc):
        match = True
    
    return match

def is_within_range(report, start_date, end_date):
    match = False
    start = datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%S')
    end = datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%S')

    report_date = datetime.strptime(report["report_date"], '%Y-%m-%dT%H:%M')

    if (report_date >= start and report_date <= end):
        match = True

    return match

###

def get_reports():
    return REPORTS

def get_filtered_reports(start_date: str, end_date: str, key_terms: str, location: str):
    filtered_reports = []
    for report in REPORTS:
        if (matches_any_term(report, key_terms) and matches_location(report, location) and is_within_range(report, start_date, end_date)):
            filtered_reports.append(report)
    
    return {"reports": filtered_reports}

def add_report(disease: str, report_date: str, report_loc: str):
    report = {"disease": disease, "report_date": report_date, "report_loc": report_loc}
    REPORTS.append(report)

def get_users():
    return USERS

def get_user_data(u_id):
    for user in USERS:
        if user['u_id'] == u_id:
            return user
    
    return None

def get_uid_from_email(email):
    for user in USERS:
        if user['email'] == email:
            return user['u_id']
    
    return None

def register_new_user(uid, email, name_first, name_last, phone, profile_img_url):
    new_user = {}
    new_user['u_id'] = uid
    new_user['email'] = email
    new_user['name_first'] = name_first
    new_user['name_last'] = name_last
    new_user['phone'] = phone
    new_user['country'] = ""
    new_user['state'] = ""
    new_user['city'] = ""
    new_user['profile_img_url'] = profile_img_url

    USERS.append(new_user)
    print(USERS)

def update_user_data(user):
    target_user = get_user_data(user['u_id'])
    if target_user is None:
        USERS.append(user)
    else:
        target_user['u_id'] = user['u_id']
        target_user['email'] = user['email']
        target_user['name_first'] = user['name_first']
        target_user['name_last'] = user['name_last']
        target_user['profile_img_url'] = user['profile_img_url']

def add_token(u_id, token):
    curr_user = {'u_id': u_id, 'token': token}
    CURRENT_USERS.append(curr_user)

def get_uid_from_token(token):
    for current_user in CURRENT_USERS:
        if token == current_user['token']:
            return current_user['u_id']
    
    return None

def get_token_from_uid(u_id):
    for current_user in CURRENT_USERS:
        if u_id == current_user['u_id']:
            return current_user['token']
    
    return None

def revoke_token_authorisation(token):
    for current_user in CURRENT_USERS:
        if token == current_user['token']:
            CURRENT_USERS.remove(current_user)
            return True

    return False

def get_password_hash(u_id):
    for pwd_data in PASSWORD_DATA:
        if pwd_data['u_id'] == u_id:
            return pwd_data['password']

    return None

def set_password(u_id, password):
    target_pwd_data = None
    for pwd_data in PASSWORD_DATA:
        if pwd_data['u_id'] == u_id:
            target_pwd_data = pwd_data

    if target_pwd_data is None:
        PASSWORD_DATA.append({"u_id": u_id, "password": password})
    else:
        target_pwd_data['password'] = password
    
    print(PASSWORD_DATA)
