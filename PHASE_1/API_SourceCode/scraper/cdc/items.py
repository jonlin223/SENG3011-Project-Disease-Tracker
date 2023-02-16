# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field
import datetime

class CdcArticle(Item):
    _id = Field()
    url = Field(serializer=str)
    date_of_publication = Field(serializer=str)
    headline = Field(serializer=str)
    main_text = Field(serializer=str)
    reports = Field(serializer=list)

class CdcReport(Item):
    diseases = Field(serializer=list)
    syndromes = Field(serializer=list)
    event_date = Field()
    locations = Field(serializer=list)

class Location(Item):
    country = Field(serializer=str)
    location = Field(serializer=str)
