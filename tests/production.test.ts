import { describe, it, expect } from "vitest";

const API_BASE_URL = process.env.API_BASE_URL || "https://eventtix-gce5hteabkezb8fu.eastasia-01.azurewebsites.net/api";
const HEALTH_URL = API_BASE_URL.replace("/api", "/health");

describe("Production Environment Verification", () => {
    it("should reach the live health check endpoint", async () => {
        const res = await fetch(HEALTH_URL);
        expect(res.status).toBe(200);
        
        const healthData = await res.text();
        console.log("Health Status:", healthData);
        
        // Ensure the health check is reporting Healthy
        expect(healthData).toBe("Healthy");
    });

    it("should have a valid connection to the API", async () => {
        const res = await fetch(`${API_BASE_URL}/Event?pageNumber=1&pageSize=1`);
        expect(res.status).toBe(200);
        
        const data = await res.json();
        expect(Array.isArray(data) || typeof data === 'object').toBe(true);
    });
});
