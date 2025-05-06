import json
import boto3

client = boto3.client('lambda')

# Function to Call Lambda w/Payload based on ARN:
def call_lambda(function_name, payload):
    response = client.invoke(
        FunctionName=function_name,
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )
    response_payload = json.loads(response['Payload'].read().decode('utf-8'))
    return response_payload

def lambda_handler(event, context):
    print("Event Received: ", event)
    
    body = event

    try:
        # Call retrieveKey Lambda:
        print("Calling retrieveKey Lambda...")
        retrieveKeyResponse = call_lambda(
            'arn:aws:lambda:us-east-2:845368845469:function:retrieveKey',
            event  # just send event as-is, no need to re-encode
        )
        print("retrieveKeyResponse:", retrieveKeyResponse)

        if retrieveKeyResponse['statusCode'] != 200:
            raise Exception(retrieveKeyResponse.get('body', 'Unknown error'))

        # Get API key from response:
        api_key = retrieveKeyResponse['body']['key']

        # Prep account-V1 payload:
        accountV1Data = {
            'api_key': api_key,
            'region': body.get('region'),
            'name_tag': body.get('name_tag')
        }

        print("accountV1: ", accountV1Data)

        print("Calling accountV1 Lambda...")
        accountV1Response = call_lambda(
            'arn:aws:lambda:us-east-2:845368845469:function:accountV1-API',
            accountV1Data
        )

        if accountV1Response['statusCode'] != 200:
            raise Exception(accountV1Response['body'])

        print(accountV1Response['body'])

        account_info = json.loads(accountV1Response['body'])
        # Get neccesary accountV1 data for player:
        PUUID = account_info['puuid']
        gameName = account_info['gameName']
        tagLine = account_info['tagLine']

        # Prep summonerV4 payload:
        summonerV4Data = {
            'api_key': api_key,
            'region': body.get('region'),
            'puuid': PUUID
        }

        print("summonerV4: ", summonerV4Data)

        print("Calling summonerV4 Lambda...")
        summmonerV4Response = call_lambda(
            'arn:aws:lambda:us-east-2:845368845469:function:summonerV4-API',
            summonerV4Data
        )

        if summmonerV4Response['statusCode'] != 200:
            raise Exception(summmonerV4Response['body'])

        print(summmonerV4Response['body'])

        summoner_info = json.loads(summmonerV4Response['body'])
        # Get neccessary data from summonerV4:
        profileIconId = summoner_info['profileIconId']
        summonerLevel = summoner_info['summonerLevel']

        # Prep leagueV4 payload:
        leagueV4Data = {
            'api_key': api_key,
            'region': body.get('region'),
            'puuid': PUUID
        }

        print("Calling leagueV4 Lambda...")
        leagueV4Response = call_lambda(
            'arn:aws:lambda:us-east-2:845368845469:function:league-V4-API',
            leagueV4Data
        )

        if leagueV4Response['statusCode'] != 200:
            raise Exception(leagueV4Response['body'])

        print(leagueV4Response['body'])
        
        league_info = json.loads(leagueV4Response['body'])
        # Get neccessary data from leagueV4:
        tier = league_info['tier']
        rank = league_info['rank']
        lp = league_info['lp']
        wins = league_info['wins']
        losses = league_info['losses']
        hotStreak = league_info['hot_streak']

        # Call getMatches-matchV5 Lambda:
        print("Calling getMatches-matchV5 Lambda...")

        # Prep getMatches-matchV5 payload:
        getMatchesData = {
            'api_key': api_key,
            'region': body.get('region'),
            'puuid': PUUID
        }

        getMatchesResponse = call_lambda(
            'arn:aws:lambda:us-east-2:845368845469:function:getMatches-matchV5-API',
            getMatchesData
        )
        print("getMatchesResponse:", getMatchesResponse)

        if getMatchesResponse['statusCode'] != 200:
            raise Exception(getMatchesResponse.get('body', 'Unknown error'))

        matches_info = json.loads(getMatchesResponse['body'])
        # Get list of matches:
        matches = matches_info
        print("matches:", matches)
        
        # Empty list of match data:
        allMatchContents = []

        # Begin Loop for Match Data Retrieval:
        for match in matches:
            print(f"Calling getMatchData-matchV5 Lambda for {match}...")
            # Prep getMatchData-matchV5 payload:
            getMatchesInfoData = {
                'api_key': api_key,
                'matchID': match,
                'region': body.get('region'),
                'puuid': PUUID
            }

            matchInfoResponse = call_lambda(
            'arn:aws:lambda:us-east-2:845368845469:function:getMatchData-matchV5-API',
            getMatchesInfoData
            )

            if matchInfoResponse['statusCode'] != 200:
                raise Exception(matchInfoResponse.get('body', 'Unknown error'))
            
            print("matchInfoResponse:", matchInfoResponse)

            allMatchContents.append(matchInfoResponse['body'])

        data = {
            'puuid': PUUID,
            'gameName': gameName,
            'tagLine': tagLine,
            'profileIconId': profileIconId,
            'summonerLevel': summonerLevel,
            'tier': tier,
            'rank': rank,
            'lp': lp,
            'wins': wins,
            'losses': losses,
            'hotStreak': hotStreak,
            'matches': allMatchContents
        }
        print("data:", data)
        return {
            "statusCode": 200,
            "headers": { "Content-Type": "application/json" },
            "body": data
        }

    except Exception as e:
        data = {
            'status': False,
            'error': str(e)
        }
        return {
            'statusCode': 500,
            'body': json.dumps(data)
        }