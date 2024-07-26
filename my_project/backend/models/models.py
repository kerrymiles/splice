URL = 'https://freesound.org/search/?s=Date+added+%28newest+first%29&g=1&'

def Get(page: int):
    try:
        from my_parser import Parser
        from pprint import pprint

        parser = Parser(URL+f'page={page}')
        data = parser.get_some_html()

        pprint(f'from models.py: {pprint(data)}')

        if not isinstance(data, dict):
            raise ValueError("Returned data is not a dictionary")
        for key, value in data.items():
            if not isinstance(key, str) or not isinstance(value, list) or not all(isinstance(i, str) for i in value):
                raise ValueError("Invalid data structure")

        return data
    except Exception as e:
        print(f'ERROR in models.py: {e}')
        return []
# ! Все норм тут