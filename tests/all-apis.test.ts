import { describe, test, expect } from "vitest";

const BASE_URL = process.env.API_BASE_URL || "https://localhost:7080/api";


const endpoints = [
  // apiAuth.ts
  { method: "POST", path: "/auth/login", hasId: false },
  { method: "POST", path: "/auth/register", hasId: false },
  { method: "POST", path: "/auth/logout", hasId: false },
  { method: "GET", path: "/users/me", hasId: false },

  // apiTickets.ts
  { method: "POST", path: "/tickets", hasId: false },
  { method: "GET", path: "/tickets/mine", hasId: false },
  { method: "GET", path: "/tickets", hasId: false },
  { method: "DELETE", path: "/tickets/9999", hasId: true },
  { method: "POST", path: "/tickets/scan/9999", hasId: true },

  // userService.ts
  { method: "GET", path: "/Users", hasId: false },
  { method: "PUT", path: "/Users/9999", hasId: true },

  // eventsService.ts
  { method: "GET", path: "/Event", hasId: false },
  { method: "GET", path: "/Event/9999", hasId: true },
  { method: "POST", path: "/Event", hasId: false },
  { method: "PUT", path: "/Event/9999", hasId: true },
  { method: "DELETE", path: "/Event/9999", hasId: true },

  // ticketTiersService.ts (Managed via EventController)
  { method: "GET", path: "/Event/9999/TicketTiers", hasId: true },
];

describe("API Connectivity Tests", () => {
  // Increase timeout slightly in case the server takes a moment
  endpoints.forEach(({ method, path, hasId }) => {
    test(`Endpoint ${method} ${path}`, async () => {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      if (method === "POST" || method === "PUT") {
        options.body = JSON.stringify({});
      }

      try {
        const response = await fetch(`${BASE_URL}${path}`, options);

        // If it's an ID-based route, 404 is an acceptable response (record not found).
        // Otherwise, the endpoint should be found, so anything EXCEPT 404 is acceptable.
        if (!hasId) {
          expect(
            response.status,
            `Expected any status except 404 for ${method} ${path}`,
          ).not.toBe(404);
        } else {
          // Just asserting it's a typical API HTTP response
          expect([200, 201, 204, 400, 401, 403, 404, 405]).toContain(
            response.status,
          );
        }
      } catch (error: any) {
        // If fetch completely fails (e.g. ECONNREFUSED), we throw to fail the test.
        throw new Error(`Fetch failed for ${method} ${path}: ${error.message}`);
      }
    });
  });
});
