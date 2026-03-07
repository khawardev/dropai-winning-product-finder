import { MCPServer } from '@mastra/mcp';

import { testAgent } from '../agents/index';

export const testMcpServer = new MCPServer({
  id: 'test-mcp-server',
  name: 'Test Server',
  version: '1.0.0',
  agents: { testAgent },
  tools: {},
});
