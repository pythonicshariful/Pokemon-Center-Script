# 🔴 PokeBot UK — Complete Setup & User Guide

Welcome to the updated **PokeBot UK** script! This bot has been extensively overhauled to fully meet all client requirements, including UK region support, keyword search tracking, multi-item watchlist support, and Pokémon-only category guards.

Below is a detailed guide on how to configure and use every feature directly through the new Tabbed UI.

---

## 🎯 Meeting the Client Requirements

### 1. Pokémon Center UK Support
**Requirement:** Bot should work specifically with Pokémon Center UK.
* **How it works:** The bot natively understands the `en-gb` URL path. The shipping profile has been updated to UK standards, asking for a **Postcode** and **County** instead of US Zip Code and State. It will automatically route all search and category queries to the UK storefront.

### 2. Keyword-Based Tracking
**Requirement:** User should be able to enter a keyword (e.g. "ETB") without needing an exact SKU/URL.
* **How to use it:** 
  1. Open the **Targets** tab in the bot UI.
  2. In the "Keywords / URLs" text box, type your keyword (e.g., `ETB` or `151 Booster`).
  3. Hit **START** on the Dashboard. 
  4. The bot will automatically navigate to the UK search page for that keyword, parse the results, and continuously look for in-stock items.

### 3. Multiple Product Monitoring
**Requirement:** Monitor multiple Pokémon products simultaneously.
* **How to use it:** 
  1. In the **Targets** tab, enter multiple keywords or exact URLs, **one per line**.
  *(e.g. Line 1: `https://www.pokemoncenter.com/en-gb/product/123`, Line 2: `Charizard Box`)*
  2. The bot utilizes a smart watchlist queue. It will check the first item. If out of stock, it will monitor it until a restock occurs. 
  *(Note: Due to single-tab operation limits, we recommend opening multiple browser tabs if you want parallel, simultaneous monitoring of different keywords).*

### 4. Pokémon-Only Filtering (No Random Clothes)
**Requirement:** Focus on Pokémon products, do not buy random clothing.
* **How it works:** 
  1. In the **Targets** tab, check the boxes for **Allowed Categories** (TCG, Plush, Games, Gear).
  2. If you only have **TCG** checked, the bot will actively ignore any search results containing apparel, shirts, or plushies. 
  3. **Strict Guard:** Even if you manually land on a clothing item page with the bot running, the bot will read the page category. If it is apparel and you did not check the apparel box, the bot will block the checkout, print a red `🛑 BLOCKED` message in the logs, and stop automatically to protect your wallet.

### 5. Pokémon Product Drops (New & Old)
**Requirement:** Monitor new drops and target older/existing products.
* **How it works:** 
  - **For old products:** Paste the direct URL into the Targets tab. The bot will sit on the page and do background API checks, auto-refreshing the moment the "Add to Cart" button lights up.
  - **For new drops:** Enter a broad keyword (like `Scarlet Violet`) into the Targets tab. The bot will sit on the search page, continuously refreshing and scanning the product grid. The moment a new product appears in the grid that matches your Allowed Categories, it will instantly click it and buy it.

### 6. Automatic Stock Monitoring & Checkout
**Requirement:** Automatically detect availability and proceed through checkout.
* **How it works:** Once an item is found in stock, the bot simulates realistic human movements (mouse jitters, natural typing delays, and dropdown selections). It bypasses bot-detection by filling your credit card securely into the CyberSource iframe.
* **Alerts:** When an item drops or restocks, the bot will play an **audible chime** and send a **Desktop Push Notification** so you know an order is happening even if the tab is minimized!

---

## 🛠️ Step-by-Step Setup Guide

### 1. Profile Setup (Do this first)
1. Open the Pokémon Center website.
2. Click the **Profile** tab in the bot widget.
3. Fill out your complete UK Shipping information (Name, Street, County, Postcode).
4. Fill out your Payment Details (16-digit card, Expiry Month/Year, CVV).
5. Click **💾 Save Everything**.

### 2. Target Configuration
1. Click the **Targets** tab.
2. Enter the URL(s) or Keyword(s) you want to hunt for.
3. Select the **Allowed Categories** (We recommend only checking **TCG** if you strictly want cards).
4. Set your **Target Qty per Item**.

### 3. Launching the Bot
1. Go to the **Dashboard** tab.
2. Adjust the Min and Max delay (this randomizes how often the bot refreshes to avoid IP bans. 5 to 15 seconds is a safe default).
3. Click **▶ START**. 
4. The status dot will turn **Green**. Sit back and watch the **Logs** tab as the bot searches for inventory!

### 4. Scheduling (Optional)
If you know a drop is happening at exactly 3:00 PM:
1. Go to the **Dashboard** tab.
2. Under "Schedule Start", pick the date and time.
3. Click **⏳ Set**. The bot will pause and automatically hit START at the exact second you specified.

---

## ⚠️ Important Tips for Success
- **Log into your account first!** The bot is programmed to prefer logged-in checkouts over guest checkouts because it is significantly faster and less prone to CAPTCHA blocks.
- **Audio Permissions:** The bot plays a chime when it finds stock. Make sure you have interacted with the page at least once (clicked anywhere) so your browser allows audio playback.
- **Notification Permissions:** Your browser will prompt you to "Allow Notifications" for Pokémon Center. Click **Allow** so the bot can alert you in the background!
