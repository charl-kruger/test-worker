import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Main MCP Agent with timezone tool
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Timezone MCP",
    version: "1.0.0",
  });

  async init() {
    // Tool: Get the timezone for a given location (city, address, lat/lng, or IP)
    this.server.tool(
      "get_timezone", // Tool name
      "Get the current timezone for a specified place or IP address.", // Tool description
      {
        // Allow flexible input
        location: z
          .string()
          .describe(
            "Location to get timezone for. Accepts city name, address, country, latitude/longitude, or IP address."
          ),
      },
      async ({ location }) => {
        try {
          // Detect coordinate pattern (lat,lng with optional whitespace)
          const coordMatch = location.match(
            /^\s*(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)\s*$/
          );

          let apiUrl = "";
          let description = "";
          if (coordMatch) {
            // If coordinates
            const [_, lat, lng] = coordMatch;
            apiUrl = `https://timezoneapi.io/api/timezone/?${new URLSearchParams({lat, lng})}`;
            description = `timezone for coordinates (${lat}, ${lng})`;
          } else if (/^(\d+\.\d+\.\d+\.\d+)$/.test(location) || location.includes("::")) {
            // If IPv4 or IPv6
            apiUrl = `https://timezoneapi.io/api/ip/?ip=${encodeURIComponent(location)}`;
            description = `timezone for IP ${location}`;
          } else {
            // Assume city, country, or address
            apiUrl = `https://timezoneapi.io/api/address/?address=${encodeURIComponent(location)}`;
            description = `timezone for address '${location}'`;
          }

          const resp = await fetch(apiUrl, {
            headers: { "Accept": "application/json" },
          });

          if (!resp.ok) {
            return {
              content: [
                {
                  type: "text",
                  text: `Failed to retrieve timezone: ${resp.status} ${resp.statusText}`,
                },
              ],
            };
          }

          // The API's structure: timezoneapi.io returns { data: { timezone: { id, location, offset_gmt, ... }, ... } }
          const result = await resp.json();
          const timezone =
            result?.data?.timezone?.id ||
            result?.data?.timezone?.abbr ||
            result?.data?.ip?.timezone?.id;
          const locationInfo =
            result?.data?.timezone?.location ||
            result?.data?.ip?.city ||
            result?.data?.ip?.country_name ||
            location;

          if (timezone) {
            return {
              content: [
                {
                  type: "text",
                  text: `The timezone for ${locationInfo} is ${timezone}.`,
                },
              ],
            };
          } else {
            // Could not parse response
            return {
              content: [
                {
                  type: "text",
                  text: `Could not find timezone for '${location}'.`,
                },
              ],
            };
          }
        } catch (err) {
          console.error("Error getting timezone:", err);
          return {
            content: [
              {
                type: "text",
                text: `Error: Unable to fetch timezone information. Please try again later.`,
              },
            ],
          };
        }
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
