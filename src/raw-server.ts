import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  console.error("\n========== RAW REQUEST ==========");
  console.error(line);

  try {
    const request = JSON.parse(line);

    console.error("\n========== PARSED REQUEST ==========");
    console.error(JSON.stringify(request, null, 2));

    handleRequest(request);
  } catch (error) {
    console.error("Invalid JSON:", error);
  }
});

function handleRequest(request: any) {
  console.error("\n========== MCP METHOD ==========");
  console.error(request.method);

  if (request.method === "initialize") {
    handleInitialize(request);
    return;
  }

  if (request.method === "tools/list") {
    handleToolsList(request);
    return;
  }

  if (request.method === "notifications/initialized") {
    console.error("Client initialized.");
    return;
  }

  sendError(request.id, -32601, `Method not found: ${request.method}`);
}

function handleInitialize(request: any) {
  console.error("\n========== SERVER PROCESSING ==========");
  console.error("Processing initialize...");

  const response = {
    jsonrpc: "2.0",
    id: request.id,
    result: {
      protocolVersion: request.params.protocolVersion,
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: "hello-mcp",
        version: "1.0.0",
      },
    },
  };

  sendResponse(response);
}

function handleToolsList(request: any) {
  console.error("\n========== SERVER PROCESSING ==========");
  console.error("Processing tools/list...");

  const response = {
    jsonrpc: "2.0",
    id: request.id,
    result: {
      tools: [
        {
          name: "hello",
          title: "Hello",
          description: "say hello to someone",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name of the person to greet",
              },
            },
            required: ["name"],
          },
        },
        {
          name: "list_files",
          title: "List Files",
          description: "List files in a directory",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                default: ".",
                description: "Directory to list",
              },
            },
          },
        },
      ],
    },
  };

  sendResponse(response);
}

function sendResponse(response: any) {
  const json = JSON.stringify(response);

  console.error("\n========== RAW RESPONSE ==========");
  console.error(json);

  process.stdout.write(json + "\n");
}

function sendError(id: any, code: number, message: string) {
  sendResponse({
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
    },
  });
}