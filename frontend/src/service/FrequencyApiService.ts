export const getBlockNumber = async (url: string): Promise<number> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "chain_getHeader",
        params: [],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch block number");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (data.result) {
      return Number(data.result.number);
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
