TikTok Hashtag Scraper Documentation
TikTok Hashtag Scraper is a specialized tool designed to extract comprehensive data from TikTok videos associated with specific hashtags. It provides insights into video performance, creator details, and music metadata.
Core Capabilities
Video Data Extraction: Scrape captions, video URLs, play counts, likes (hearts), comments, shares, and timestamps.
Metadata Insights: Access music-related data and the country where the video was created.
Creator Information: Extract name, ID, bio, follower/following counts, and account status.
Global Hashtag Stats: Get the total number of views for any given hashtag.
Integration Ready: Export data in JSON, CSV, Excel, or HTML; integrate via API, webhooks, or SDKs (Python/Node.js).
Data Collected
Author Metadata
Engagement Stats
Creation Details
👤 Name, ID, Bio, Avatar
❤️ Likes (Digg Count)
🕛 Time of creation (ISO)
👥 Follower/Following Count
🔁 Shares
📍 Location of creation
📋 Follower/Following List
💬 Comments
🎵 Music name & author

How to Scrape TikTok Hashtags
Account: Create a free Apify account.
Select Actor: Open TikTok Hashtag Scraper in the Apify Store.
Configure: Add your target hashtags (e.g., webscraping) and set the number of videos to scrape.
Run: Click "Start" and wait for the extraction to finish.
Export: Download your structured dataset from the Storage tab.
Input Configuration
The scraper requires a hashtag and a limit on the number of results. If multiple hashtags are provided, the total results are divided equally among them.
JSON Input Example:

JSON


{
    "hashtags": ["webscraping"],
    "resultsPerPage": 20,
    "shouldDownloadCovers": false,
    "shouldDownloadVideos": false
}


Output Data Structure
Data is returned in a structured format. Below is a sample JSON excerpt:

JSON


{
    "id": "7204347705928191259",
    "text": "Scraping website dari nol menggunakan nodejs #webscraping #javascript",
    "createTimeISO": "2023-02-26T06:28:39.000Z",
    "authorMeta": {
        "name": "mshbljrngoding",
        "fans": 1849,
        "heart": 13000
    },
    "musicMeta": {
        "musicName": "LoFi(860862)",
        "musicAuthor": "skollbeats"
    },
    "playCount": 12600,
    "diggCount": 517
}


Frequently Asked Questions
How many results can I get? On average, you can scrape 400 to 800 results per hashtag, which is a hard limit set by TikTok.
What is the cost? The tool uses a pay-per-result (PPR) model at **$5 per 1,000 results** ($0.005 per item). Apify's free plan includes $5 of credits monthly, allowing for 1,000 free results.
Is it legal? The scraper only extracts publicly available data shared by users. It does not access private data like emails or phone numbers.
Can I use it with LLMs? Yes, the tool supports MCP (Model Context Protocol), allowing you to connect it directly to AI clients like Claude Desktop.
Next Step
Would you like me to generate a Python script using the Apify SDK to automate this scraping process for your SaaS content aggregation?
