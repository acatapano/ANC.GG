import json
import string
import requests

url = ".api.riotgames.com/lol/summoner/v4/summoners/by-puuid/"

def lambda_handler(event, context):
    print("Received event:", event)  # Debugging print

    body = event

    # Extract parameters safely
    api_key = body.get('api_key')
    puuid = body.get('puuid')
    #region = body.get('region')
    region = 'na1'

    api_url = f"https://{region}{url}{puuid}?api_key={api_key}"
    print(api_url)

    try:
        # Send GET request to Riot API
        resp = requests.get(api_url)
        resp.raise_for_status()  # Raise an exception for HTTP errors
        summoner_info = resp.json()
        print(summoner_info)

        response = {
            'statusCode': 200,
            'body': json.dumps(summoner_info)
        }
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching account info: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to fetch account info'})
        }