import { describe, it, expect } from "vitest";

const API_BASE_URL = "https://localhost:7080/api";


describe("API Endpoints Connectivity Tests", () => {
  it("should be able to reach the authentication health endpoint or similar publicly accessible endpoint", async () => {
    // Assuming /events or /health is public.
    // We will test if the backend server is up and returning valid json.
    const res = await fetch(`${API_BASE_URL}/Event?pageNumber=1&pageSize=1`, {
      headers: { "Content-Type": "application/json" },
    });

    // Check if we get a recognizable response.
    // It might be a 200 OK or maybe a different code if the route is different,
    // but at least it should not throw a connection refused.
    expect(res.status).toBeDefined();

    const data = await res.json().catch(() => ({}));
    console.log("Response from /events:", res.status, data);

    // Assuming events is public and returns a successful response code (2xx)
    expect(res.ok).toBe(true);
  });
});
