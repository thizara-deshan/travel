"use client";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

// Get a cookie value by name from document.cookie
function getCookie(name: string) {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] || null
  );
}

export async function verifyToken() {
  const token = getCookie("token");
  console.log("Verifying token:", token);

  if (!token) return { valid: false, user: null };

  try {
    const response = await fetch(`${apiBaseUrl}/auth/verify`, {
      method: "GET",
      credentials: "include", // include cookies automatically
      headers: { Cookie: `token=${token}` }, // optional, for same-origin
    });

    if (!response.ok) throw new Error("Verification failed");

    const data = await response.json();
    return { valid: data.valid, user: data.user };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, user: null };
  }
}

export async function logout() {
  const token = getCookie("token");

  try {
    const response = await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { Cookie: `token=${token}` }, // optional
    });

    if (!response.ok) throw new Error("Logout failed");

    // Clear cookie in browser
    document.cookie = "token=; path=/; max-age=0";

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
