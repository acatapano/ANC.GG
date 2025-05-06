import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
client = boto3.client('lambda')

TABLE = "anc-gg-AccountData"

# To float converter for back:
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

# To Decimal Converter since Dynamo can't handle floats:
def convert_floats_to_decimal(obj):
    if isinstance(obj, list):
        return [convert_floats_to_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    else:
        return obj

# Checks if a name tag exists in the table and returns it:
def get_item_by_name_tag(table_name, name_tag):
    table = dynamodb.Table(table_name)
    try:
        response = table.get_item(Key={'name_tag': name_tag})
        return response.get('Item')
    except Exception as e:
        print(f"Error fetching item: {e}")
        return None

# Puts item in dynamo table:
def put_item_to_dynamodb(table_name, item):
    table = dynamodb.Table(table_name)
    try:
        item = convert_floats_to_decimal(item)
        table.put_item(Item=item)
        print("Item inserted into DynamoDB.")
    except Exception as e:
        print(f"Error inserting item: {e}")

# Function to Call Lambda w/Payload based on ARN:
def call_lambda(function_name, payload):
    response = client.invoke(
        FunctionName=function_name,
        InvocationType='RequestResponse',
        Payload=json.dumps(payload)
    )
    response_payload = json.loads(response['Payload'].read().decode('utf-8'))
    return response_payload

# Global headers for CORS
cors_headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

def lambda_handler(event, context):
    print("Event Received: ", event)
    body = event
    
    name_tag = body.get('name_tag')
    region = body.get('region')
    refresh = body.get("refresh", False)
    
    # Check if data already exists
    cached_data = get_item_by_name_tag(TABLE, name_tag)
    if cached_data and not refresh:
        print("Returning cached data.")
        print("Cached Data: ", json.dumps(cached_data, default=decimal_default))
        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps(cached_data, default=decimal_default)
        }

    try:
        # Prep input data:
        pipelineInput = {
            "name_tag": name_tag,
            "region": region
        }

        # Call the Full API Lambda Function:
        print("Calling Full Pipeline...")
        response = call_lambda('arn:aws:lambda:us-east-2:845368845469:function:anc-gg-API-Pipeline', pipelineInput)
        #print("Response: ", response)

        data = response['body']
        #print("Data: ", data)

        data['name_tag'] = name_tag
        data['region'] = region

        put_item_to_dynamodb(TABLE, data)
        print("Data inserted into DynamoDB.")

        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps(data, default=decimal_default)
        }

    except Exception as e:
        data = {
            'status': False,
            'error': str(e)
        }
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps(data)
        }
