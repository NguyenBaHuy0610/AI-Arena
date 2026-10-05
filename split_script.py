import json
import os

with open('data/monolithic.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Write garments
os.makedirs('data/garments', exist_ok=True)
for g in data.get('garments', []):
    with open(f'data/garments/{g["id"]}.json', 'w', encoding='utf-8') as f:
        json.dump(g, f, ensure_ascii=False, indent=2)

# Write other files
def write_json(key, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data.get(key, []), f, ensure_ascii=False, indent=2)

write_json('accessories', 'data/accessories.json')
write_json('colors', 'data/colors.json')
write_json('contexts', 'data/contexts.json')
write_json('regions', 'data/regions.json')
write_json('styles', 'data/styles.json')
write_json('sources', 'data/sources.json')
write_json('reviewLog', 'data/review-log.json')
write_json('rules', 'data/rules.json')
