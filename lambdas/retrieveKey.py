import json
import boto3

REGION = 'us-east-2'
SECRET = 'api_key' # Title of secret

def lambda_handler(event, context):
    try:
        secrets_manager = boto3.client("secretsmanager", region_name=REGION)
        secret_response = secrets_manager.get_secret_value(SecretId=SECRET) # Replace "test" w/title of secret.

        if 'SecretString' in secret_response:
            secret = secret_response['SecretString']
            dict = json.loads(secret)
            secretText = dict[SECRET] # Replace test w/title of secret.
            data = {
                "statusCode": 200,
                "body": { "key": secretText }
            }
            return json.loads(json.dumps(data))

    except Exception as e:
        data = {
            'status' : False,
            'error' : e
        }
        return json.loads(json.dumps(data))

if __name__ == '__main__':
    event = {"retrieve": True}
    print(lambda_handler(event, None))