import json
import requests

with open('public/categories.json', encoding='utf-8') as f:
    cats = json.load(f)
with open('public/listings.json', encoding='utf-8') as f:
    listings = json.load(f)

existing = set((l['category'], l.get('subcategory', '')) for l in listings)
url = 'http://localhost:3004/api/listings'

for c in cats:
    cat_slug = c['slug']
    for sc in c.get('subCategories', []):
        if (cat_slug, sc['slug']) not in existing:
            data = {
                'title': f'Örnek İlan Başlığı - {sc["name"]}',
                'description': f'Bu bir örnek {sc["name"]} ilanıdır.',
                'price': 100,
                'category': cat_slug,
                'subcategory': sc['slug'],
                'location': 'İstanbul',
                'isPremium': False,
                'user': 'Demo',
                'email': 'demo@alo17.com'
            }
            r = requests.post(url, json=data)
            print(f'{sc["name"]}: {r.status_code}') 