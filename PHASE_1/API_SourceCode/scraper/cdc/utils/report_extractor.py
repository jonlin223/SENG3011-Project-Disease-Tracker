"""
This module will take information scraped by the scraper and analyse the main
content, in order to find key words, tags, dates, metadata, etc.
"""

import json
import re
from tracemalloc import start
import spacy
from datetime import date, datetime
from dateutil import parser
import en_core_web_sm

from cdc.items import CdcArticle, CdcReport, Location

def fill_location_from_list(article: CdcArticle, location_tuples: list):
    """
    If something hasn't been filled out, then take some list of
    locations which apply to the whole article and use them instead
    """
    reports = article['reports']
    for report in reports:
        if len(report['locations']) == 0:
            for loc in location_tuples:
                print(loc)
                loc_dict = {'country': loc[0], 'location': loc[1]}
                if loc_dict not in report['locations']:
                    report['locations'].append(loc_dict)
    
    return article

def autofill_locations_from_first(article: CdcArticle):
    autofill_locations = None
    for report in article['reports']:
        if len(report['locations']) != 0:
            autofill_locations = report['locations']
            break

    if autofill_locations is not None:
        loc_tuples = []
        # Convert autofill_locations into list of tuples
        for loc in autofill_locations:
            tup = (loc['country'], loc['location'])
            loc_tuples.append(tup)
            

        if autofill_locations is not None:
            article = fill_location_from_list(article, loc_tuples)
    
    return article


def insert_distinct_reports(article: CdcArticle):
    """
    Find each report in an article text made distinct by its date, and 
    create a new report for each
    """

    # Find the dates
    article_text = article['main_text']
    reports = None
    if 'reports' in article:
        report = article['reports']
    else:
        reports = []

    if reports is None:
        reports = []

    nlp = en_core_web_sm.load()
    sentences = re.split('\.|;', article_text)
    for sentence in sentences:
        sentence = sentence.replace(',', '')
        sentence = sentence.strip()
        sentence += '.'
        
        # Range of dates
        need_in_sentence = re.search('(?:ill |illness |collected |sick |confirmed |outbreak|cases)', sentence, flags=re.IGNORECASE)
        banned_from_sentence = re.search('(?:no |not |products |posted |interview)', sentence, flags=re.IGNORECASE)
        if need_in_sentence is not None and banned_from_sentence is None:
            doc = nlp(sentence)
            dates = [chunk.text for chunk in doc.ents if chunk.label_ == 'DATE']
            
            dates_with_year = []
            for date in dates:
                year_str = re.search(r'(\d{4})', date)
                if year_str is not None:
                    # A year should be ~ past 1985 for our purposes.
                    if int(year_str.group(1)) > 1985:
                        dates_with_year.append(date)

            # Cleanup each entry
            re_query = r'.*?((?:January|February|March|April|May|June|July|August|September|October|November|December|\d+).+\d+)(.*)'
            dates_cleaned = []
            for date in dates_with_year:
                # Remove leading words
                try:
                    date_regexed = re.search(re_query, date, flags=re.IGNORECASE)
                    cleaned_date = date_regexed.group(1)
                    dates_cleaned.append(cleaned_date)
                except:
                    print(f"Failed to clean up date for {article['headline']}")

            start_date = None
            end_date = None
            if len(dates_cleaned) == 1:
                # Either all in one string or two in one
                date = dates[0]
                re_query = r'to |through |-|–|and '
                if re.search(re_query, date) is not None:
                    # Is two dates
                    dates = re.split(re_query, date)
                    start_date = dates[0].strip()
                    end_date = dates[1].strip()
                else:
                    # Is one date:
                    start_date = date
            elif len(dates_cleaned) == 2:
                # We assume this is a range.
                start_date = dates_cleaned[0]
                end_date = dates_cleaned[1]

            # Try to parse both dates into a datetime.
            start_datetime = None
            end_datetime = None
            # We grab the year of the start date. If it doesn't exist, and
            # there is an end date, assume that the start date's year is the
            # same as the end dates.
            
            if start_date is not None:
                start_has_year = re.search(r'\d{4}', start_date)
                try:    
                    start_datetime = parser.parse(start_date)
                    # print(type(start_datetime))
                    if end_date is not None:
                        try:
                            end_datetime = parser.parse(end_date)
                            if start_has_year is None:
                                # Start date doesnt have a year. Add it from the end.
                                start_datetime = start_datetime.replace(year=end_datetime.year)
                        except:
                            # This is actually 2 dates
                            # Lets just yeet it lmao
                            end_date = None
                except:
                    # This is actually 2 dates
                    # Lets just yeet it lmao
                    start_date = None


            # Start exporting this report
            # Only add if later than 1985
            if start_date is not None and start_datetime > datetime.strptime('1985', '%Y'):
                print(sentence)
                print(f"START DATE: {start_datetime}")
                print(f"END DATE: {end_datetime}")
        
                # Now is there a location that attaches to this specific time range? If yes,
                # fill in. Otherwise, we can just let the general data be pulled in.
                locations = []
                for suggested_loc in doc.ents:
                    if suggested_loc.label_ == 'GPE':
                        location = Location()
                        location['country'] = ''
                        location['location'] = str(suggested_loc)
                        locations.append(location)

                # Now generate the report. Does this already exist in the reports list.
                # First make sure we're not adding a duplicate date.
                is_duplicate_date = False
                for report in reports:
                    start_dates_match = False
                    end_dates_match = False
                    # Start date should always be not null
                    if start_datetime == report['event_date'][0]:
                        start_dates_match = True
                
                    if end_datetime is not None and report['event_date'][1] is not None:
                        if end_datetime == report['event_date'][1]:
                            end_dates_match = True
                    elif end_datetime is None and report['event_date'][1] is None:
                        end_dates_match = True
                    
                    if start_dates_match and end_dates_match:
                        is_duplicate_date = True
                


                if is_duplicate_date is False:
                    report = CdcReport()
                    report['diseases'] = []
                    report['syndromes'] = []
                    report['event_date'] = (start_datetime, end_datetime)
                    report['locations'] = locations
                    reports.append(report)
            
    article['reports'] = reports
    return article

def fill_diseases(article: CdcArticle):
    # Find the mentioned diseases
    disease_list = []
    found_diseases = []
    with open('./cdc/resources/disease_list.json') as disease_f:
        diseases = json.load(disease_f)
        for row in diseases:
            disease_list.append(row)

    article_text = article['main_text']
    for disease in disease_list:
        if str(' ' + disease['name'].lower() + ' ') in article_text.lower():
            print(f"FOUND {disease}")
            found_diseases.append(disease['name'])
        else:
            if 'causes' in disease:
                for cause in disease['causes']:
                    if cause in article_text.lower() and article_text.lower().count(cause) > 2:
                        found_diseases.append(disease['name'])

    # Now add to all reports.
    for report in article['reports']:
        for disease in found_diseases:
            if disease not in report['diseases']:
                report['diseases'].append(disease)
    print(f"reports: {article['reports']}")
    return article

def fill_syndromes(article: CdcArticle):
    article_text = article['main_text']
    # Find the syndromes
    found_syndromes = []
    with open('./cdc/resources/syndrome_list.json') as syndrome_f:
        syndromes = json.load(syndrome_f)
        for row in syndromes:
            if row['name'].lower() in article_text.lower():
                found_syndromes.append(row['name'])

    for report in article['reports']:
        for syndrome in found_syndromes:
            if syndrome not in report['syndromes']:
                report['syndromes'].append(syndrome)
    
    return article

