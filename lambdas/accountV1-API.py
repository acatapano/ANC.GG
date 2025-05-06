import json
import string
import requests

url = ".api.riotgames.com/riot/account/v1/accounts/by-riot-id/"

def lambda_handler(event, context):
    print("Received event:", event)  # Debugging print

    body = event

    # Extract parameters safely
    #region = body.get('region')
    region = "americas"
    name_tag = body.get('name_tag')
    api_key = body.get('api_key')

    if not name_tag or "#" not in name_tag:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid name_tag format. Expected "name#tag"'})
        }

    name, tag = name_tag.split("#")

    api_url = f"https://{region}{url}{name}/{tag}?api_key={api_key}"
    print(api_url)

    try:
        # Send GET request to Riot API
        resp = requests.get(api_url)
        resp.raise_for_status()  # Raise an exception for HTTP errors
        account_info = resp.json()
        print(account_info)

        response = {
            'statusCode': 200,
            'body': json.dumps(account_info)
        }
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching account info: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to fetch account info'})
        }