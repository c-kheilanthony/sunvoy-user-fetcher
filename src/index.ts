import fetch from "node-fetch";
import { writeFile } from "fs/promises";

const API_URL = "https://challenge.sunvoy.com";

const commonHeaders = {
  Origin: API_URL,
  Referer: `${API_URL}/list`,
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  Cookie:
    "JSESSIONID=25976924-a5cd-421a-b2ca-52530eaefa2c; _csrf_token=b17df8aac3edde38013743fb481f8d8e60a85f957e5704b6241b53cf5bc79226",
};

async function fetchUsers() {
  try {
    const res = await fetch(`${API_URL}/api/users`, {
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

    await writeFile("users.json", JSON.stringify(users, null, 2));
    console.log("Saved to users.json");
  } catch (err) {
    console.error("Error during fetchUsers:", err);
  }
}

fetchUsers();
