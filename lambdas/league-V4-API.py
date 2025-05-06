import json
import string
import requests

url = ".api.riotgames.com/lol/league/v4/entries/by-puuid/"

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
        ranked_info = resp.json()
        print(ranked_info)

        # Check if the response is a list and has at least one element
        if not isinstance(ranked_info, list) or len(ranked_info) == 0:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'No ranked info found for the given puuid'})
            }
        
        # Filter out solo queue entries
        solo_queue = [entry for entry in ranked_info if entry['queueType'] == 'RANKED_SOLO_5x5']

        tier = solo_queue[0]['tier']
        rank = solo_queue[0]['rank']
        lp = solo_queue[0]['leaguePoints']
        wins = solo_queue[0]['wins']
        losses = solo_queue[0]['losses']
        hot_streak = solo_queue[0]['hotStreak']

        ranked_info = {
            'tier': tier,
            'rank': rank,
            'lp': lp,
            'wins': wins,
            'losses': losses,
            'hot_streak': hot_streak
        }

        response = {
            'statusCode': 200,
            'body': json.dumps(ranked_info)
        }
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching account info: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to fetch account info'})
        }
