# read components_data_copy.json

import json
import random

# read json file
def read_json_file(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

# loop through potions in json file and replace the strength, dexterity, and intelligence values with random values
def replace_values(data):
    for potion in data:
        potion['strength'] = random.randint(-5, 5)
        potion['dexterity'] = random.randint(-5, 5)
        potion['agility'] = random.randint(-5, 5)
    return data



data = read_json_file('components_data_copy.json')
data['potions'] = replace_values(data['potions'])

with open('components_data_copy.json', 'w') as f:
    json.dump(data, f, indent=4)