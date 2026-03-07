### 🎬 The Scenario
**The User:** Sarah, a beginner Shopify dropshipper.
**The Goal:** She wants to find a profitable product to sell in the "Pets" niche to people in the USA.

---

### 🔄 The Step-by-Step Workflow

#### Step 1: The Request (Frontend)
Sarah logs into your React/Next.js dashboard. She goes to the **Product Finder** page and fills out the form:
*   **Niche:** "Dogs"
*   **Target Country:** "USA"
*   **Budget Range:** Under $10
She clicks the **"Find Winning Products"** button. The frontend shows a loading screen saying: *"Scanning trends..."*

*Behind the scenes:* Your frontend sends this form data to your Python (FastAPI) backend.
 
#### Step 2: The "Smart" Shortcut (Database Check)
Before the AI does any hard work, your backend checks your database (Supabase).
It asks: *"Did anyone else search for 'Dogs in the USA' in the last 24 hours?"*
*   **If YES:** It instantly grabs the saved results and sends them to Sarah. (This saves you AI API costs and gives Sarah results in 1 second).
*   **If NO:** The backend wakes up API Calls are made to start hunting.

#### Step 3: Agent 1 - The Trend Spotter 🕵️‍♂️
Your backend gives the word "Dogs" to your first AI agent.
1.  The AI writes a search query to a Rapid API and Apify API.
2.  It sees that videos for "Dog beds" are declining, but videos for **"Portable Dog Water Bottle with built-in bowl"** are exploding this week.
3.  It passes this specific product name to the next agent.
*On the frontend, the loading screen changes to: "Analyzing profit margins..."*

#### Step 4: Agent 2 - The Supplier Hunter 📦
The second AI agent takes the "Portable Dog Water Bottle".
1.  It searches an AliExpress or ALI Baba API for this exact item.
2.  It finds 3 reliable suppliers.
3.  It notes that the average cost to buy it wholesale is **$4.00**, and shipping to the USA takes **7 days**.
4.  It passes this math to the final agent.
*On the frontend, the loading screen changes to: "Checking competitors..."*

#### Step 5: Agent 3 - The Financial Analyst 📊
The third AI agent does the final calculations.
1.  It searches the internet for other Shopify stores selling this exact water bottle.
2.  It finds that competitors are selling it for **$24.00**.
3.  It calculates the profit margin: $24.00 (retail) - $4.00 (wholesale) = **$20.00 profit**.
4.  It packages all this information into a perfectly organized JSON file.

#### Step 6: Saving Data & Sending to UI (Backend -> Frontend)
Your backend receives the final JSON from Agent 3. 
1.  It saves this exact JSON into your Supabase database so you have it for the future.
2.  It sends the JSON back to Sarah's frontend dashboard.

#### Step 7: The Result (Frontend)
The loading screen disappears. Sarah sees a beautiful UI card that says:

> **Product:** Portable Dog Water Bottle
> **Demand Score:** 🔥 High 
> **Cost to Source:** $4.00
> **Est. Selling Price:** $24.00
> **Est. Profit Margin:** 83%
> **Shipping:** 7 Days (3 Suppliers Found)

Sarah clicks the "Save Product" button, which saves it to her personal profile in your database.
