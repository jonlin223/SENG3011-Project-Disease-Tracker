import requests
import json

API_KEY = '98123972be2748b4a865736793a2ad4b'

# get query string that matches any of given key terms
# and the given location
def get_key_terms_query(key_terms, location):
    key_terms = key_terms.split()
    return ' OR '.join(key_terms) + f' AND {location}'

def get_news_articles(start_date, end_date, key_terms, location):
    # Note: we have not included start and end in the query
    # as the free tier for News API limits results to the past month
    url = f'''https://newsapi.org/v2/everything?apiKey={API_KEY}&language=en&q={get_key_terms_query(key_terms, location)}&pageSize=100'''
    
    response = requests.get(url + '&page=1')
    articles = response.json()['articles']
    
    # no results
    if (response.json()['status'] != 'ok'):
        return {
            "articles": []
        }

    # free accounts limited to 100 results
    # the following can be used to get all articles with a paid account
    '''
    page = 2
    while (True):
        response = requests.get(url + f'&page={page}')
        if (response.json()['status'] == 'ok'):
            articles += response.json()['articles']
            page += 1
        else:
            break
    '''

    # format article to be more consistent with CDC API
    formatted_articles = []
    for article in articles:
        formatted_article = {
            'url': article['url'],
            'date_of_publication': article['publishedAt'],
            'headline': article['title'],
            'source': article['source']['name'],
            'image': article['urlToImage'],
            'locations': [location],
            'disease': key_terms,
        }
        formatted_articles.append(formatted_article)

    return {
        "articles": formatted_articles
    }