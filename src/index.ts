import fetch from "node-fetch";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";

const USER_API_URL = "https://challenge.sunvoy.com"; //NOTE - url for user fetching
const SETTINGS_API_URL = "https://api.challenge.sunvoy.com"; //NOTE - url for current user fetching

const commonHeaders = {
  Origin: USER_API_URL,
  Referer: `${USER_API_URL}/list`,
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  Cookie:
    "JSESSIONID=25976924-a5cd-421a-b2ca-52530eaefa2c; _csrf_token=b17df8aac3edde38013743fb481f8d8e60a85f957e5704b6241b53cf5bc79226",
};

async function fetchUsers() {
  try {
    const res = await fetch(`${USER_API_URL}/api/users`, {
      method: "POST",
      headers: commonHeaders,
      body: "",
    });

    if (!res.ok) {
      console.error("Failed to fetch users:", res.statusText);
      return;
    }

    const users = await res.json();
    console.log(`Fetched ${users.length} users`);

    const currentUser = await fetchCurrentUser();
    users.push(currentUser);
    console.log("Added current user to the list");

    await writeFile("users.json", JSON.stringify(users, null, 2));
    console.log("Saved to users.json");
  } catch (err) {
    console.error("Error during fetchUsers:", err);
  }
}

async function fetchCurrentUser() {
  let creds;
  try {
    const raw = await readFile("credentials.json", "utf-8");
    creds = JSON.parse(raw);
  } catch (e) {
    throw new Error("Missing or unreadable credentials.json");
  }

  const payload = new URLSearchParams(creds);

  const res = await fetch(`${SETTINGS_API_URL}/api/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: USER_API_URL,
    },
    body: payload,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("Fetched current user");
  return data;
}

fetchUsers();
