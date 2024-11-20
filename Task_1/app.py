from flask import Flask, request, jsonify, redirect
import requests

app = Flask(__name__)

# Sample constellation data
constellations = [
    {'id': 1, 'name': 'Orion', 'hemisphere': 'Northern', 'main_stars': ['Betelgeuse', 'Rigel', 'Bellatrix'], 'area': 594, 'origin': 'Greek'},
    {'id': 2, 'name': 'Scorpius', 'hemisphere': 'Southern', 'main_stars': ['Antares', 'Shaula', 'Sargas'], 'area': 497, 'origin': 'Greek'},
    {'id': 3, 'name': 'Ursa Major', 'hemisphere': 'Northern', 'main_stars': ['Dubhe', 'Merak', 'Phecda'], 'area': 1280, 'origin': 'Greek'},
    {'id': 4, 'name': 'Cassiopeia', 'hemisphere': 'Northern', 'main_stars': ['Schedar', 'Caph', 'Ruchbah'], 'area': 598, 'origin': 'Greek'},
    {'id': 5, 'name': 'Crux', 'hemisphere': 'Southern', 'main_stars': ['Acrux', 'Mimosa', 'Gacrux'], 'area': 68, 'origin': 'Latin'},
    {'id': 6, 'name': 'Lyra', 'hemisphere': 'Northern', 'main_stars': ['Vega', 'Sheliak', 'Sulafat'], 'area': 286, 'origin': 'Greek'},
    {'id': 7, 'name': 'Aquarius', 'hemisphere': 'Southern', 'main_stars': ['Sadalsuud', 'Sadalmelik', 'Sadachbia'], 'area': 980, 'origin': 'Babylonian'},
    {'id': 8, 'name': 'Andromeda', 'hemisphere': 'Northern', 'main_stars': ['Alpheratz', 'Mirach', 'Almach'], 'area': 722, 'origin': 'Greek'},
    {'id': 9, 'name': 'Pegasus', 'hemisphere': 'Northern', 'main_stars': ['Markab', 'Scheat', 'Algenib'], 'area': 1121, 'origin': 'Greek'},
    {'id': 10, 'name': 'Sagittarius', 'hemisphere': 'Southern', 'main_stars': ['Kaus Australis', 'Nunki', 'Ascella'], 'area': 867, 'origin': 'Greek'}
]

# Function to fetch the HTTP Cat image URL for a specific status code
def get_http_cat(status_code):
    return f"https://http.cat/{status_code}"

# 1. View all constellations
@app.route('/constellations', methods=['GET'])
def get_all_constellations():
    return jsonify(constellations), 200

# 2. View a specific constellation by name
@app.route('/constellations/<name>', methods=['GET'])
def get_constellation(name):
    constellation = next((c for c in constellations if c['name'].lower() == name.lower()), None)
    if constellation:
        return jsonify(constellation), 200
    else:
        # Redirect to the corresponding HTTP Cat image for 404 error
        return redirect(get_http_cat(404), code=302)

# 3. Add a new constellation
@app.route('/constellations', methods=['POST'])
def add_constellation():
    data = request.get_json()
    if not data:
        error_response = {
            'error': 'No data provided',
            'status_code': 400,
            'image_url': get_http_cat(400)
        }
        return jsonify(error_response), 400

    required_fields = ['name', 'hemisphere', 'main_stars', 'area', 'origin']
    for field in required_fields:
        if field not in data:
            error_response = {
                'error': f'Missing field: {field}',
                'status_code': 400,
                'image_url': get_http_cat(400)
            }
            return jsonify(error_response), 400

    if not isinstance(data['main_stars'], list) or len(data['main_stars']) == 0:
        error_response = {
            'error': "'main_stars' must be a non-empty list",
            'status_code': 400,
            'image_url': get_http_cat(400)
        }
        return jsonify(error_response), 400

    new_id = len(constellations) + 1
    new_constellation = {
        'id': new_id,
        'name': data['name'],
        'hemisphere': data['hemisphere'],
        'main_stars': data['main_stars'],
        'area': data['area'],
        'origin': data['origin']
    }
    constellations.append(new_constellation)

    return jsonify(new_constellation), 201

# 4. Delete a constellation
@app.route('/constellations/<int:id>', methods=['DELETE'])
def delete_constellation(id):
    constellation = next((c for c in constellations if c['id'] == id), None)
    
    if constellation:
        constellations.remove(constellation)
        return jsonify({'message': 'Constellation deleted successfully'}), 200
    else:
        # Redirect to the corresponding HTTP Cat image for 404 error
        return redirect(get_http_cat(404), code=302)

# 5. Filter constellations by hemisphere and area
@app.route('/constellations/filters', methods=['GET'])
def filter_constellations():
    hemisphere = request.args.get('hemisphere')
    min_area = request.args.get('min_area', type=int, default=0)
    
    filtered_constellations = [
        c for c in constellations
        if (hemisphere is None or hemisphere.lower() in c['hemisphere'].lower()) and
           c['area'] >= min_area
    ]
    
    return jsonify(filtered_constellations), 200

# 6. View the main stars of a constellation specified by name
@app.route('/constellations/<name>/stars', methods=['GET'])
def get_main_stars(name):
    constellation = next((c for c in constellations if c['name'].lower() == name.lower()), None)
    
    if constellation:
        return jsonify({'main_stars': constellation['main_stars']}), 200
    else:
        # Redirect to the corresponding HTTP Cat image for 404 error
        return redirect(get_http_cat(404), code=302)

# 7. Partially update a constellation specified by name
@app.route('/constellations/<name>', methods=['PATCH'])
def update_constellation(name):
    constellation = next((c for c in constellations if c['name'].lower() == name.lower()), None)
    
    if constellation:
        data = request.get_json()
        
        if 'main_stars' in data:
            constellation['main_stars'] = data['main_stars']
        if 'origin' in data:
            constellation['origin'] = data['origin']
        if 'area' in data:
            constellation['area'] = data['area']
        if 'hemisphere' in data:
            constellation['hemisphere'] = data['hemisphere']
        
        return jsonify(constellation), 200
    else:
        # Redirect to the corresponding HTTP Cat image for 404 error
        return redirect(get_http_cat(404), code=302)

# 8. For a constellation specified by name, view the image
# You might have to use an image generator API - try https://imagepig.com/
# Helper function to get HTTP Cat image for error codes
def get_http_cat(status_code):
    return f"https://http.cat/{status_code}"

# Function to fetch an image URL for a constellation from ImagePig
def get_constellation_image(constellation_name):
    image_pig_url = f'https://imagepig.com/api?q={constellation_name}&format=json'
    
    try:
        # Make a GET request to ImagePig
        response = requests.get(image_pig_url)
        response.raise_for_status()  # Check if the request was successful
        
        data = response.json()  # Parse the response as JSON
        
        # Check if the 'url' key is available in the response
        if 'results' in data and data['results']:
            return data['results'][0]['url']
        else:
            return None
    except requests.exceptions.RequestException as e:
        # If there's an error with the request, return None
        return None

# Endpoint to retrieve the constellation image by name
@app.route('/constellation/image', methods=['GET'])
def constellation_image():
    # Get the name parameter from the query string
    constellation_name = request.args.get('name')
    
    # If the name is not provided, return an error
    if not constellation_name:
        error_response = {
            'error': "Constellation name is required",
            'status_code': 400,
            'image_url': get_http_cat(400)  # HTTP Cat image for 400 error
        }
        return jsonify(error_response), 400
    
    # Call the helper function to get the constellation image
    image_url = get_constellation_image(constellation_name)
    
    # If an image URL is found, return it
    if image_url:
        return jsonify({"constellation": constellation_name, "image_url": image_url}), 200
    else:
        # If no image is found, return a 404 error with HTTP Cat image
        error_response = {
            'error': "Image not found for the specified constellation",
            'status_code': 404,
            'image_url': get_http_cat(404)  # HTTP Cat image for 404 error
        }
        return jsonify(error_response), 404
        
# 9. Filter constellations by origin (Query String)
@app.route('/constellations/filters/origin', methods=['GET'])
def filter_constellations_by_origin():
    # Get query parameters
    origin = request.args.get('origin')  # Optional, can be None

    # If no origin parameter is provided, return an error message
    if not origin:
        return jsonify({'error': 'Origin parameter is required'}), 400

    # Filter the constellations based on the query parameters
    filtered_constellations = [
        c for c in constellations if origin.lower() in c['origin'].lower()
    ]
    
    # Return the filtered constellations
    return jsonify(filtered_constellations), 200

# 10. Double check that all the endpoints return the appropriate status codes.
# For errors, display the status code using an HTTP Cat - https://http.cat/

if __name__ == '__main__':
    app.run(debug=True)