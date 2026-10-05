import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {readdir} from 'node:fs/promises';
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

server.registerTool(
  'list_files',
  {
    title: 'List Files',
    description: 'List files in a directory',
    inputSchema: {
      path: z.string().optional().default('.').describe('Directory to list'),
    },
  },
  async ({path: directory}) => {
    const files = await readdir(directory, {
      withFileTypes: true,
    });

    const result = files.map((file) => {
      return file.isDirectory() ? `${file.name}/` : file.name;
    });

    return {
      content: [
        {
          type: 'text',
          text: result.join('\n'),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();

await server.connect(transport);
