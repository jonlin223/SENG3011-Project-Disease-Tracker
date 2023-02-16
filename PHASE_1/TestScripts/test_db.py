## Note: run tests with python3 -m pytest from the TestScripts directory

import pytest
import datetime
from bson.objectid import ObjectId

import os
import sys

from .article_data import data
from ..API_SourceCode.api.backend import insert_article, get_article_by_id, get_articles, drop_test_articles, set_test_mode, set_default_mode
from ..API_SourceCode.api.errors import DateError

def setup():
    drop_test_articles()
    set_test_mode()

def teardown():
    set_default_mode()

@pytest.mark.parametrize("article", data)
def test_insert_article(article):
    setup()
    ## document is inserted successfully and the article's db id is returned
    id = insert_article(article)
    assert id != None

    ## document with corresponding id now exists in db
    doc = get_article_by_id(id)
    assert doc != None
    teardown()

@pytest.mark.parametrize("article", data)
def test_get_article_by_id(article):
    setup()
    id = insert_article(article)

    doc = get_article_by_id(id)["article"]
    # check _id is not included in article object
    assert "_id" not in doc

    keys = ["url", "date_of_publication", "headline", "main_text", "reports"]

    ## correct article is returned with all required information
    for key in keys:
        if key != "reports":
            assert doc[key] == article[key]
        assert len(doc["reports"]) == len(article["reports"])
    
    teardown()
    

def test_invalid_id_err():
    ## throws error given article id that is invalid (not of type ObjectId)
    with pytest.raises(ValueError):
        get_article_by_id("invalidid")


def test_get_articles():
    setup()
    
    for article in data:
        insert_article(article)

    # query that matches all dummy data
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", "ebola,listeria,measles,bacterial meningitis", ".*")
    docs = docs["articles"]
    assert len(docs) == len(data)

    keys = ["url", "date_of_publication", "headline", "main_text", "reports"]

    ## returned documents contain the correct fields
    for doc in docs:
        for key in keys:
            assert key in doc
            assert doc[key] != None
    

    ##  date range filter  ##
    docs = get_articles("2018-01-01T00:00:00", "2018-12-31T00:00:00", ".*", ".*")
    docs = docs["articles"]

    heading1 = "Notes from the Field: Community Outbreak of Measles — Clark County, Washington, 2018–2019"
    heading2 = "Outbreak of Listeria Infections Linked to Deli Meats"
    heading3 = "Bacterial Meningitis"
    
    assert len(docs) == 1
    article = docs[0]
    assert article["headline"] == heading1
    docs = get_articles("2018-01-01T00:00:00", "2021-01-28T00:00:00", ".*", ".*")
    docs = docs["articles"]

    assert len(docs) == 2

    headings = docs[0]["headline"] + " " + docs[1]["headline"]
    assert heading1 in headings
    assert heading2 in headings

    ##  disease and syndrome filters  ##
    # all articles
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", "ebola,listeria,measles,bacterial meningitis", ".*")
    docs = docs["articles"]

    assert len(docs) == len(data)

    # case insensitive search
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", "ebOLA,LISTeria,Measles,Bacterial Meningitis", ".*")
    docs = docs["articles"]

    assert len(docs) == len(data)

    # one article - disease
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", "measles", ".*")
    docs = docs["articles"]

    assert len(docs) == 1
    assert docs[0]["headline"] == heading1

    # one article - syndrome
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", "bacterial meningitis", ".*")
    docs = docs["articles"]

    assert len(docs) == 1
    assert docs[0]["headline"] == heading3

    ##  location filter  ##
    # country
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", ".*", "Congo")
    assert len(docs["articles"]) == 1

    # location
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", ".*", "North Kivu")
    assert len(docs["articles"]) == 1

    # case insensitive search
    docs = get_articles("2000-01-01T00:00:00", "2022-01-01T00:00:00", ".*", "CONGO")
    assert len(docs["articles"]) == 1

    # date range test
    docs = get_articles("2014-03-23T00:00:00", "2016-03-16T00:00:00", ".*", "West Africa")
    assert len(docs["articles"]) == 1

    teardown()


def test_invalid_date_range():
    ## throws error given start date that is later than end date
    with pytest.raises(DateError):
        get_articles("2022-01-01T00:00:00", "2000-01-01T00:00:00", ".*", ".*")

def test_invalid_date_format():
    ## throws error given dates with the wrong format (not yyyy-MM-ddTHH:mm:ss)
    with pytest.raises(ValueError):
        get_articles("2022-01-01 00:00:00", "2000-01-01 00:00:00", ".*", ".*")