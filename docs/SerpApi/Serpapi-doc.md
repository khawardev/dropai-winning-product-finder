Google Trends Related Queries API

When a Google Trends search contains related queries, they are parsed and exist within the related_queries object in the JSON output. Related queries can contain rising and top array results. From these results, we can extract query, value, extracted_value, and link. Related queries chart accepts only single query per search.

API Parameters

data_type

Required

Parameter must be set to RELATED_QUERIES. (I.e., data_type=RELATED_QUERIES)



Example with q:coffee

The value field represents the label shown by Google Trends and can be either a percentage increase (for example, +250%) or a textual label for record breakouts (for example, Breakout). In some languages, Google localizes this label (for example, French UI shows Record for Breakout). The extracted_value corresponds to the numeric percentage increase, which can be very large when the baseline search volume was low.



https://serpapi.com/search.json?engine=google_trends&q=coffee&geo=FR&hl=en&data_type=RELATED_QUERIES

{
  "related_queries": {
    "rising": [
      {
        "query": "usagi coffee",
        "value": "Breakout",
        "extracted_value": 8700,
        "link": "https://trends.google.com/trends/explore?q=usagi+coffee&date=today+12-m&geo=FR",
        "serpapi_link": "https://serpapi.com/search.json?data_type=RELATED_QUERIES&date=today+12-m&engine=google_trends&geo=FR&hl=en&q=usagi+coffee&tz=420"
      },
      {
        "query": "bacha coffee champs-élysées",
        "value": "Breakout",
        "extracted_value": 7050,
        "link": "https://trends.google.com/trends/explore?q=bacha+coffee+champs-%C3%A9lys%C3%A9es&date=today+12-m&geo=FR",
        "serpapi_link": "https://serpapi.com/search.json?data_type=RELATED_QUERIES&date=today+12-m&engine=google_trends&geo=FR&hl=en&q=bacha+coffee+champs-%C3%A9lys%C3%A9es&tz=420"
      },
      {
        "query": "crep and coffee",
        "value": "+4,500%",
        "extracted_value": 4500,
        "link": "https://trends.google.com/trends/explore?q=crep+and+coffee&date=today+12-m&geo=FR",
        "serpapi_link": "https://serpapi.com/search.json?data_type=RELATED_QUERIES&date=today+12-m&engine=google_trends&geo=FR&hl=en&q=crep+and+coffee&tz=420"
      },
      ...
    ],
    "top": [
      {
        "query": "coffee shop",
        "value": "100",
        "extracted_value": 100,
        "link": "https://trends.google.com/trends/explore?q=coffee+shop&date=today+12-m&geo=FR",
        "serpapi_link": "https://serpapi.com/search.json?data_type=RELATED_QUERIES&date=today+12-m&engine=google_trends&geo=FR&hl=en&q=coffee+shop&tz=420"
      },
      {
        "query": "the coffee",
        "value": "30",
        "extracted_value": 30,
        "link": "https://trends.google.com/trends/explore?q=the+coffee&date=today+12-m&geo=FR",
        "serpapi_link": "https://serpapi.com/search.json?data_type=RELATED_QUERIES&date=today+12-m&engine=google_trends&geo=FR&hl=en&q=the+coffee&tz=420"
      },
      {
        "query": "cafe",
        "value": "25",
        "extracted_value": 25,
        "link": "https://trends.google.com/trends/explore?q=cafe&date=today+12-m&geo=FR",
        "serpapi_link": "https://serpapi.com/search.json?data_type=RELATED_QUERIES&date=today+12-m&engine=google_trends&geo=FR&hl=en&q=cafe&tz=420"
      },
      ...
    ]
  }
}

---



Google Inline Shopping API

For some searches, Google organic results include inline shopping products. SerpApi is able to extract and make sense of this information. Inline shopping can contain block_position, title, price, link, source, rating, reviews, thumbnail, extensions, second_hand_condition, old_price, extracted_old_price, shipping and more.



https://serpapi.com/search.json?q=gaming+mouse&location=Austin,+Texas,+United+States&hl=en&gl=us

{
  ...
  "shopping_results": [
    {
      "position": 1,
      "block_position": "top",
      "title": "Redragon - For Gaming - M908 Impact RGB LED MMO Mouse with Side Buttons Optical Wired Gaming Mouse with 12,400DPI, High Precision, 20 Programmable Mouse Buttons",
      "price": "$32.89",
      "extracted_price": 32.89,
      "link": "https://www.amazon.com/Redragon-Impact-Buttons-Precision-Programmable/dp/B07HC4NBQ8?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A2FK9EP27A6ZE6",
      "source": "Amazon.com",
      "shipping": "Free shipping",
      "thumbnail": "https://serpapi.com/searches/645b557194489338fd99420a/images/ac11292de2f58aa235fc8abbfd12e2154be6bc5c41efe9d9b6e73be9a7e022b1.webp",
      "extensions": [
        "Free shipping",
        "Black",
        "18 Button",
        "Wired",
        "12,400 DPI",
        "Black",
        "18 Button",
        "Wired",
        "12,400 DPI"
      ]
    },
    {
      "position": 2,
      "block_position": "top",
      "title": "Logitech G - For Gaming - 502 Lightspeed Wireless Gaming Mouse with Hero 25K Sensor, PowerPlay Compatible, Tunable Weights and Lightsync RGB - Black",
      "price": "$102.44",
      "extracted_price": 102.44,
      "link": "https://www.amazon.com/Logitech-Lightspeed-PowerPlay-Compatible-Lightsync/dp/B07L4BM851?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A41J785T3S3V8",
      "source": "Amazon.com",
      "shipping": "Free shipping",
      "thumbnail": "https://serpapi.com/searches/645b557194489338fd99420a/images/ac11292de2f58aa235fc8abbfd12e215eec7a01f80c20654d7ae25b45dd5c7f3.webp",
      "extensions": [
        "Free shipping",
        "Black",
        "11 Button",
        "Wireless",
        "25,600 DPI",
        "Black",
        "11 Button",
        "Wireless",
        "25,600 DPI"
      ]
    },
    {
      "position": 3,
      "block_position": "top",
      "title": "Lenovo Legion M200 RGB Gaming Mouse,5-button design,up to 2400 DPI with 4 levels DPI switch,7-color circulating-backlight,braided cable,comfort for",
      "price": "$15.95",
      "extracted_price": 15.95,
      "link": "https://www.amazon.com/Lenovo-5-button-circulating-backlight-intuitive-GX30P93886/dp/B076GZ3CFC?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A3GS21OP06NP2F",
      "source": "Amazon.com",
      "shipping": "Free shipping",
      "thumbnail": "https://serpapi.com/searches/645b557194489338fd99420a/images/ac11292de2f58aa235fc8abbfd12e21506adebac67f72a969dcadb5dec4fcaa5.webp",
      "extensions": [
        "Free shipping",
        "Black",
        "5 Button",
        "Wired",
        "2,400 DPI",
        "Black",
        "5 Button",
        "Wired",
        "2,400 DPI"
      ]
    },
    {
      "position": 4,
      "block_position": "top",
      "title": "Razer Basilisk X Hyperspeed Gaming Mouse",
      "price": "$39.99",
      "extracted_price": 39.99,
      "link": "https://www.target.com/p/razer-basilisk-x-hyperspeed-gaming-mouse/-/A-79899587?ref=tgt_adv_xsf&AFID=google&CPNG=Electronics&adgroup=207-0",
      "source": "Target",
      "shipping": "Free shipping",
      "rating": 4.5,
      "reviews": 3000,
      "reviews_original": "3k+",
      "thumbnail": "https://serpapi.com/searches/645b557194489338fd99420a/images/ac11292de2f58aa235fc8abbfd12e21570574e0c07b281edb8bf5e4369edabae.webp",
      "extensions": [
        "Black",
        "6 Button",
        "Wireless",
        "16,000 DPI",
        "Black",
        "6 Button",
        "Wireless",
        "16,000 DPI"
      ]
    },
    ...
  ],
  ...
}





---



Google Product Sites API

For some searches, Google search includes the "Product Sites" block. SerpApi is able to scrape, and make sense of this information by extracting position, title, link, image, source, and source_thumbnail.



https://serpapi.com/search.json?q=achat+nike+force+one&hl=fr&gl=fr

{
  ...
  "product_sites": [
    {
      "position": 1,
      "title": "Nike Air Force 1 '07",
      "link": "https://www.idealo.fr/prix/1370489/nike-air-force-1-07.html",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMk1uEDhSMya4aaQFqo9aENt2OmQVvQns&s=0",
      "source": "Idealo",
      "source_thumbnail": "https://serpapi.com/searches/66694a209656228589395b55/images/1a6a25c04b485fb1e31e541b996d270679c82162066556e85bfbf739bc97388d410a81bb5df8434e.jpeg"
    },
    {
      "position": 2,
      "title": "Nike Air Force 1 '07 (Homme)",
      "link": "https://ledenicheur.fr/product.php?p=1216035",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlUo3RY2NyF6gGssnJTPZPPvaGbsZRBxw&s=0",
      "source": "leDénicheur",
      "source_thumbnail": "https://serpapi.com/searches/66694a209656228589395b55/images/1a6a25c04b485fb1230833e42d9abf8413e72165605cd4073d418f6d58c2b84425624dcca1c5d59f.png"
    },
    {
      "position": 3,
      "title": "Nike Air Force 1 (Homme)",
      "link": "https://ledenicheur.fr/product.php?p=2721962",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcNr0IYS-AU-62qXbCVdnFoIDPPOW12P8&s=0",
      "source": "leDénicheur",
      "source_thumbnail": "https://serpapi.com/searches/66694a209656228589395b55/images/1a6a25c04b485fb1d0def63cc2b5b340c34e2ba8aa375cd50d79c0068d820a67e70b8f4ef25be303.png"
    },
    ...
  ]
  ...
}



---



Google Product Result API

For some products (depending on your location), Google search will include the "Product Result" block, typically on the right side. SerpApi is able to extract and make sense of this information.

https://serpapi.com/search.json?q=dyson+v8&device=mobile

"pricing": [
      {
        "price": "$349.99",
        "extracted_price": 349.99,
        "original_price": "$470",
        "extracted_original_price": 470,
        "link": "https://www.dyson.com/vacuum-cleaners/cordless/v8/silver-nickel?utm_source=google_shopping&utm_medium=organic",
        "thumbnail": "https://serpapi.com/searches/65cde9ce2c2c2a1e775313c6/images/301c680e8421b6a086ad3b9ad03e80e21941fdffce63a6ded12191705c38638fb9f462fdee33c5cb.png",
        "name": "Dyson Official",
        "description": "Dyson V8",
        "buying_options": [
          "In stock online",
          "Free delivery Feb 20 – 26",
          "Contact for availability·14.4 mi"
        ],
        "tag": "25% off",
      },

---





Google Shopping Light API

API uptime

99.437%

SerpApi's Google Shopping Light API allows you to scrape the results of a Google Shopping search with lightning-fast speeds. The Google Shopping Light engine contains all the most critical data, but without the extra-rich results you usually find on a regular Google Shopping page. This allows for faster response times compared to our regular Google Shopping API. The API is accessed through the following endpoint: /search?engine=google_shopping_light. You can query: https://serpapi.com/search?engine=google_shopping_light&q=macbook utilizing a GET request. Head to the playground for a live and interactive demo.



 "search_metadata": {
    "id": "6959275c8c24bd247f1be7da",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/159419c2211c1863/6959275c8c24bd247f1be7da.json",
    "created_at": "2026-01-03 14:27:40 UTC",
    "processed_at": "2026-01-03 14:27:40 UTC",
    "google_shopping_light_url": "https://www.google.com/search?udm=28&q=macbook&hl=en&gl=us",
    "raw_html_file": "https://serpapi.com/searches/159419c2211c1863/6959275c8c24bd247f1be7da.html",
    "total_time_taken": 0.92
  },
  "search_parameters": {
    "engine": "google_shopping_light",
    "q": "macbook",
    "google_domain": "google.com",
    "hl": "en",
    "gl": "us",
    "device": "desktop"
  },
  "search_information": {
    "shopping_results_state": "Results for exact spelling"
  },  

"shopping_results": [
    {
      "position": 1,
      "title": "Apple MacBook Air 15-inch Laptop M4 chip 10 core CPU",
      "product_id": "18190989235994495182",
      "product_link": "https://www.google.com/search?ibp=oshop&q=macbook&prds=catalogid:18190989235994495182,headlineOfferDocid:714654972846722284,imageDocid:12814864919217980881,rds:PC_13548628477459230106|PROD_PC_13548628477459230106,gpcid:13548628477459230106,mid:576462511514124639,pvt:hg&hl=en&gl=us&udm=28",
      "immersive_product_page_token": "eyJlaSI6bnVsbCwicHJvZHVjdGlkIjoiIiwiY2F0YWxvZ2lkIjoiMTgxOTA5ODkyMzU5OTQ0OTUxODIiLCJoZWFkbGluZU9mZmVyRG9jaWQiOiI3MTQ2NTQ5NzI4NDY3MjIyODQiLCJpbWFnZURvY2lkIjoiMTI4MTQ4NjQ5MTkyMTc5ODA4ODEiLCJyZHMiOiJQQ18xMzU0ODYyODQ3NzQ1OTIzMDEwNnxQUk9EX1BDXzEzNTQ4NjI4NDc3NDU5MjMwMTA2IiwicXVlcnkiOiJtYWNib29rIiwiZ3BjaWQiOiIxMzU0ODYyODQ3NzQ1OTIzMDEwNiIsIm1pZCI6IjU3NjQ2MjUxMTUxNDEyNDYzOSIsInB2dCI6ImhnIiwidXVsZSI6bnVsbCwiZ2wiOiJ1cyIsImhsIjoiZW4ifQ==",
      "serpapi_immersive_product_api": "https://serpapi.com/search.json?engine=google_immersive_product&page_token=eyJlaSI6bnVsbCwicHJvZHVjdGlkIjoiIiwiY2F0YWxvZ2lkIjoiMTgxOTA5ODkyMzU5OTQ0OTUxODIiLCJoZWFkbGluZU9mZmVyRG9jaWQiOiI3MTQ2NTQ5NzI4NDY3MjIyODQiLCJpbWFnZURvY2lkIjoiMTI4MTQ4NjQ5MTkyMTc5ODA4ODEiLCJyZHMiOiJQQ18xMzU0ODYyODQ3NzQ1OTIzMDEwNnxQUk9EX1BDXzEzNTQ4NjI4NDc3NDU5MjMwMTA2IiwicXVlcnkiOiJtYWNib29rIiwiZ3BjaWQiOiIxMzU0ODYyODQ3NzQ1OTIzMDEwNiIsIm1pZCI6IjU3NjQ2MjUxMTUxNDEyNDYzOSIsInB2dCI6ImhnIiwidXVsZSI6bnVsbCwiZ2wiOiJ1cyIsImhsIjoiZW4ifQ%3D%3D",
      "source": "Apple",
      "source_icon": "https://encrypted-tbn0.gstatic.com/favicon-tbn?q=tbn%3AANd9GcQHXFo_4_jfSkgJGci2J3gMfs5gRtqQjLtWp4j8oZ5V76tcJKWfy34pBCFnqxz-2SHx5D256e-9aNEAtsTTvB5jXz-jbEk",
      "multiple_sources": true,
      "price": "$1,199.00",
      "extracted_price": 1199,
      "rating": 4.9,
      "reviews": 4200,
      "snippet": "Performs well (958 user reviews)",
      "thumbnail": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT1d9WXe6icr9FZfSZCpwq0lS1KnamOfy_Nt3OpPv22wSqRDGu8eBDmyzCC07aDJxPiCTQ8Ecs92Zvs1iw5qMsbnFPYguQ26WzTaYn7lfJylKTtCGk9x8ibYQ",
      "serpapi_thumbnail": "https://serpapi.com/images/url/BoY0QXicDclJDoIwAADAF8lmBEpijBYhwcgiJAgXA2VrhFpo2XyV3_E3Otf5fhrOKTNEsSRoWCkviw3PiSzUjGccIwG9OpE1L0oxqQ_9_n_G0S2AjSK5APG9VDEagJVWYQrp3EttKF9I1nnV-nD51qP-pChz2N9Me9TLk9mtbwglLTOdxccwCvQzYkBJJybjeddfWU4sP6nHQFHjd5QlRGsrZ20vEYf2Eyw6zpPgB7GZPyY",
      "delivery": "Free next-day delivery"
    },

---



Google Shopping API

API uptime

99.866%

The Google Shopping Results API allows a user to scrape the results of a Google Shopping search. The API is accessed through the following endpoint: /search?engine=google_shopping. You can query: https://serpapi.com/search?engine=google_shopping&q=iPhone utilizing a GET request. Head to the playground for a live and interactive demo.



"search_metadata": {
    "id": "695928488c24bd247f1be7fd",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/1552b78f99d1028b/695928488c24bd247f1be7fd.json",
    "created_at": "2026-01-03 14:31:36 UTC",
    "processed_at": "2026-01-03 14:31:36 UTC",
    "google_shopping_url": "https://www.google.com/search?udm=28&q=iPhone&uule=w+CAIQICIaQXVzdGluLFRleGFzLFVuaXRlZCBTdGF0ZXM&hl=en&gl=us",
    "raw_html_file": "https://serpapi.com/searches/1552b78f99d1028b/695928488c24bd247f1be7fd.html",
    "total_time_taken": 0.84
  },
  "search_parameters": {
    "engine": "google_shopping",
    "q": "iPhone",
    "location_requested": "Austin, Texas, United States",
    "location_used": "Austin,Texas,United States",
    "google_domain": "google.com",
    "hl": "en",
    "gl": "us",
    "device": "desktop"
  },
  "search_information": {
    "query_displayed": "iPhone",
    "shopping_results_state": "Results for exact spelling"
  },
  "shopping_results": [
    {
      "position": 1,
      "title": "Apple iPhone 17",
      "product_id": "1963782759689578064",
      "product_link": "https://www.google.com/search?ibp=oshop&q=iPhone&prds=catalogid:1963782759689578064,headlineOfferDocid:17123889326244746312,imageDocid:2824841837607088598,rds:PC_6027158597472037202|PROD_PC_6027158597472037202,gpcid:6027158597472037202,mid:576462866558881327,pvt:hg&hl=en&gl=us&udm=28",
      "immersive_product_page_token": "eyJlaSI6IlRpaFphZktGQjhUbDVOb1A4Zkx3NFFjIiwicHJvZHVjdGlkIjoiIiwiY2F0YWxvZ2lkIjoiMTk2Mzc4Mjc1OTY4OTU3ODA2NCIsImhlYWRsaW5lT2ZmZXJEb2NpZCI6IjE3MTIzODg5MzI2MjQ0NzQ2MzEyIiwiaW1hZ2VEb2NpZCI6IjI4MjQ4NDE4Mzc2MDcwODg1OTgiLCJyZHMiOiJQQ182MDI3MTU4NTk3NDcyMDM3MjAyfFBST0RfUENfNjAyNzE1ODU5NzQ3MjAzNzIwMiIsInF1ZXJ5IjoiaVBob25lIiwiZ3BjaWQiOiI2MDI3MTU4NTk3NDcyMDM3MjAyIiwibWlkIjoiNTc2NDYyODY2NTU4ODgxMzI3IiwicHZ0IjoiaGciLCJ1dWxlIjoidytDQUlRSUNJYVFYVnpkR2x1TEZSbGVHRnpMRlZ1YVhSbFpDQlRkR0YwWlhNIiwiZ2wiOiJ1cyIsImhsIjoiZW4ifQ==",
      "serpapi_immersive_product_api": "https://serpapi.com/search.json?engine=google_immersive_product&page_token=eyJlaSI6IlRpaFphZktGQjhUbDVOb1A4Zkx3NFFjIiwicHJvZHVjdGlkIjoiIiwiY2F0YWxvZ2lkIjoiMTk2Mzc4Mjc1OTY4OTU3ODA2NCIsImhlYWRsaW5lT2ZmZXJEb2NpZCI6IjE3MTIzODg5MzI2MjQ0NzQ2MzEyIiwiaW1hZ2VEb2NpZCI6IjI4MjQ4NDE4Mzc2MDcwODg1OTgiLCJyZHMiOiJQQ182MDI3MTU4NTk3NDcyMDM3MjAyfFBST0RfUENfNjAyNzE1ODU5NzQ3MjAzNzIwMiIsInF1ZXJ5IjoiaVBob25lIiwiZ3BjaWQiOiI2MDI3MTU4NTk3NDcyMDM3MjAyIiwibWlkIjoiNTc2NDYyODY2NTU4ODgxMzI3IiwicHZ0IjoiaGciLCJ1dWxlIjoidytDQUlRSUNJYVFYVnpkR2x1TEZSbGVHRnpMRlZ1YVhSbFpDQlRkR0YwWlhNIiwiZ2wiOiJ1cyIsImhsIjoiZW4ifQ%3D%3D",
      "source": "Apple",
      "source_icon": "https://serpapi.com/searches/695928488c24bd247f1be7fd/images/eca3a6b3fb67a0b669f9ef694b9824eb152c97f518ce115982a93b5cb20eb2d6.png",
      "multiple_sources": true,
      "price": "$829.00",
      "extracted_price": 829,
      "rating": 4.7,
      "reviews": 5300,
      "snippet": "Quality camera (190 user reviews)",
      "extensions": [
        "Nearby, 13 mi"
      ],
      "thumbnail": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSIAUbCDy2xtkPW8ctQDNgiTf194pAZbI7ai1L8YMA-e6mJ167aZtO3gt-AoB3kBAmcv3gqrlG48ljV7KVWgIH5-VppyAOOjkRmHzUNyD-k2aEtz6UgfTrKg",
      "serpapi_thumbnail": "https://serpapi.com/images/url/xMJOrnicDcnbEkJAGADgJ1oGhZppmpUmOtDBYXLH0mLD4p-m9VS9Tm9T3-33_ZQAfFzKctGSQXAocgRZq0p0hBQqIpGukcey47xq6bpf_W-JvXyxI9ebi8NsYwv1DewcmwQutker4KEsZhwnmWuklXI07yeMCr3ZK7qRJuBrFBDuLI1ZuCEvjfbDczczn3VkHKKYus4cRZwL7Ps1uzbOFHrCRkxNtzDpIX0Ew4H-AD0pPZ0",
      "delivery": "Free next-day delivery"
    },



---



so in term of wholesale market like (Alibaba, AliExpress ) search - I am thinking of using this api endpoint which will give all the existing wholesale market products on google



Google Search Engine Results API - (via site:aliexpress.com `site:alibaba.com` queries)

intitle:\"gaming chair\" site:alibaba.com"



Our Google Search API allows you to scrape results from the Google search page. The API is accessed through the following endpoint: /search?engine=google.A user may query the following: https://serpapi.com/search?engine=google utilizing a GET request. Head to the playground for a live and interactive demo.



"search_metadata": {
    "id": "69ab0a7e71a41daf45d65388",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/t_eQPtSxdjsVgb62Q1B3dg/69ab0a7e71a41daf45d65388.json",
    "pixel_position_endpoint": "https://serpapi.com/searches/t_eQPtSxdjsVgb62Q1B3dg/69ab0a7e71a41daf45d65388.json_with_pixel_position",
    "created_at": "2026-03-06 17:10:22 UTC",
    "processed_at": "2026-03-06 17:10:22 UTC",
    "google_url": "https://www.google.com/search?q=gaming+chair&oq=gaming+chair&uule=w+CAIQICIaQXVzdGluLFRleGFzLFVuaXRlZCBTdGF0ZXM&hl=en&gl=us&sourceid=chrome&ie=UTF-8",
    "raw_html_file": "https://serpapi.com/searches/t_eQPtSxdjsVgb62Q1B3dg/69ab0a7e71a41daf45d65388.html",
    "total_time_taken": 2.84
  },
  "search_parameters": {
    "engine": "google",
    "q": "gaming chair",
    "location_requested": "Austin, Texas, United States",
    "location_used": "Austin,Texas,United States",
    "google_domain": "google.com",
    "hl": "en",
    "gl": "us",
    "device": "desktop"
  },
  "search_information": {
    "query_displayed": "gaming chair",
    "total_results": 267,
    "time_taken_displayed": 0.45,
    "organic_results_state": "Results for exact spelling",
    "results_for": "Austin, TX"
  },
  "local_map": {
    "link": "https://www.google.com/search?q=gaming+chair&sca_esv=b964d58e7340a202&hl=en&gl=us&udm=1&lsack=gAqracmfCNiIptQP8pPWsQw&sa=X&ved=2ahUKEwjJ3-aH4ouTAxVYhIkEHfKJNcYQtgN6BAhWEAM",
    "image": "https://serpapi.com/searches/69ab0a7e71a41daf45d65388/images/wVxipbacEjvsOFL3wUZFxA.gif"
  },
  "local_results": {
    "places": [
      {
        "position": 1,
        "rating": 4,
        "reviews": 305,
        "reviews_original": "(305)",
        "price": "$$",
        "lsig": "AB86z5WXca6pTuy-0njDQKbJw-uW",
        "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerrmC_pafo1VvysNmxSrGt_k1iHFbN6k-h8wGqrOwmtdjej8fr48AbDb2E6kZI9lv8OCUTykRaH1NVREZxQpy2fFl5zz2byg_WwbJWriU96OttKauN748nxkEFAcrBiRK46NuKR=w92-h92-n-k-no",
        "place_id": "8753890517682184631",
        "place_id_search": "https://serpapi.com/search.json?device=desktop&engine=google&gl=us&google_domain=google.com&hl=en&location=Austin%2C+Texas%2C+United+States&ludocid=8753890517682184631&q=gaming+chair",
        "gps_coordinates": {
          "latitude": 30.269697,
          "longitude": -97.75394
        },
        "title": "Office Depot",
        "type": "Office supply store",
        "phone": "(512) 472-1644",
        "address": "907 W 5th St #101",
        "hours": "Open · Closes 8 PM",
        "extensions": [
          "In stock: gaming chairs · Updated today"
        ]
      },



---





so in term of competitive market search - I am thinking of using this api endpoint which will give all the existing stores against that product on google



Google Related Brands API

For some searches, Google search includes Related brands. SerpApi is able to scrape the title, block_title, link, thumbnail, snippet, and more from these items.

https://serpapi.com/search.json?q=leather+handbags&location=San+Francisco+California,+United+States&hl=en&gl=us

"related_brands": [
    {
      "title": "The Frye Company",
      "block_title": "Explore brands",
      "favicon": "https://serpapi.com/searches/67991b6d877a911b6bc22106/images/f5e0d8a5b2b09119f3f4ddd7b6a25769dc125bd58944ea18f49db50c91994020.png",
      "link": "https://www.thefryecompany.com/collections/handbags",
      "snippet": "With sophisticated and stylish designs, you'll enjoy Frye handbags for years to come. Our women's leather handbags are crafted from top-quality leather with ...",
      "thumbnail": "https://serpapi.com/searches/67991b6d877a911b6bc22106/images/f5e0d8a5b2b09119f3f4ddd7b6a25769651b57a804b4680d1bcb5334ef36d5af.jpeg"
    },


---



Google Lens API
API uptime
99.428%
Our Google Lens API allows you to scrape results from the Google Lens page when performing an image search. The results related to the image could contain visual matches and other data. The API is accessed through the following endpoint: /search?engine=google_lens.

A user may query the following: https://serpapi.com/search?engine=google_lens utilizing a GET request. Head to the playground for a live and interactive demo.


New updates on Google Lens
We have introduced new search capability to Google Lens API. You can now include the q parameter along with the usual image search parameters to refine the search results.

In addition, we have discontinued the page_token parameter and replaced it with the new type parameter. This change makes the API more intuitive and easier to use when performing searches for Product, Exact Matches, and Visual Matches.


"search_metadata": {
    "id": "69ab1238304eba88585e09a2",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/rlPKnxi9LLHBUtBIh0Yqog/69ab1238304eba88585e09a2.json",
    "created_at": "2026-03-06 17:43:20 UTC",
    "processed_at": "2026-03-06 17:43:20 UTC",
    "google_lens_url": "https://lens.google.com/uploadbyurl?url=https%3A%2F%2Fs.alicdn.com%2F%40sc04%2Fkf%2FH922c6b7ec16f44ecaa4c1e4886695931q.jpg",
    "raw_html_file": "https://serpapi.com/searches/rlPKnxi9LLHBUtBIh0Yqog/69ab1238304eba88585e09a2.html",
    "total_time_taken": 17.58
  },
  "search_parameters": {
    "engine": "google_lens",
    "url": "https://s.alicdn.com/@sc04/kf/H922c6b7ec16f44ecaa4c1e4886695931q.jpg"
  },
  "ai_overview": {
    "page_token": "W6wY73icxZbbkqJIEIbv9z2Wq1ERzx1BbBQH7cIDIjrq3BCcLBGBlgIR7-Zd9k32LfZptsAT2jobfbGxGSFQSZKVlfXVH_78c-v47t-__bWOog_8VqkkSVJGQYC2dtkMvIqOU9-srIItDs31H3scOhbLD1NVs4xVSetZG0VUwBpx0FEOck-k5bmYjhya-SFY28F0sl3Ol5E8NQ8jlW6MBMuRe5AZCrOaPFVSzoG86ZsBEDbdWrjrNJfxFCTUHjt-xPIA7gQQ8DwwVYBQvwdEBKbBhl8vR4DY-DDLbtq7AgAS2lsAeDA-Ak7sg16P_KSTn4otj2Wa1NbHmhdYNhv7FA7i0LRZ4iontlGOXT9_jeNwpRM_iU73bI0yMUtTtsOqXD_ULXUAm_JmF-FxvEslT0FU3hpWM3Rsb0jnDhtc0Srk4v5eE8igjMu2X9brrm508IS3UZmhq52yXNE9EgD-A0P5dUJ-HARc9gwfIpzPrqLxeQrSeSBeXNzlzc2S3MlxIMmjOOVpLg6JWTYFQAlATmMOmnpf56O5xQHOLgqPhlm9IoCfP3m2jmvVs1-t8_FNNj4tU7hOI4JXxt22rku-rQPzlhACIVsxD04tQQBDMbk0jwfvANhCCSiK8jI9WShMBEfR4LX1z4wHTgg-GC4ghVYsRHiiK0ZIbtWKY67N_CHEGWb8tEMHPVEQgvjA1Dw70IbVWUlfeSn8KC3gCFVMg8RtA92yLW2t0d9yoE18JRoXiaYld7Af2h1yKsuDMlct4Jx1AfF3ZSLSiOeb_dSeg5RZP28iT063UphBqGezzm5j0muRK24vn6f8jPP9dGecL5n717i72sXz8JxfcB6LvE6cdWEGhrcPlw9BtxKhm6fhuVPu3q1yMhBFwkoWPMs_EO7LuS4lf6mIMAs-Dc8rES5HapK7EOndKAGHzCPlTSEHKz_zSp65m0vH3YKKjjmCJ5y_bvy_QsCDC78POBYx7kY6c2x635X2BkRDZjEv7Y4NvzrxvFZyxjbwjC8osfn_gF3Q6T7gMrDhA9jNX4NNjr_yC50-T3fV6fSs00_B_qzT6X2dj2C7RbBf6vQV7CAfvgYbvgQbPgH7rNNXsMWXYBOdLoD9qNPTgk5fwf66Tqtf0umcb_t0uxfteINeind30WrXJGPnTqdxz9clfTI8ql21EbhG8lm8V1709hEG6JvmWG8cI0WpRe0obxsGLK03DsvNSrLnUDtIoSTL7ngV9gZHqdMarY92NFCTd24d1Qybrn9YklMt7Sdy9F0a8P7weNzuQlWdp0iOU2Ej9dKlVxut64kR91VrMeno45nqNjvMOIwPWBZhpwW1zeCwCGci56T04kcpXjvJu37UFsG2A8MV8z5388IwG0dIF1urhaYrlBea5L8fqCMwUsjWkG0DFDZ1zcZ7ttqqtRsNq11dtU3b0OuUh6L0g2VaFPZDlv4HteEfqQ",
    "serpapi_link": "https://serpapi.com/search.json?engine=google_ai_overview&page_token=W6wY73icxZbbkqJIEIbv9z2Wq1ERzx1BbBQH7cIDIjrq3BCcLBGBlgIR7-Zd9k32LfZptsAT2jobfbGxGSFQSZKVlfXVH_78c-v47t-__bWOog_8VqkkSVJGQYC2dtkMvIqOU9-srIItDs31H3scOhbLD1NVs4xVSetZG0VUwBpx0FEOck-k5bmYjhya-SFY28F0sl3Ol5E8NQ8jlW6MBMuRe5AZCrOaPFVSzoG86ZsBEDbdWrjrNJfxFCTUHjt-xPIA7gQQ8DwwVYBQvwdEBKbBhl8vR4DY-DDLbtq7AgAS2lsAeDA-Ak7sg16P_KSTn4otj2Wa1NbHmhdYNhv7FA7i0LRZ4iontlGOXT9_jeNwpRM_iU73bI0yMUtTtsOqXD_ULXUAm_JmF-FxvEslT0FU3hpWM3Rsb0jnDhtc0Srk4v5eE8igjMu2X9brrm508IS3UZmhq52yXNE9EgD-A0P5dUJ-HARc9gwfIpzPrqLxeQrSeSBeXNzlzc2S3MlxIMmjOOVpLg6JWTYFQAlATmMOmnpf56O5xQHOLgqPhlm9IoCfP3m2jmvVs1-t8_FNNj4tU7hOI4JXxt22rku-rQPzlhACIVsxD04tQQBDMbk0jwfvANhCCSiK8jI9WShMBEfR4LX1z4wHTgg-GC4ghVYsRHiiK0ZIbtWKY67N_CHEGWb8tEMHPVEQgvjA1Dw70IbVWUlfeSn8KC3gCFVMg8RtA92yLW2t0d9yoE18JRoXiaYld7Af2h1yKsuDMlct4Jx1AfF3ZSLSiOeb_dSeg5RZP28iT063UphBqGezzm5j0muRK24vn6f8jPP9dGecL5n717i72sXz8JxfcB6LvE6cdWEGhrcPlw9BtxKhm6fhuVPu3q1yMhBFwkoWPMs_EO7LuS4lf6mIMAs-Dc8rES5HapK7EOndKAGHzCPlTSEHKz_zSp65m0vH3YKKjjmCJ5y_bvy_QsCDC78POBYx7kY6c2x635X2BkRDZjEv7Y4NvzrxvFZyxjbwjC8osfn_gF3Q6T7gMrDhA9jNX4NNjr_yC50-T3fV6fSs00_B_qzT6X2dj2C7RbBf6vQV7CAfvgYbvgQbPgH7rNNXsMWXYBOdLoD9qNPTgk5fwf66Tqtf0umcb_t0uxfteINeind30WrXJGPnTqdxz9clfTI8ql21EbhG8lm8V1709hEG6JvmWG8cI0WpRe0obxsGLK03DsvNSrLnUDtIoSTL7ngV9gZHqdMarY92NFCTd24d1Qybrn9YklMt7Sdy9F0a8P7weNzuQlWdp0iOU2Ej9dKlVxut64kR91VrMeno45nqNjvMOIwPWBZhpwW1zeCwCGci56T04kcpXjvJu37UFsG2A8MV8z5388IwG0dIF1urhaYrlBea5L8fqCMwUsjWkG0DFDZ1zcZ7ttqqtRsNq11dtU3b0OuUh6L0g2VaFPZDlv4HteEfqQ"
  },
  "visual_matches": [
    {
      "position": 1,
      "title": "Amazon.com: Sweetcrispy Video Game Chair - Ergonomic ...",
      "link": "https://www.amazon.com/Sweetcrispy-Video-Game-Desk-Chair/dp/B0DBZJM5KX",
      "source": "Amazon.com",
      "source_icon": "https://serpapi.com/searches/69ab1238304eba88585e09a2/images/FhRQskIcbsN3DWfk6xcTlWlEFxOCI-wIQqHbhxMB42g.png",
      "thumbnail": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmRcm9qfzv_Lqr-TCZX2uQiUR53pGkATFdo_Pnxxw09WvVBu2-",
      "thumbnail_width": 274,
      "thumbnail_height": 184,
      "image": "https://m.media-amazon.com/images/I/61A0Cf9L8uL._AC_UF894,1000_QL80_.jpg",
      "image_width": 1000,
      "image_height": 670
    },