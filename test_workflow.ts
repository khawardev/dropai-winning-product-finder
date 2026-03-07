import 'dotenv/config';
import { mastra } from './mastra/index';

async function main() {
  console.log("Starting workflow...");
  const discoveryWorkflow = mastra.getWorkflow('product-discovery');
  const run = await discoveryWorkflow.createRun();
  const workflowResult = await run.start({
    inputData: {
      niche: 'dog accessories',
      country: 'United States',
      audience: 'General Consumer',
      category: 'All Categories',
    }
  });
  console.log('Workflow result status:', workflowResult.status);
  if (workflowResult.status === 'success') {
    const output = (workflowResult.result as any).finalAnalysis;
    console.log('Final Analysis from Workflow:', output);
  } else {
    console.error(workflowResult);
  }
}

main().catch(console.error);