import 'dotenv/config';
import { Agent } from '@mastra/core/agent';
import { testMcpClient } from '../mcp/client';

export const testAgent = new Agent({
  id: 'test-agent',
  name: 'Test Agent',
  description: 'You are a helpful AI assistant with access to MCP tools.',
  instructions: `
      You are a helpful assistant that has access to the Wikipedia MCP Server.
      Use it to answer questions.`,
  model: 'openai/gpt-4o',
  tools: await testMcpClient.listTools(),
});
