import 'dotenv/config'
import { productDiscoveryWorkflow } from './mastra/workflows/ProductDiscovery'

async function run() {
  const run = await productDiscoveryWorkflow.createRun()
  console.log("Starting workflow...")
  const result = await run.start({
    inputData: {
      niche: 'ergonomic gaming chairs',
      country: 'United States',
      audience: 'General Consumer',
      category: 'All Categories'
    }
  })
  console.log(JSON.stringify(result, null, 2))
}
run()
