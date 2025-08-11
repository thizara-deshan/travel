"use server";

import { cookies } from "next/headers";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getTourData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Verifying token get user:", token);

  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/tour-packages/get-tour-packages`,
      {
        credentials: "include",
        method: "GET",
        headers: { Cookie: `token=${token}` },
      }
    );
    console.log("Tour data fetch response:", response);
    if (!response.ok) throw new Error("Failed to fetch tour data");

    const data = await response.json();
    console.log("Tour data response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching tour data:", error);
    return null;
  }
}

export async function getDestinationData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Verifying token get destinations:", token);

  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/tour-packages/get-destinations`,
      {
        credentials: "include",
        method: "GET",
        headers: { Cookie: `token=${token}` },
      }
    );
    console.log("Destination data fetch response:", response);
    if (!response.ok) throw new Error("Failed to fetch destination data");

    const data = await response.json();
    console.log("Destination data response:", data);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching destination data:", error);
    return [];
  }
}
