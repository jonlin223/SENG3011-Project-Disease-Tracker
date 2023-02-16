import json
import scrapy
import re

from cdc.items import CdcArticle
from cdc.utils.report_extractor import insert_distinct_reports, fill_diseases, fill_location_from_list, fill_syndromes




class ListeriaSpider(scrapy.Spider):
    
    # This scraper was the hardest thing i've ever done, and this is literally
    # my job at work.
    
    name = 'listeria'
    BASE_URL = 'https://www.cdc.gov'
    custom_settings = {"HTTPERROR_ALLOWED_CODES": [404]}
    map_codes = {
                'AL': 'ALABAMA',
                'AK': 'ALASKA',
                'AZ': 'ARIZONA',
                'AR': 'ARKANSAS',
                'CA': 'CALIFORNIA',
                'CO': 'COLORADO',
                'CT': 'CONNECTICUT',
                'DE': 'DELAWARE',
                'FL': 'FLORIDA',
                'GA': 'GEORGIA',
                'HI': 'HAWAII',
                'ID': 'IDAHO',
                'IL': 'ILLINOIS',
                'IN': 'INDIANA',
                'IA': 'IOWA',
                'KS': 'KANSAS',
                'KY': 'KENTUCKY',
                'LA': 'LOUISIANA',
                'ME': 'MAINE',
                'MD': 'MARYLAND',
                'MA': 'MASSACHUSETTS',
                'MI': 'MICHIGAN',
                'MN': 'MINNESOTA',
                'MS': 'MISSISSIPPI',
                'MO': 'MISSOURI',
                'MT': 'MONTANA',
                'NE': 'NEBRASKA',
                'NV': 'NEVADA',
                'NH': 'NEW HAMPSHIRE',
                'NJ': 'NEW JERSEY',
                'NM': 'NEW MEXICO',
                'NY': 'NEW YORK',
                'NC': 'NORTH CAROLINA',
                'ND': 'NORTH DAKOTA',
                'OH': 'OHIO',
                'OK': 'OKLAHOMA',
                'OR': 'OREGON',
                'PA': 'PENNSYLVANIA',
                'RI': 'RHODE ISLAND',
                'SC': 'SOUTH CAROLINA',
                'SD': 'SOUTH DAKOTA',
                'TN': 'TENNESSEE',
                'TX': 'TEXAS',
                'UT': 'UTAH',
                'VT': 'VERMONT',
                'VA': 'VIRGINIA',
                'WA': 'WASHINGTON',
                'WV': 'WEST VIRGINIA',
                'WI': 'WISCONSIN',
                'WY': 'WYOMING'
                }

    def start_requests(self):
        """
        Start scraping at the page listing all Listeria outbreaks
        """
        symptoms_url = 'https://www.cdc.gov/listeria/symptoms.html'
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0'}
        yield scrapy.Request(url=symptoms_url, callback=self.get_symptoms)

        # Now get symptoms list

    def get_symptoms(self, response):
        text = response.xpath('//div[@class="col content "]//text()').extract()
        text = ' '.join(text)
        # Find the mentioned syndromes.
        syndrome_list = []
        with open('./cdc/resources/syndrome_list.json') as disease_f:
            syndromes = json.load(disease_f)
            for row in syndromes:
                syndrome_list.append(row['name'])

        found_syndromes = []
        for syndrome in syndrome_list:
            if syndrome.lower() in text.lower():
                found_syndromes.append(syndrome)
        print(found_syndromes)
        
        outbreaks_url = 'https://www.cdc.gov/listeria/outbreaks/index.html'
        yield scrapy.Request(url=outbreaks_url, callback=self.get_links, meta = {'symptoms': found_syndromes})

    def get_links(self, response):
        """
        Get the link of each Listeria outbreak article
        """
        outbreaks_links = response.xpath('//div[@class="card-body bg-white"]/ul/li/a/@href').extract()
        for link in outbreaks_links:
            full_url = self.BASE_URL + link
            print(full_url + ": Added to scraping list")
            yield scrapy.Request(url=full_url, callback=self.parse_base_page, meta = {'symptoms': response.request.meta['symptoms']})

    def parse_base_page(self, response):
        """
        Extract info from the listeria article. Then, find the URL for the
        page containing the case info for this outbreak and redirect to that.
        """
        print("================================================================")
        print(response.request.url)
        headline_text_fields = response.xpath('//h1[@id="content"]//text()').extract()
        headline = ''.join(headline_text_fields)
        dop = response.xpath('//*[contains(text(), "Posted ")]/text()').extract_first()
        main_text = response.xpath('//div[@class="syndicate"]//text()').extract()
        raw_body_text = ''.join(main_text)
        symptoms = response.request.meta['symptoms']
        # Add the symptoms to the body so they are picked up later
        raw_body_text += str(symptoms)

        item = CdcArticle()
        item['url'] = response.request.url
        item['date_of_publication'] = dop
        item['headline'] = headline
        item['main_text'] = raw_body_text
        
        item = insert_distinct_reports(item)
        item = fill_diseases(item)
        item = fill_syndromes(item)


        # Sometimes info is on this optional subpage
        investigation_details_url = response.xpath('//div[@class="syndicate"]//a[contains(@href, "details.html")]/@href').extract_first()
        map_url = response.xpath('//div[@class="syndicate"]//a[contains(@href, "map")]/@href').extract_first()

        if investigation_details_url is not None:
            # There is an investigation details page.
            full_url = self.BASE_URL + investigation_details_url
            yield scrapy.Request(url=full_url, callback=self.parse_details_page, meta={'cdc_article': item, 'map_url': map_url})
        else:
            # No investigation details page.
            if map_url is not None:
                # Map page does exist
                map_url = self.BASE_URL + map_url
                yield scrapy.Request(url=map_url, callback=self.parse_html_table, meta={'cdc_article': item})
            else:
                # No map page exists. Find map data on this page.
                state_re = r'([a-zA-Z]+) \(\d+\)'
                states = re.findall(state_re, raw_body_text)
                locs = []
                for state in states:
                    # item['reports'] = self.fill_location(item['reports'], state)
                    location = ("US", state)
                    locs.append(location)
                item = fill_location_from_list(item, locs)
                    
                yield item


    def parse_details_page(self, response):
        text = response.xpath('//div[@class="syndicate"]//text()').extract()
        text = ' '.join(text)
        item = response.request.meta['cdc_article']
        item['main_text'] = item['main_text'] + str(text)
        item = insert_distinct_reports(item)
        item = fill_diseases(item)

        

        # Is there a map page?
        map_url = response.request.meta['map_url']
        if map_url is not None:
            # Map page does exist
            map_url = self.BASE_URL + map_url
            yield scrapy.Request(url=map_url, callback=self.parse_html_table, meta={'cdc_article': item})
        else:
            # No map page exists. Find map data on this page.
            state_re = r'([a-zA-Z]+) \(\d+\)'
            states = re.findall(state_re, item['main_text'])
            locs = []
            for state in states:
                location = ("US", state)
                locs.append(location)
            item = fill_location_from_list(item, locs)
                
            yield item

    def parse_html_table(self, response):
        """
        Start by assuming that the case information is stored in a regular 
        HTML table. If this fails, then try the URL that would link to the 
        JSON case location file if it exists.
        """
        old_item = response.request.meta['cdc_article']


        rows = response.xpath('(//table)[1]//tr')
        if len(rows) != 0:
            # I.E. if this xpath is actually working
            print(response.request.url + ": Getting regular HTML table.")
            locs = []
            for row in rows:
                pair = row.xpath('(.//th[@scope!="col"]/text()) | (.//td/text())').extract()
                # If the xpath for this pair actually picked something up (i.e. not header or footer):
                if len(pair) != 0:
                    state = pair[0]
                    count = pair[1]
                    if count.isnumeric():
                        # This stops the header row being added.
                        location = ("US", state)
                        locs.append(location)
            old_item = fill_location_from_list(old_item, locs)

            print(response.request.url + ": Success.")
            yield old_item
        else:
            print(response.request.url + " HTML Failed...")
            # We have to now check if the map data is given as a JSON instead.
            old_url = response.request.url
            new_url = old_url.replace('map.html', 'modules/outbreak-map.json')
            print(response.request.url + ": Will now redirect to " + old_url)
            yield scrapy.Request(url=new_url, callback=self.get_map_json, meta={'cdc_article': old_item, 'original_url': old_url})


    def get_map_json(self, response):
        """
        Try to get the JSON file and parse it. If this response returns a 404
        code, then this article's case location info is not stored in a JSON, 
        and must be stored in the original map link but just as plain text.
        """
        print(response.request.url + ": Tring to get as JSON.")
        old_item = response.request.meta['cdc_article']

        if response.status != 404:
            json_data = json.loads(response.text)
            main_text_string = old_item['main_text']
            locs = []
            for data in json_data['data']:
                state = None
                try:
                    state = self.map_codes[data['State of Residence']]
                except:
                    state = self.map_codes[data['STATE']]

                # old_item['reports'] = self.fill_location(old_item['reports'], state)
                location = ("US", state)
                locs.append(location)
            old_item = fill_location_from_list(old_item, locs)                


            old_item['main_text'] = main_text_string
            print(response.request.url + ": Success.")
            yield old_item

        else:
            print(response.request.url + " JSON Failed")
            print(response.request.meta['original_url'])
            yield scrapy.Request(url=response.request.meta['original_url'], callback=self.parse_raw_html, meta={'cdc_article': old_item}, dont_filter=True)


    def parse_raw_html(self, response):
        """
        Get the plain text of the map page, which will contain case number
        information.
        """
        print(response)
        print(response.request.url + ": Trying to get as raw body text.")
        # If it isn't in an HTML table, nor is there a JSON response, then
        # the data must just be stored in plaintext in the original map URL.
        old_item = response.request.meta['cdc_article']
        text = response.xpath('//div[@class="card-body bg-white"]//text()').extract()
        body = ' '.join(text)
        main_text_string = old_item['main_text']
        main_text_string += body
        old_item['main_text'] = main_text_string

        # Now lets get report data
        old_item = insert_distinct_reports(old_item)
        old_item = fill_diseases(old_item)


        
        state_re = r'([a-zA-Z]+) \(\d+\)'
        main_regexed = re.findall(state_re, main_text_string)
        print(old_item['reports'])
        locs = []
        for state in main_regexed:
            location = ("US", state)
            locs.append(location)

        old_item = fill_location_from_list(old_item, locs)
        yield old_item
