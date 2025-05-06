import json
import string
import requests

url = ".api.riotgames.com/lol/match/v5/matches/"

# Team IDs:
BLUE = 100
RED = 200

# Returns Highest Multikill for Player:
def highest_multikill(data):
  if data["pentaKills"] > 0:
    return "Penta Kill"
  elif data["quadraKills"] > 0:
    return "Quadra Kill"
  elif data["tripleKills"] > 0:
    return "Triple Kill"
  elif data["doubleKills"] > 0:
    return "Double Kill"
  else:
    return "None"

# Returns team's roster:
def get_team_roster(data, teamID):
  participants = []

  for participant in data:
    if participant["teamId"] == teamID:
      participants.append(participant)
  return participants

# Returns player's KP:
def get_kill_participation(team, participant):
  player_kills = participant["kills"]
  total_kills = 0

  # Sum up the kills for all players in the team
  for player in team:
    total_kills += player["kills"]

  # Avoid division by zero and return kill participation as a float
  return round((player_kills / total_kills) * 100, 1) if total_kills > 0 else 0  # Return as percentage

# Returns player's stats:
def get_participant_stats(match_data, participant, puuid):
    result = {
      # Searched Player:
      "searchedPlayer": True if participant["puuid"] == puuid else False,

      # Match Info:
      "teamID": participant["teamId"],
      "win": participant["win"],

      # Account/Player Info:
      "summonerName": participant["riotIdGameName"],
      "role": participant["individualPosition"],

      # Summoner Spells: (ID to KEY --> https://darkintaqt.com/blog/summoner-ids for use in Data Dragon URL)
      "summonerSpell1": participant["summoner1Id"],
      "summonerSpell2": participant["summoner2Id"],

      # Runes: (ID to KEY --> https://darkintaqt.com/blog/perk-ids for use in Data or Community Dragon URL)
      "keystoneRune": participant["perks"]["styles"][0]["selections"][0]["perk"],
      "secondaryTree": participant["perks"]["styles"][1]["style"],

      # Champion Info:
      "championName": participant["championName"],
      "championID": participant["championId"],
      "champLevel": participant["champLevel"],

      # Core Stats:
      "kills": participant["kills"],
      "deaths": participant["deaths"],
      "assists": participant["assists"],
      "kda": round((participant["kills"] + participant["assists"]) / participant["deaths"], 2) if participant["deaths"] > 0 else 999,
      "killParticipation": get_kill_participation(get_team_roster(match_data["info"]["participants"], participant["teamId"]), participant),

      "damageDealt": participant["totalDamageDealtToChampions"],
      "damageTaken": participant["totalDamageTaken"],

      "cs": participant["totalMinionsKilled"] + participant["neutralMinionsKilled"],
      "csPerMin": round((participant["totalMinionsKilled"] + participant["neutralMinionsKilled"]) / (match_data["info"]["gameDuration"] / 60), 1),

      "pinkWards": participant["visionWardsBoughtInGame"],
      "wardsPlaced": participant["wardsPlaced"],
      "wardsKilled": participant["wardsKilled"],

      # Items:
      "item0": participant["item0"],
      "item1": participant["item1"],
      "item2": participant["item2"],
      "item3": participant["item3"],
      "item4": participant["item4"],
      "item5": participant["item5"],
      "wardItem": participant["item6"],

      # Wanted Player Extra Stats/Data:
      "multikill": highest_multikill(participant),
    }

    return result

# Returns whole team's stats:
def get_team_stats(team, data, puuid):
    # Gold and SearchedPlayer:
    gold = 0
    teamID = team[0]["teamId"]
    searchedPlayer = False

    for participant in team:
      gold += participant["goldEarned"]
      if puuid == participant["puuid"]:
        searchedPlayer = True

    team_index = 0 if teamID == data['info']['teams'][0]["teamId"] else 1

    stats = {
        # Booleans:
        "searchedPlayer": searchedPlayer,
        "win": data['info']['teams'][team_index]["win"],

        # Kills & Gold:
        "totalKills": data["info"]["teams"][team_index]["objectives"]["champion"]["kills"],
        "totalGold": gold,

        # Objectives:
        "barons": data["info"]["teams"][team_index]["objectives"]["baron"]["kills"],
        "dragons": data["info"]["teams"][team_index]["objectives"]["dragon"]["kills"],
        "riftHeralds": data["info"]["teams"][team_index]["objectives"]["riftHerald"]["kills"],
        "atakhan": data["info"]["teams"][team_index]["objectives"]["atakhan"]["kills"],
        "voidGrubs": data["info"]["teams"][team_index]["objectives"]["horde"]['kills'],
        "towers": data["info"]["teams"][team_index]["objectives"]["tower"]["kills"],
        "inhibitors": data["info"]["teams"][team_index]["objectives"]["inhibitor"]["kills"],
    }

    return stats

def lambda_handler(event, context):
    print("Received event:", event)  # Debugging print
    
    body = event
    
    # Extract parameters safely
    #region = body.get('region')
    puuid = body.get('puuid')
    region = "americas"
    api_key = body.get('api_key')
    matchID = body.get('matchID')

    api_url = f"https://{region}{url}{matchID}?api_key={api_key}"
    print(api_url)

    try:
        # Send GET request to Riot API
        resp = requests.get(api_url)
        resp.raise_for_status()  # Raise an exception for HTTP errors
        matchData = resp.json()
        print(matchData)

        blue_team = get_team_roster(matchData["info"]["participants"], BLUE)
        red_team = get_team_roster(matchData["info"]["participants"], RED)

        blue_team_participant_stats = []
        for participant in blue_team:
            blue_team_participant_stats.append(get_participant_stats(matchData, participant, puuid))

        red_team_participant_stats = []
        for participant in red_team:
            red_team_participant_stats.append(get_participant_stats(matchData, participant, puuid))

        wanted_data = {
            # Match Data:
            "matchData": {
                "totalGameDuration": matchData["info"]["gameDuration"],
                "gameDurationMinutes": int(matchData["info"]["gameDuration"] / 60),
                "gameDurationSeconds": int(matchData["info"]["gameDuration"] % 60),
                "gameMode": matchData["info"]["gameMode"],
                "gameType": matchData["info"]["gameType"],
            },

            "blueTeam": { 
                "stats": get_team_stats(blue_team, matchData, puuid),
                "participants": blue_team_participant_stats,
            },
            "redTeam": { 
                "stats": get_team_stats(red_team, matchData, puuid),
                "participants": red_team_participant_stats,
            },
        }

        response = {
            'statusCode': 200,
            'body': wanted_data
        }
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching account info: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to fetch account info'})
        }