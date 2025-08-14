from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import math

app = Flask(__name__)
CORS(app)  # allow all origins and methods

OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.route('/api/overpass', methods=['POST'])
def proxy_overpass():
    data = request.get_json(force=True)
    print("Incoming data:", data)

    # Expecting 'query', 'user_lat', and 'user_lon' in request JSON
    if not data or 'query' not in data or 'user_lat' not in data or 'user_lon' not in data:
        return jsonify({'error': 'Missing required parameters: query, user_lat, user_lon'}), 400

    ov_query = data['query']
    user_lat = data['user_lat']
    user_lon = data['user_lon']

    # Forward POST to Overpass API
    resp = requests.post(OVERPASS_URL,
                         headers={'Content-Type': 'application/x-www-form-urlencoded'},
                         data=f'data={ov_query}')
    print("Overpass response status:", resp.status_code)
    if resp.status_code != 200:
        return jsonify({'error': 'Overpass API error', 'status': resp.status_code}), resp.status_code

    result = resp.json()
    elements = result.get('elements', [])

    # Calculate distance for each element and add it
    for el in elements:
        lat = el.get('lat') or el.get('center', {}).get('lat')
        lon = el.get('lon') or el.get('center', {}).get('lon')
        if lat is not None and lon is not None:
            el['distance'] = haversine(user_lat, user_lon, lat, lon)
        else:
            el['distance'] = None

    # Filter out elements without distance
    elements = [el for el in elements if el['distance'] is not None]

    # Sort by distance ascending
    elements.sort(key=lambda x: x['distance'])

    # Replace elements with sorted and augmented list
    result['elements'] = elements

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
