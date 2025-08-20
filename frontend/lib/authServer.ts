"use server";

import { cookies } from "next/headers";

const apiBaseUrl ="http://backend:5000/api";

export async function verifyToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Verifying token:", token);

  if (!token) return { valid: false, user: null };

  try {
    const response = await fetch(`${apiBaseUrl}/auth/verify`, {
      credentials: "include",
      method: "GET",
      headers: { Cookie: `token=${token}` },
    });

    console.log("Token verification response:", response);
    if (!response.ok) throw new Error("Verification failed");

    const data = await response.json();
    return { valid: data.valid, user: data.user };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, user: null };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(`${apiBaseUrl}/auth/logout`, {
      credentials: "include",
      method: "POST",
      headers: { Cookie: `token=${token}` },
    });

    if (!response.ok) throw new Error("Logout failed");

    cookieStore.delete("token");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
