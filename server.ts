import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';

const server = new McpServer({
  name: 'hello-mcp',
  version: '1.0.0',
});

server.registerTool(
  'hello',
  {
    title: 'Hello',
    description: 'say hello to someone',
    inputSchema: {
      name: z.string().describe('The name of the person to greet'),
    },
  },
  async ({name}) => {
    return {
      content: [
        {
          type: 'text',
          text: `Hello, ${name}!`,
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();

await server.connect(transport);
