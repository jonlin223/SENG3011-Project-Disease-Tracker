import datetime
import re
import pymongo
from bson.objectid import ObjectId

from .errors import DateError

# Database name: cdc
# Collection name: articles

# Connect to the cdc database
try:
    client = pymongo.MongoClient("mongodb+srv://implementers:aRmHRwqQXSE5VrkO@cluster0.st2vs.mongodb.net/cdc?retryWrites=true&w=majority")

    cdc_db = client.cdc

    # Request to check connection
    client.server_info()

    # Get articles collection
    articles = cdc_db.articles
except Exception as err:
    print(f"Error: could not connect to db server.\n${err}")


# Helper function make query case insensitive
def ignore_case(text):
    return re.compile(text, re.IGNORECASE)

def ignore_case_list(list):
    new_list = []
    for l in list:
        new_list.append(ignore_case(l))
    
    return new_list


# Use test_articles collection instead of main articles collection
def set_test_mode():
    global articles
    articles = cdc_db.test_articles

def set_default_mode():
    global articles
    articles = cdc_db.articles

def drop_test_articles():
    cdc_db.test_articles.drop()

def insert_article(article):
    try:
        if (article["date_of_publication"] == None):
            article["date_of_publication"] = ""
        res = articles.insert_one(article)
        return res.inserted_id
    except Exception as err:
        print(f"Error: insertion unsuccessful.\n${err}")


def get_article_by_id(article_id):
    try:
        res = articles.find({
            '_id': article_id
        })

        res = res[0]

        for report in res["reports"]:
            report["event_date"][0] = report["event_date"][0].strftime("%Y-%m-%d %H:%M:%S")
            end = report["event_date"][1]
            if (end is not None):
                report["event_date"][1] = report["event_date"][1].strftime("%Y-%m-%d %H:%M:%S")
            else:
                report["event_date"][1] = None

        
        res.pop("_id")
        print(res)

        return {
            "article": res
        }
    except Exception as err:
        raise ValueError(f"Error: invalid article id.\n${err}")



def get_articles(start_date, end_date, key_terms, location):
    key_terms = key_terms.split(',')

    try:
        start = datetime.datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%S')
        end = datetime.datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%S')

         # Check that start_date < end_date
        if (start > end):
            raise DateError
    except DateError:
        raise DateError("Error: invalid date range. Start date should be before end date.")
    except:
        raise ValueError("Error: incorrect date format. Should be yyyy-MM-ddTHH:mm:ss")
    

    cursor = articles.find({ 
        "reports": {
            "$elemMatch": { 
                "$and": [
                    { "event_date.0": {"$gte": start} },
                    { "event_date.0": {"$lte": end} },
                    { "$or": [{"event_date.1": None}, {"event_date.1": {"$gte": start}}] },
                    { "$or": [{"event_date.1": None}, {"event_date.1": {"$lte": end}}] }
                ],
                "$or": [
                    {"diseases": {
                        "$elemMatch": {
                            "$in": ignore_case_list(key_terms)
                        }
                    }},
                    {"syndromes": {
                        "$elemMatch": {
                            "$in": ignore_case_list(key_terms)
                        }
                    }},
                ],
                "locations": {
                    "$elemMatch": {
                        "$or": [
                            { "country": {"$regex": ignore_case(location)} },
                            { "location": {"$regex": ignore_case(location)} }
                        ]
                    }    
                }
            }
        }
    })

    res = list(cursor)

    for article in res:
        article.pop("_id")
        for report in article["reports"]:
            report["event_date"][0] = report["event_date"][0].strftime("%Y-%m-%d %H:%M:%S")
            end = report["event_date"][1]
            if (end is not None):
                report["event_date"][1] = report["event_date"][1].strftime("%Y-%m-%d %H:%M:%S")
                report['event_date'] = report['event_date'][0] + "to" + report['event_date'][1]
            else:
                report["event_date"] = report ['event_date'][0]
    
    access_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log = {'team_name': 'The Implementers', 'access_time': access_time, 'data_source': 'https://www.cdc.gov/outbreaks/index.html'}
    
    return {
        "articles": res,
        "log": log
    }



if (__name__ == "__main__"):
    res = get_articles("2021-01-01T00:00:00", "2022-03-15T00:00:00", "ebola,Listeria", "FlORIda")
    # print(res)
    # print(len(res))
    pass