from flask import Flask, request, jsonify, redirect
from requests_oauthlib import OAuth2Session
import os
import requests

app = Flask(__name__)

# Part 1: Basic Authentication
valid_username = "Vaibhav"
valid_password = "password123"

@app.route('/basic-auth')
def basic_auth():
    # Access the credentials sent in the request (if any)
    auth = request.authorization

    # Check if the authorization credentials are provided
    if not auth or auth.username != valid_username or auth.password != valid_password:
        return jsonify({"message": "Authentication failed!"}), 401  # HTTP 401 means Unauthorized

    # If credentials are correct, return a success message
    return jsonify({"message": "You are authenticated!"})

# Part 2: Bearer Token Authentication
VALID_BEARER_TOKEN = "mysecrettoken123"

@app.route('/bearer-auth')
def bearer_auth():
    # Retrieve the Authorization header from the request
    auth_header = request.headers.get('Authorization')

    # Check if the Authorization header is present and starts with 'Bearer '
    if auth_header is None or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Missing or invalid Authorization header!"}), 401
    
    # Extract the token from the header (remove 'Bearer ' prefix)
    token = auth_header.split(' ')[1]

    # Check if the token is valid
    if token != VALID_BEARER_TOKEN:
        return jsonify({"message": "Authentication failed!"}), 401  # Invalid token

    # If the token is valid, return success message
    return jsonify({"message": "You are authenticated!"}), 200


# Correctly indented if block


# Secret key to store session data (used by Flask)
app.secret_key = os.urandom(24)


# GitHub OAuth configuration
CLIENT_ID = "Ov23liH2L4Wu9qMRmO2T"
CLIENT_SECRET = "a9ff4d88c3b1f37798454fd9a1d3d34a70a822da"
AUTHORIZATION_BASE_URL = "https://github.com/login/oauth/authorize"
TOKEN_URL = "https://github.com/login/oauth/access_token"
API_BASE_URL = "https://api.github.com/user"

# Route to start GitHub OAuth flow
@app.route('/oauth', methods=['GET'])
def oauth():
    """
    Redirect the user to GitHub's OAuth authorization page.
    """
    # Generate the GitHub OAuth authorization URL with the necessary parameters
    github_authorization_url = f"{AUTHORIZATION_BASE_URL}?client_id={CLIENT_ID}&scope=user"
    return redirect(github_authorization_url)

# Callback route that GitHub will redirect to after user authorization
@app.route('/callback', methods=['GET'])
def callback():
    """
    Handle the GitHub OAuth callback by exchanging the authorization code
    for an access token and fetching the user's GitHub profile.
    """
    # GitHub redirects here with a `code` query parameter after the user authorizes
    code = request.args.get('code')
    if not code:
        return jsonify({"message": "Authorization code is missing."}), 400
    
    # Exchange the authorization code for an access token
    response = requests.post(TOKEN_URL, data={
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    }, headers={'Accept': 'application/json'})
    
    # Parse the response from GitHub to extract the access token
    token_data = response.json()
    access_token = token_data.get('access_token')
    
    if not access_token:
        return jsonify({"message": "Unable to fetch access token."}), 400
    
    # Use the access token to get the user's GitHub profile
    user_response = requests.get(API_BASE_URL, headers={'Authorization': f'token {access_token}'})
    
    if user_response.status_code == 200:
        user_data = user_response.json()
        return jsonify({
            "message": "Welcome to my website!",
            "user": user_data
        }), 200
    else:
        return jsonify({"message": "Failed to fetch user data."}), 500

if __name__ == '__main__':
    app.run(debug=True)
