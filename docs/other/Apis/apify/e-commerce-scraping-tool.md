# Set API token
API_TOKEN=<YOUR_API_TOKEN>

# Prepare Actor input
cat > input.json << 'EOF'
{
  "additionalProperties": true,
  "additionalPropertiesSearchEngine": true,
  "scrapeReviewsDelivery": false,
  "additionalReviewProperties": true,
  "scrapeInfluencerProducts": false
}
EOF

# Run the Actor using an HTTP API
# See the full API reference at https://docs.apify.com/api/v2
curl "https://api.apify.com/v2/acts/apify~e-commerce-scraping-tool/runs?token=$API_TOKEN" \
  -X POST \
  -d @input.json \
  -H 'Content-Type: application/json'