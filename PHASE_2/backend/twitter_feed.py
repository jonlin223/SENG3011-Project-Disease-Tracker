from database import get_uid_from_token
import database
import input_checkers
import json
import requests

api_key = '4fSc75updvKyGiE3Slr9TPFIA'
secret = 'QeU1mdOzFQqc0gBu1gWED0qQyBypJcopH5hnRLNSY5V7Wmmxt4'
bearer = 'AAAAAAAAAAAAAAAAAAAAACxRbgEAAAAAIahZYu10ui2TvyRuPii6BToC3rk%3D2mU9l3Mj4766z4e2gsWZTtUqc5rpD9iX7zEVf9YxSDNMRpisxA'

# Lifeline: 44564878
verified_accounts_syd = [40778270, 1010555310, 933541450708434944]
verified_accounts_london = [31129844, 125595021]

def bearer_oauth(r):
    r.headers["Authorization"] = f"Bearer {bearer}"
    r.headers["User-Agent"] = "v2RecentSearchPython"
    return r

def get_date(elem):
    return elem['created_at']

#@input_checkers.validate_token
def get_syd_twitter_feed():

    id_list = []

    for account_id in verified_accounts_syd:
        search_url = f'https://api.twitter.com/2/users/{account_id}/tweets'
        query_params = {'tweet.fields': 'id,created_at'}

        response = requests.get(search_url, auth=bearer_oauth, params=query_params)
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)

        json_response = response.json()['data']
        for tweet in json_response:
            id_list.append({"id": tweet['id'], "created_at": tweet['created_at']})

    id_list.sort(key=get_date, reverse=True)
    return {"tweet_list": id_list}

def get_london_twitter_feed():

    id_list = []

    for account_id in verified_accounts_london:
        search_url = f'https://api.twitter.com/2/users/{account_id}/tweets'
        query_params = {'tweet.fields': 'id,created_at'}

        response = requests.get(search_url, auth=bearer_oauth, params=query_params)
        if response.status_code != 200:
            raise Exception(response.status_code, response.text)

        json_response = response.json()['data']
        for tweet in json_response:
            id_list.append({"id": tweet['id'], "created_at": tweet['created_at']})

    id_list.sort(key=get_date, reverse=True)
    return {"tweet_list": id_list}

print(get_syd_twitter_feed())
print()
print(get_london_twitter_feed())