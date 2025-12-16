const API = "http://localhost:5000/users";

export async function registerApi(payload) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Register failed");
  return data;
}

export async function loginApi(payload) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Register failed");
  return data;
}

export async function logoutApi() {
  const res = await fetch(`${API}/logout`, {
    method: "POST",

    credentials: "include",
  });

  return res.json();
}

export async function getMeApi() {
  const res = await fetch(`${API}/me/profile`, {
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Not authenticated");

  return data;
}

export async function getUserProfile(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

export async function updateMyAvatar(userId, avatarUrl) {
  const res = await fetch(`http://localhost:5000/users/${userId}/avatar`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar: avatarUrl }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Not authenticated");

  return data;
}
