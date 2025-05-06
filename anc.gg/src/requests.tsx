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