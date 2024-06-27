import googlemaps
import json, os, time
import dotenv
import math

dotenv.load_dotenv()

def get_places(location, radius, place_type):
    gmaps = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))
    places_data = []
    response = gmaps.places_nearby(location={'lat':location[0], 'lng':location[1]}, radius=radius, type=place_type)
    places_data.extend(response['results'])

    locations = []
    for place in places_data:
        name = place.get('name')
        lat = place['geometry']['location']['lat']
        lng = place['geometry']['location']['lng']
        distance = haversine(location[0], location[1], lat, lng)
        locations.append({"user_name": name, "location":[lat, lng], "distance": distance})
        locations = sorted(locations, key=lambda x: x['distance'])

    return locations


def haversine(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    r = 6371  # Radius of Earth in kilometers. Use 3956 for miles. Determines return value units.
    return r * c

    
# print(get_places([42.34580914708963, -71.07590585947037], 15000, 'restaurant'))