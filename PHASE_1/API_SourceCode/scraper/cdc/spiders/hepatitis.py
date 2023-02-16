from numpy import insert
import scrapy

from cdc.items import CdcArticle
from cdc.utils.report_extractor import autofill_locations_from_first, insert_distinct_reports, fill_syndromes, fill_diseases

class HepatitisSpider(scrapy.Spider):
    
    name = 'hepatitis'
    BASE_URL = 'https://www.cdc.gov'
      
    def start_requests(self):
        url = 'https://www.cdc.gov/hepatitis/outbreaks/hepatitisaoutbreaks.htm' 
        yield scrapy.Request(url=url, callback=self.get_links)

    def get_links(self, response):
        
        outbreaks_links = response.xpath('//div[@class="col-md-12"]/ul/li/a/@href | //div[@class="card-body bg-secondary"]/ul/li/a/@href').extract()
        for link in outbreaks_links:
            full_url = self.BASE_URL + link
            print(full_url + ": Added to scraping list")
            yield scrapy.Request(url=full_url, callback=self.parse)

    def parse(self, response):
        
        headline_text_fields = response.xpath('//h1[@id="content"]//text()').extract()
        headline = ''.join(headline_text_fields)
        dop = response.xpath('//meta[@property="cdc:first_published"]/@content | //div[@class="card-body p-0"]//div[@class="fs0875"]/text() | //d[@class="newupdated-outbreak"]').extract_first()
        if dop is None:
            dop = response.xpath('//meta[@name="cdc:last_published"]/@content').extract_first()
        main_text = response.xpath('//div[@class="syndicate"]//text()').extract()
        raw_body_text = ''.join(main_text)

        item = CdcArticle()
        item['url'] = response.request.url
        item['date_of_publication'] = dop
        item['headline'] = headline
        item['main_text'] = raw_body_text
        
        item = insert_distinct_reports(item)
        item = fill_diseases(item)
        item = fill_syndromes(item)
        item = autofill_locations_from_first(item)


        yield item