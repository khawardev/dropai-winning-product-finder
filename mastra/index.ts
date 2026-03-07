import 'dotenv/config'
import { Mastra } from '@mastra/core/mastra'
import { trendSpotterAgent } from './agents/TrendSpotter'
import { supplierHunterAgent } from './agents/SupplierHunter'
import { logisticsAuditorAgent } from './agents/LogisticsAuditor'
import { intelligenceOfficerAgent } from './agents/IntelligenceOfficer'
import { performanceAnalystAgent } from './agents/PerformanceAnalyst'
import { profitAnalystAgent } from './agents/ProfitAnalyst'
import { productDiscoveryWorkflow } from './workflows/ProductDiscovery'

export const mastra = new Mastra({
  agents: {
    'trend-spotter': trendSpotterAgent,
    'supplier-hunter': supplierHunterAgent,
    'logistics-auditor': logisticsAuditorAgent,
    'intelligence-officer': intelligenceOfficerAgent,
    'performance-analyst': performanceAnalystAgent,
    'profit-analyst': profitAnalystAgent,
  },
  workflows: {
    'product-discovery': productDiscoveryWorkflow,
  },
})
