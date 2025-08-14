const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getTourData() {
  try {
    const response = await fetch(
      `${apiBaseUrl}/tour-packages/get-tour-packages`,
      {
        method: "GET",
        credentials: "include", // browser includes cookies automatically
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tour data");
    }

    const data = await response.json();
    console.log("Tour data response:", data);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching tour data:", error);
    return [];
  }
}

export async function getDestinationData() {
  try {
    const response = await fetch(
      `${apiBaseUrl}/tour-packages/get-destinations`,
      {
        method: "GET",
        credentials: "include", // ensures cookies (token) are sent
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch destination data");
    }

    const data = await response.json();
    console.log("Destination data response:", data);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching destination data:", error);
    return [];
  }
}
