# 🔴 PokeBot UK — Complete Setup & User Guide

Welcome to **PokeBot UK**! This bot is designed specifically for **Pokémon Center UK** (`pokemoncenter.com/en-gb`) to automate stock monitoring, drop hunting, and auto-checkout with maximum stealth and anti-bot evasion.

This guide explains how to install the bot, how to use each feature to meet every requirement, and how to scale to **5–10 accounts using Multiple Google Chrome Profiles**.

---

## 📋 Table of Contents
1. [Quick Installation](#-quick-installation)
2. [How to Use Each Requirement](#-how-to-use-each-requirement)
   - [1. Pokémon Center UK Targeting](#1-pokémon-center-uk-targeting)
   - [2. Keyword-Based Drop Hunting (e.g., ETB)](#2-keyword-based-drop-hunting-eg-etb)
   - [3. Stealth Background Monitoring (No Page Refresh)](#3-stealth-background-monitoring-no-page-refresh)
   - [4. Category Filtering (No Apparel/Clothing)](#4-category-filtering-no-apparelclothing)
   - [5. Auto-Buy & Automated Checkout](#5-auto-buy--automated-checkout)
   - [6. Shipping & Payment Setup (Revolut & Disposable Cards)](#6-shipping--payment-setup-revolut--disposable-cards)
3. [Multi-Account Setup: Using Multiple Chrome Profiles (5–10 Accounts)](#-multi-account-setup-using-multiple-chrome-profiles-510-accounts)
4. [Drop Day Checklist & Anti-Ban Best Practices](#-drop-day-checklist--anti-ban-best-practices)

---

## ⚡ Quick Installation

1. **Install Tampermonkey:**
   - In Google Chrome, install the free [Tampermonkey Extension](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. **Install the Script:**
   - Open Tampermonkey dashboard -> Click the **+** (Add Script) tab.
   - Copy the entire code from `PokemonCenterScript.user.js` and paste it there.
   - Click **File -> Save** (or `Ctrl + S`).
3. **Open Pokémon Center UK:**
   - Navigate to [https://www.pokemoncenter.com/en-gb](https://www.pokemoncenter.com/en-gb).
   - You will see the floating **PokeBot Control Panel** on the page.

---

## 🎯 How to Use Each Requirement

### 1. Pokémon Center UK Targeting
* **Requirement:** The bot must target the UK storefront (`en-gb`) and handle UK postcodes and counties.
* **How to use it:**
  - The bot automatically binds to all `https://www.pokemoncenter.com/en-gb/*` URLs.
  - In the bot UI under **Profile**, fill in UK-specific address details: **Full Name**, **Address Line 1 & 2**, **City**, **County**, and UK **Postcode** (e.g., `SW1A 1AA`).
  - All automated searches and checkout requests route strictly through the UK storefront.

---

### 2. Keyword-Based Drop Hunting (e.g., "ETB")
* **Requirement:** Track items by keyword without needing SKU codes beforehand.
* **How to use it:**
  1. In the bot UI, go to the **Targets** tab.
  2. In the **Target Search URL / Keyword** field:
     - You can enter a keyword like `ETB` or `151 Booster`.
     - Or paste the direct UK search URL: `https://www.pokemoncenter.com/en-gb/search/ETB`.
  3. Click **Save Settings**.
  4. The bot will automatically monitor that search query for matching products.

---

### 3. Stealth Background Monitoring (No Page Refresh)
* **Requirement:** Monitor drops continuously in the background without refreshing the page, preventing anti-bot / Incapsula challenges.
* **How to use it:**
  1. Open the search page (e.g., `https://www.pokemoncenter.com/en-gb/search/ETB`).
  2. Click **▶ START BOT**.
  3. **No-Refresh Background Scans:** The bot performs asynchronous background scans of the search query every few seconds (configurable via Min/Max delay).
  4. **Live Stock Counts:** The UI counter updates in real time:
     - `📊 Scan: Total 36 | ✅ In Stock: 2 | ❌ Out of Stock: 34`
     - Displays badge: `2 In-Stock / 36 Scanned` in vibrant green.
  5. The page never reloads in the frontend, keeping bot detection scores low.

---

### 4. Category Filtering (No Apparel/Clothing)
* **Requirement:** Buy Pokémon TCG/trading products, avoiding unwanted items like clothing/apparel.
* **How to use it:**
  1. Open the **Targets** tab in the bot interface.
  2. Check your **Allowed Categories**:
     - ✅ **TCG (Trading Card Game)**
     - ⬜ **Plush** (Optional)
     - ⬜ **Apparel / Clothing** (Leave **unchecked** to block clothes)
  3. **Strict Category Guard:** If a search result or product page belongs to an unchecked category (like clothing), the bot automatically rejects it, logs `🛑 BLOCKED: Category Not Allowed`, and prevents any purchase.

---

### 5. Auto-Buy & Automated Checkout
* **Requirement:** Automatically add in-stock items to cart and complete checkout quickly.
* **How to use it:**
  1. In the bot UI, ensure the **Auto Buy** checkbox is checked (Enabled).
  2. Set your **Target Quantity** (e.g., `1` or `2`).
  3. When an in-stock item is detected on the search page or product page:
     - The bot immediately navigates to the product page.
     - Selects the quantity.
     - Clicks **Add to Cart**.
     - Automatically transitions to the Cart and proceeds to Checkout.
     - Auto-fills saved shipping details and credit card fields.
  4. **Audio & Push Notifications:** An audible chime will play, and a desktop notification will pop up as soon as stock is secured!

---

### 6. Shipping & Payment Setup (Revolut & Disposable Cards)
* **Requirement:** Compatible with Revolut disposable cards and multiple payment methods.
* **How to use it:**
  1. Go to the **Profile** tab in the bot dashboard.
  2. Enter your card details:
     - **Card Number** (16 digits)
     - **Cardholder Name**
     - **Expiry Month & Year**
     - **CVV / Security Code**
  3. If using **Revolut Disposable Virtual Cards**, generate a disposable card in your Revolut app, enter its details in the bot Profile, and hit **💾 Save Profile**.
  4. Once an order is processed, generate a new virtual card for the next run.

---

## 👥 Multi-Account Setup: Using Multiple Chrome Profiles (5–10 Accounts)

To run **5 to 10 accounts simultaneously** on the same laptop without sessions clashing, use **Multiple Google Chrome Profiles**. 

### 🌟 Why Chrome Profiles Are the Best Method:
* **Complete Session Isolation:** Each Chrome Profile has its own unique cache, cookies, Tampermonkey storage, and Pokémon Center login. Accounts will never log each other out.
* **No Software Conflicts:** You do not need third-party tools; Chrome natively supports unlimited profiles.
* **Different Identities & Cards:** You can save Profile 1 with Address 1 & Card 1, Profile 2 with Address 2 & Card 2, etc.

---

### 🛠️ Step-by-Step Multi-Profile Setup Guide

#### Step 1: Create Your Chrome Profiles
1. Open Google Chrome.
2. In the top-right corner, click on your **Profile icon** (next to the three dots).
3. Scroll down and click **+ Add**.
4. Click **Continue without an account**.
5. Name the profile (e.g., `PokeBot 01`, `PokeBot 02`, etc.) and pick a distinct color theme.
6. Click **Done**.
7. Repeat this to create as many profiles as you need (e.g., 5 to 10 profiles).

---

#### Step 2: Install Tampermonkey & PokeBot on Each Profile
In **each** created Chrome profile:
1. Go to the Chrome Web Store and install [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
2. Open Tampermonkey -> Click **+** (Add Script).
3. Paste `PokemonCenterScript.user.js` and save (`Ctrl + S`).
4. Go to [https://www.pokemoncenter.com/en-gb](https://www.pokemoncenter.com/en-gb).

---

#### Step 3: Configure Unique Information Per Profile
To prevent Pokémon Center from linking your accounts:
1. **Different Account Logins:** Log into a distinct Pokémon Center account in each Chrome window.
2. **Different Shipping Addresses / Name variations:** 
   - Profile 1: *Matthew Smith, 12 High Street, Flat A*
   - Profile 2: *M. Smith, 12 High Street, Flat 1*
3. **Different Cards:** Use distinct Revolut virtual cards or separate bank cards for each profile.
4. Save the Profile tab in each bot UI window.

---

#### Step 4: (Optional) Assigning Proxies Per Profile
If running 5–10 profiles from home, using proxies prevents your home IP from getting rate-limited during heavy drops:
1. In each Chrome Profile, install a free proxy manager extension like **Proxy SwitchyOmega** or your proxy provider's official extension (e.g., Bright Data, IPRoyal).
2. Assign a unique **UK Residential Proxy** IP to each profile.
3. Profile 1 will route through Proxy 1, Profile 2 through Proxy 2, etc.

---

#### Step 5: Running Profiles Concurrently on Drop Day
1. Arrange your Chrome Profile windows across your screen (e.g., side by side using Windows Snap: `Win + Left Arrow` / `Win + Right Arrow`).
2. In each window, open `https://www.pokemoncenter.com/en-gb/search/ETB`.
3. Set your delays (e.g., 5s to 12s on Profile 1, 6s to 14s on Profile 2 to desynchronize requests).
4. Click **▶ START BOT** on all profiles.
5. All 5–10 windows will monitor the drop simultaneously in the background without refreshing!

---

## 🛡️ Drop Day Checklist & Anti-Ban Best Practices

1. **Log In Before the Drop:** Ensure each profile is already logged into its Pokémon Center UK account 15–30 minutes before drop time.
2. **Desynchronize Delays:** Avoid running every profile on the exact same delay. Set Profile 1 to `5s-12s`, Profile 2 to `6s-14s`, Profile 3 to `7s-15s`.
3. **Keep Auto-Buy ON:** Make sure the **Auto Buy** checkbox is checked so the bot immediately snaps up the item the second it drops.
4. **Volume Up:** Ensure your laptop sound is enabled and you clicked on the web page at least once so audio restock chimes can sound.
5. **Keep Windows Open:** Do not minimize the browser windows (you can keep them tiled or in the background, but not minimized) so Chrome doesn't throttle background JavaScript execution.
