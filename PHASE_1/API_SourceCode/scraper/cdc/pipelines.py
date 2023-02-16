# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface

import re
from cdc.items import CdcReport
from dateutil import parser
import sys
import os
import sys

# This sets up the path for the scraper to run code from outside its dir
sys.path.append('../')
from api.backend import insert_article


class CdcPipeline:    
    def remove_unformatted_chars(self, text: str):
        """
        Replaced \r, \n, \t with their actual formatted characters.
        """ 
        updated_text = re.sub(r'\r?\n', ' ', text)
        updated_text = re.sub(r'\t', ' ', updated_text)
        return updated_text



    def process_item(self, item, spider):
        item['main_text'] = self.remove_unformatted_chars(item['main_text'])
        dop = ""
        print(item['date_of_publication'])
        try:
            re_query = r'((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}[\s,]*\d{4})'
            dop_regexed = re.search(re_query, item['date_of_publication'])
            dop = dop_regexed.group(1)
        except:
            try:
                re_query = r'((?:January|February|March|April|May|June|July|August|September|October|November|December)[ ,]*\d{4}[\s,]*\d{1,2})'
                dop_regexed = re.search(re_query, item['date_of_publication'])
                dop = dop_regexed.group(1)
            except:
                re_query = r'(\d{1,2}[ ,]*(?:January|February|March|April|May|June|July|August|September|October|November|December)[ ,]*\d{4})'
                dop_regexed = re.search(re_query, item['date_of_publication'])
                dop = dop_regexed.group(1)
        dop_datetime = parser.parse(dop)
        dop_str = dop_datetime.strftime("%Y-%m-%d %H-%M-%S")
        item['date_of_publication'] = dop_str
        return item

class MongoDBPipeline:
    def process_item(self, item, spider):
        # print("%%%%%%%%%%%%%%%%%%%%")
        # doc_id = insert_article(item)
        # print(doc_id)
        # print("%%%%%%%%%%%%%%%%%%%%")
        return item
