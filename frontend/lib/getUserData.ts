"use server";

import { cookies } from "next/headers";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getUserData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Verifying token get user:", token);

  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/users/me`, {
      credentials: "include",
      method: "GET",
      headers: { Cookie: `token=${token}` },
    });
    console.log("User data fetch response:", response);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const data = await response.json();
    console.log("User data response:", data);
    return {
      name: data.name,
      email: data.email,
      role: data.role,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function getEmployees() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Verifying token get employees:", token);

  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/users/employees`, {
      method: "GET",
      headers: { Cookie: `token=${token}` },
      credentials: "include", // Include cookies for authentication
    });
    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }
    const data = await response.json();
    console.log("Employees data response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}
