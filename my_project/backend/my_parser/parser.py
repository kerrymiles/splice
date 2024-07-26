import requests
from bs4 import BeautifulSoup
import re

from fake_useragent import UserAgent

class Parser():
    def __init__(self, url):
        self.url = url
    
    def get_some_html(self):
        try:
            ua = UserAgent()
            fake_ua = ua.random

            headers = {'User-Agent': fake_ua}
            
            response = requests.get(url=self.url, headers=headers, timeout=10)
            response.encoding = 'utf-8'

            soup = BeautifulSoup(response.text, 'lxml')
            element_names = soup.find_all('div', {'data-title': True})

            sounds = [element['data-title'] for element in element_names]

            divs = soup.find_all('div')
            mp3refs = [div['data-mp3'] for div in divs if 'data-mp3' in div.attrs]

            pattern = re.compile(r'^/people/[\w-]+/$')
            authors = [a['href'][8:][:-1] for a in soup.find_all('a', href=pattern)]

            list_sounds = []
            list_authors = []

            for sound in sounds: 
                list_sounds.append(sound)

            for author in authors:
                list_authors.append(author)

            data = {
                'sounds': list_sounds,
                'authors': list_authors,
                'mp3refs': mp3refs,
            }

            return data

        except Exception as e:
            print(f'ERROR in parser.py: {e}')
            return []
        
# ! Тут все норм