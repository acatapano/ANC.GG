import json
import string
import requests

url = ".api.riotgames.com/lol/match/v5/matches/by-puuid/"
startCount = "/ids?start=0&count=5&"

def lambda_handler(event, context):
    print("Received event:", event)  # Debugging print
    
    body = event
    
    # Extract parameters safely
    #region = body.get('region')
    region = "americas"
    puuid = body.get('puuid')
    api_key = body.get('api_key')

    api_url = f"https://{region}{url}{puuid}{startCount}api_key={api_key}"
    print(api_url)

    try:
        # Send GET request to Riot API
        resp = requests.get(api_url)
        resp.raise_for_status()  # Raise an exception for HTTP errors
        matchList = resp.json()
        print(matchList)

        response = {
            'statusCode': 200,
            'body': json.dumps(matchList)
        }
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching account info: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to fetch account info'})
        }