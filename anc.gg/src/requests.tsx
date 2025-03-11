  export async function callPostAPIGateway(endpoint: string, requestData: any) {
    try {
      const apiUrl = 'https://hw30edagqa.execute-api.us-east-2.amazonaws.com/dev';
  
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorBody = await response.text(); // Get response body for debugging
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorBody}`);
      }
  
      return await response.json(); // Parse and return JSON response
    } catch (error) {
      console.error("API call failed:", error);
      throw error; // Re-throw for proper error handling in calling function
    }
  }

  export async function callPostLambda (requestData: any) {
    try {
      const response = await fetch('https://3fdf2v2wcofhwj6sq4lw4esfgm0xavow.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const data = await response.json() // Parse the JSON response
      console.log(data)
      return data // Return the parsed JSON data
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error(error)
      throw error // Re-throw the error to indicate failure
    }
  }
  
  export async function callGetGatewayApi (endpoint: string, requestData: any) {
    try {
      const response = await fetch(`https://2flnmxf7eh.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })
  
      if (!response.ok) {
        // Handle error
        throw new Error(`API request failed with status ${response.status}`)
      }
  
      const responseData = await response.json()
      return responseData
    } catch (error) {
      // Handle any network or other errors
      console.error('API request error:', error)
      throw error
    }
  }