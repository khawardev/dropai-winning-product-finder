# Set API token
API_TOKEN=<YOUR_API_TOKEN>

# Prepare Actor input
cat > input.json << 'EOF'
{
  "query": "hat",
  "page": "1"
}
EOF

# Run the Actor using an HTTP API
# See the full API reference at https://docs.apify.com/api/v2
curl "https://api.apify.com/v2/acts/pintostudio~aliexpress-product-search/runs?token=$API_TOKEN" \
  -X POST \
  -d @input.json \
  -H 'Content-Type: application/json'