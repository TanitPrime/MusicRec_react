const checkApiHealth = async (apiUrl: string) => {
    try {
      const response = await fetch(`${apiUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  export default checkApiHealth