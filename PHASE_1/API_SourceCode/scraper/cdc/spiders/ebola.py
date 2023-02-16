from subprocess import call
import scrapy
import w3lib.html
import re

from cdc.items import CdcArticle
from cdc.utils.report_extractor import fill_diseases, autofill_locations_from_first, fill_syndromes, insert_distinct_reports

class EbolaSpider(scrapy.Spider):
    name = 'ebola'

    # base url for outbreak articles
    base_url = 'https://www.cdc.gov'

    # start crawling from the Ebola outbreaks page
    def start_requests(self):

        url = 'https://www.cdc.gov/vhf/ebola/symptoms/index.html'
        yield scrapy.Request(url=url, callback=self.get_symptoms)

    def get_symptoms(self, response):

        symptoms = response.xpath('//div[@class="row "]//li//text()').extract()
        url = 'https://www.cdc.gov/vhf/ebola/outbreaks/index.html'
        yield scrapy.Request(url=url, callback=self.get_links, meta={'symptoms': symptoms})

    
    # crawl each of the links under the "Outbreaks" menu
    def get_links(self, response):
        outbreak_links = response.xpath("//ul[@id='nav-group-0dd0e']/li/a/@href").extract()

        # print('********* article links *********')
        for link in outbreak_links:
            # exclude icon and irrelevant links
            if ('#nav-group' in link or 'preparedness' in link or 'responder' in link):
                continue
            
            full_url = self.base_url + link
            print(full_url)
            yield scrapy.Request(url=full_url, callback=self.parse, meta={'symptoms': response.request.meta['symptoms']})
        print('*********************************')

    

    def parse(self, response):
        # print('********* article content *********')

        title = response.xpath("//h1[@id='content']/text()").extract()[0]
        # date of publication
        date = response.xpath('//meta[@property="cdc:first_published"]/@content').extract()
        # date of last update if date of publication is not available
        if (len(date) == 0):
            date = response.xpath('//meta[@property="cdc:last_updated"]/@content').extract()
        date = date[0]

        # get main content
        content = response.xpath("//*[contains(@class, 'content') and contains(@class, 'col')]").extract()
        content = content[0]

        # remove all html tags
        main_content = w3lib.html.remove_tags(content)
        main_content = main_content + str(response.request.meta['symptoms'])

        # article information without cases
        item = CdcArticle()
        item['url'] = response.request.url
        item['date_of_publication'] = date
        item['headline'] = title
        item['main_text'] = main_content
        

        item = insert_distinct_reports(item)
        item = fill_diseases(item)
        item = fill_syndromes(item)

        yield item
