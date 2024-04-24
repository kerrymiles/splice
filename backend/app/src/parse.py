import requests
import subprocess
import sys
from bs4 import BeautifulSoup
from models import URL

print(URL)

# import pathlib

# p = pathlib.Path(__file__)
# print(p)

page = requests.get(URL)

print(page.status_code)

nameAuthor = []
nameMusic = []

soup = BeautifulSoup(page.text, "html.parser")
print(soup)