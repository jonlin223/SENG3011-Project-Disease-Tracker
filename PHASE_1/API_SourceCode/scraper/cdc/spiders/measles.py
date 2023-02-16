from numpy import insert
import scrapy

from cdc.items import CdcArticle
from cdc.utils.report_extractor import autofill_locations_from_first, insert_distinct_reports, fill_diseases, fill_syndromes


class MeaslesSpider(scrapy.Spider):
    name = 'measles'
    base_url = 'https://www.cdc.gov'

    def start_requests(self):
        url = 'https://www.cdc.gov/measles/cases-outbreaks.html'
        yield scrapy.Request(url=url, callback=self.get_links)

    def get_links(self, response):
        links = response.xpath('//a[contains(@href,"/mmwr")]/@href').extract()
        for link in links:
            if link.startswith(self.base_url):
                full_url = link
            else:
                full_url = self.base_url + link
            print(full_url) 
            yield scrapy.Request(url=full_url,callback=self.parse)

    def parse(self, response):
        
        # If statement for per 2015
        if "/mmwrhtml/" in response.request.url:
            headline_text_fields = response.xpath('//div[@class="mSyndicate"]/h1//text()').extract()
            headline = ' '.join(headline_text_fields)
            #print(headline)

            date_day = response.xpath('//meta[@name="Day"]/@content').extract()
            date_month= response.xpath('//meta[@name="Month"]/@content').extract()
            date_year = response.xpath('//meta[@name="Year"]/@content').extract()
            date = date_day[0] + '-' + date_month[0] + '-' + date_year[0]
            #print(date)

            text_fields = response.xpath('//div[@class="mSyndicate"]//text()').extract()
            text = ' '.join(text_fields)

        else:
            headline = response.xpath('//meta[@name="citation_title"]/@content').extract()[0]
            #print(headline)

            dateline = response.xpath('//div[@class="dateline"]/p/text()').extract()
            #print(dateline[0])
            dateline_list = dateline[0].split("/")
            date = dateline_list[1].strip()

            text_fields = response.xpath('//div[@class="d-flex flex-wrap d-md-block"]//text()').extract()
            text = ' '.join(text_fields)
            
        # else post 2015

        item = CdcArticle()
        item['url'] = response.request.url
        item['date_of_publication'] = date
        item['headline'] = headline
        item['main_text'] = text

        item = insert_distinct_reports(item)
        item = fill_diseases(item)
        item = fill_syndromes(item)
        item = autofill_locations_from_first(item)

        yield item
