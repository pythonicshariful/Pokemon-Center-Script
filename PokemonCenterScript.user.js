// ==UserScript==
// @name         Pokemon Center Script
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Advanced script for pokemoncenter.com with UI Console and Checkout Autofiill
// @author       You
// @match        https://www.pokemoncenter.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let uiContainer = null;
    let consoleContainer = null;
    let lastUrl = '';
    let isBotRunning = false;
    let botActionInProgress = false;

    // Helper to simulate sleep/delays
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Simulate human click with full event lifecycle and random micro-delays
    async function simulateHumanClick(element) {
        const events = ['mouseover', 'mousedown', 'mouseup', 'click'];
        for (const eventType of events) {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: eventType === 'mouseover' ? 0 : 1
            });
            element.dispatchEvent(event);
            await sleep(10 + Math.random() * 20); 
        }
    }

    // Simulate human typing for React-based inputs
    async function simulateHumanType(element, text) {
        if (!element || !text) return;
        
        element.focus();
        // Trigger React's onChange by using the native value setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        
        // Clear existing value if any
        nativeInputValueSetter.call(element, "");
        element.dispatchEvent(new Event('input', { bubbles: true }));
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            nativeInputValueSetter.call(element, element.value + char);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Random human typing delay (30ms - 100ms)
            await sleep(30 + Math.random() * 70); 
        }
        
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        
        // Pause slightly between fields
        await sleep(200 + Math.random() * 300);
    }

    // Function to append logs to our custom UI console
    function logToConsole(message, type = 'info') {
        if (!consoleContainer) return;
        
        const time = new Date().toLocaleTimeString();
        let color = '#ccc';
        if (type === 'success') color = '#28a745';
        if (type === 'error') color = '#dc3545';
        if (type === 'warning') color = '#ffcc00';
        if (type === 'info') color = '#00d2ff';
        
        const logLine = document.createElement('div');
        logLine.style.color = color;
        logLine.style.marginBottom = '6px';
        logLine.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        logLine.style.paddingBottom = '4px';
        logLine.innerHTML = `<span style="color: #666; font-size: 11px;">[${time}]</span> ${message}`;
        
        consoleContainer.appendChild(logLine);
        // Auto scroll to bottom
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
    }

    // Function to initialize the Beautiful UI
    function initUI() {
        if (!uiContainer) {
            uiContainer = document.createElement('div');
            uiContainer.id = 'pokemon-center-script-ui';
            uiContainer.style.position = 'fixed';
            uiContainer.style.bottom = '20px';
            uiContainer.style.right = '20px';
            uiContainer.style.backgroundColor = 'rgba(15, 20, 25, 0.95)';
            uiContainer.style.color = '#fff';
            uiContainer.style.padding = '15px';
            uiContainer.style.borderRadius = '10px';
            uiContainer.style.zIndex = '999999';
            uiContainer.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
            uiContainer.style.fontSize = '14px';
            uiContainer.style.boxShadow = '0 8px 24px rgba(0,0,0,0.8)';
            uiContainer.style.pointerEvents = 'auto'; 
            uiContainer.style.width = '340px';
            uiContainer.style.border = '1px solid #333';
            uiContainer.style.maxHeight = '90vh';
            uiContainer.style.overflowY = 'auto';
            
            document.body.appendChild(uiContainer);
        }
        
        uiContainer.innerHTML = `
            <div id="botPageType" style="margin-bottom: 15px; font-size: 16px; font-weight: bold; color: #fff;">🌐 Initializing...</div>
            
            <!-- Controls -->
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">
                <label style="font-weight: bold; color: #ccc;">Target Qty:</label>
                <input type="number" id="botTargetQty" value="1" min="1" max="99" style="width: 60px; padding: 4px; background: #222; color: #fff; border-radius: 4px; border: 1px solid #555;" />
            </div>
            
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                <button id="botStartBtn" style="flex: 1; padding: 8px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 4px; font-weight: bold; transition: 0.2s;">▶ Start</button>
                <button id="botStopBtn" style="flex: 1; padding: 8px; cursor: pointer; background: #dc3545; color: white; border: none; border-radius: 4px; font-weight: bold; transition: 0.2s;">⏹ Stop</button>
            </div>

            <!-- Profile Settings -->
            <details style="margin-bottom: 15px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">
                <summary style="cursor: pointer; font-weight: bold; color: #ffcc00; outline: none;">⚙️ Shipping Profile (For Checkout)</summary>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <input type="text" id="p_fn" placeholder="First Name" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <input type="text" id="p_ln" placeholder="Last Name" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <input type="text" id="p_addr" placeholder="Street Address" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <input type="text" id="p_apt" placeholder="Apt/Suite (Optional)" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <input type="text" id="p_zip" placeholder="Zip Code" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <input type="text" id="p_phone" placeholder="Phone Number" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <input type="email" id="p_email" placeholder="Email" style="padding: 4px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
                    <button id="botSaveProfileBtn" style="padding: 4px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Profile</button>
                </div>
            </details>
            
            <!-- Terminal Log -->
            <div style="font-size: 11px; font-weight: bold; color: #888; margin-bottom: 5px; letter-spacing: 1px;">TERMINAL LOG</div>
            <div id="botConsole" style="background: #000; border-radius: 6px; padding: 10px; height: 180px; overflow-y: auto; font-family: 'Consolas', monospace; font-size: 12px; border: 1px solid #333; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);">
            </div>
        `;

        consoleContainer = document.getElementById('botConsole');

        // Attach event listeners
        const startBtn = document.getElementById('botStartBtn');
        const stopBtn = document.getElementById('botStopBtn');
        const qtyInput = document.getElementById('botTargetQty');

        // Profile Elements
        const p_fn = document.getElementById('p_fn');
        const p_ln = document.getElementById('p_ln');
        const p_addr = document.getElementById('p_addr');
        const p_apt = document.getElementById('p_apt');
        const p_zip = document.getElementById('p_zip');
        const p_phone = document.getElementById('p_phone');
        const p_email = document.getElementById('p_email');
        const saveProfileBtn = document.getElementById('botSaveProfileBtn');

        // Load Settings
        if (qtyInput) qtyInput.value = localStorage.getItem('pc_bot_target_qty') || '1';
        if (p_fn) p_fn.value = localStorage.getItem('pc_bot_fn') || '';
        if (p_ln) p_ln.value = localStorage.getItem('pc_bot_ln') || '';
        if (p_addr) p_addr.value = localStorage.getItem('pc_bot_addr') || '';
        if (p_apt) p_apt.value = localStorage.getItem('pc_bot_apt') || '';
        if (p_zip) p_zip.value = localStorage.getItem('pc_bot_zip') || '';
        if (p_phone) p_phone.value = localStorage.getItem('pc_bot_phone') || '';
        if (p_email) p_email.value = localStorage.getItem('pc_bot_email') || '';

        if (qtyInput) {
            qtyInput.addEventListener('change', (e) => {
                localStorage.setItem('pc_bot_target_qty', e.target.value);
            });
        }

        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                localStorage.setItem('pc_bot_fn', p_fn.value);
                localStorage.setItem('pc_bot_ln', p_ln.value);
                localStorage.setItem('pc_bot_addr', p_addr.value);
                localStorage.setItem('pc_bot_apt', p_apt.value);
                localStorage.setItem('pc_bot_zip', p_zip.value);
                localStorage.setItem('pc_bot_phone', p_phone.value);
                localStorage.setItem('pc_bot_email', p_email.value);
                logToConsole("Profile saved locally.", "success");
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!isBotRunning) {
                    isBotRunning = true;
                    localStorage.setItem('pc_bot_running', 'true');
                    logToConsole('Bot started manually.', 'success');
                    updateButtons();
                }
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                if (isBotRunning) {
                    isBotRunning = false;
                    localStorage.setItem('pc_bot_running', 'false');
                    botActionInProgress = false; 
                    logToConsole('Bot stopped manually.', 'error');
                    updateButtons();
                }
            });
        }
    }

    function updateButtons() {
        const startBtn = document.getElementById('botStartBtn');
        const stopBtn = document.getElementById('botStopBtn');
        if (startBtn) {
            startBtn.style.opacity = isBotRunning ? '0.4' : '1';
            startBtn.disabled = isBotRunning;
        }
        if (stopBtn) {
            stopBtn.style.opacity = !isBotRunning ? '0.4' : '1';
            stopBtn.disabled = !isBotRunning;
        }
    }

    // Helper to extract the cart count from the header element
    function getCartCount() {
        const cartEl = document.querySelector('a.header-cart--_2R2kd');
        if (cartEl) {
            return parseInt(cartEl.getAttribute('data-count') || "0", 10);
        }
        return -1; // Cart element not found
    }

    // --- Product Page Logic ---
    async function executeProductPageBot() {
        if (!isBotRunning || botActionInProgress) return;
        botActionInProgress = true;
        
        const targetQty = parseInt(document.getElementById('botTargetQty')?.value || "1", 10);
        
        const increaseBtn = document.getElementById('increaseQty');
        const decreaseBtn = document.getElementById('decreaseQty');
        const input = document.getElementById('productQuantity');
        
        let addToCartBtn = document.querySelector('button.add-to-cart-button--PZmQF');
        if (!addToCartBtn) {
            const btns = Array.from(document.querySelectorAll('button'));
            addToCartBtn = btns.find(b => b.innerText && b.innerText.includes('Add to Cart'));
        }

        if (!input || (!increaseBtn && !decreaseBtn)) {
            logToConsole("Waiting for Quantity controls...", "warning");
            await sleep(1500);
            botActionInProgress = false;
            return;
        }

        if (!addToCartBtn) {
            logToConsole("Waiting for 'Add to Cart' button...", "warning");
            await sleep(1500);
            botActionInProgress = false;
            return;
        }

        let currentQty = parseInt(input.value, 10) || 1;
        
        if (currentQty !== targetQty) {
            logToConsole(`Adjusting qty: ${currentQty} -> ${targetQty}`, "info");
        }

        let attempts = 0;
        const maxAttempts = 100;
        
        // Step 1: Adjust Quantity via human clicks
        while (currentQty !== targetQty && attempts < maxAttempts && isBotRunning) {
            attempts++;
            if (currentQty < targetQty) {
                if (increaseBtn && increaseBtn.disabled) break;
                await simulateHumanClick(increaseBtn);
            } else if (currentQty > targetQty) {
                if (decreaseBtn && decreaseBtn.disabled) break;
                await simulateHumanClick(decreaseBtn);
            }
            
            await sleep(250 + Math.random() * 200); 
            currentQty = parseInt(input.value, 10);
        }

        if (!isBotRunning) {
            botActionInProgress = false;
            return;
        }

        // Step 2: Add to Cart and Verify
        if (addToCartBtn && !addToCartBtn.disabled) {
            const initialCartCount = getCartCount();
            
            await sleep(400 + Math.random() * 500); 
            logToConsole(`Clicking 'Add to Cart'...`, "info");
            await simulateHumanClick(addToCartBtn);
            
            logToConsole(`Verifying cart addition...`, "warning");
            
            let added = false;
            for (let i = 0; i < 20; i++) { 
                await sleep(500);
                const newCartCount = getCartCount();
                if (newCartCount !== -1 && newCartCount > initialCartCount) {
                    added = true;
                    logToConsole(`✅ Added! New Cart Count is: ${newCartCount}`, "success");
                    break;
                }
            }
            
            if (!added) {
                logToConsole(`❌ Cart count didn't increase in time.`, "error");
            } else {
                logToConsole(`Proceeding to Cart...`, "info");
                await sleep(500 + Math.random() * 500); 
                
                const cartBtn = document.querySelector('a.header-cart--_2R2kd');
                if (cartBtn) {
                    await simulateHumanClick(cartBtn);
                    cartBtn.click(); 
                }
            }
        } else {
            logToConsole(`❌ 'Add to Cart' button is disabled.`, "error");
        }

        await sleep(3000);
        botActionInProgress = false;
    }

    // --- Cart Page Logic ---
    async function executeCartPageBot() {
        if (!isBotRunning || botActionInProgress) return;
        botActionInProgress = true;
        
        logToConsole(`Looking for Guest Checkout...`, "info");
        await sleep(1000 + Math.random() * 500);
        
        const guestCheckoutBtn = document.getElementById('guest-checkout');
        
        if (!guestCheckoutBtn) {
            logToConsole(`Waiting for Guest Checkout...`, "warning");
            await sleep(1000);
            botActionInProgress = false;
            return;
        }

        if (guestCheckoutBtn.disabled) {
            logToConsole(`Guest Checkout is disabled. Waiting...`, "warning");
            await sleep(1000);
            botActionInProgress = false;
            return;
        }

        logToConsole(`Clicking Guest Checkout...`, "success");
        await sleep(500 + Math.random() * 500);
        await simulateHumanClick(guestCheckoutBtn);
        guestCheckoutBtn.click(); 
        
        logToConsole(`✅ Proceeding to Checkout Form!`, "success");

        await sleep(3000);
        botActionInProgress = false;
    }

    // --- Checkout Page Logic ---
    async function executeCheckoutPageBot() {
        if (!isBotRunning || botActionInProgress) return;
        botActionInProgress = true;
        
        logToConsole(`Looking for Shipping Form...`, "info");
        await sleep(2000 + Math.random() * 1000); // Give the form time to load
        
        const firstName = document.getElementById('shipping-givenName');
        const lastName = document.getElementById('shipping-familyName');
        
        if (!firstName || !lastName) {
            logToConsole(`Shipping form not found yet...`, "warning");
            await sleep(1000);
            botActionInProgress = false;
            return;
        }

        logToConsole(`Filling shipping form...`, "info");
        
        // Retrieve settings
        const p_fn = localStorage.getItem('pc_bot_fn') || '';
        const p_ln = localStorage.getItem('pc_bot_ln') || '';
        const p_addr = localStorage.getItem('pc_bot_addr') || '';
        const p_apt = localStorage.getItem('pc_bot_apt') || '';
        const p_zip = localStorage.getItem('pc_bot_zip') || '';
        const p_phone = localStorage.getItem('pc_bot_phone') || '';
        const p_email = localStorage.getItem('pc_bot_email') || '';

        if (!p_fn || !p_ln || !p_addr || !p_zip || !p_phone || !p_email) {
            logToConsole(`❌ Profile incomplete! Fill settings in UI.`, "error");
            isBotRunning = false;
            localStorage.setItem('pc_bot_running', 'false');
            updateButtons();
            botActionInProgress = false;
            return;
        }

        // Fill fields humanly
        if (firstName) await simulateHumanType(firstName, p_fn);
        if (lastName) await simulateHumanType(lastName, p_ln);
        
        const street = document.getElementById('shipping-streetAddress');
        if (street) await simulateHumanType(street, p_addr);
        
        const ext = document.getElementById('shipping-extendedAddress');
        if (ext && p_apt) await simulateHumanType(ext, p_apt);
        
        const zip = document.getElementById('shipping-postalCode');
        if (zip) await simulateHumanType(zip, p_zip);
        
        const phone = document.getElementById('shipping-phoneNumber');
        if (phone) await simulateHumanType(phone, p_phone);
        
        const email = document.getElementById('shipping-email');
        if (email) await simulateHumanType(email, p_email);
        
        logToConsole(`✅ Shipping Form filled!`, "success");
        
        logToConsole(`Looking for CONTINUE button...`, "info");
        await sleep(500 + Math.random() * 500); // Wait before clicking continue
        
        // Look for the continue button by value or text
        let continueBtn = document.querySelector('button[value="CONTINUE"]');
        if (!continueBtn) {
            const btns = Array.from(document.querySelectorAll('button'));
            continueBtn = btns.find(b => b.innerText && b.innerText.includes('CONTINUE'));
        }

        if (continueBtn) {
            logToConsole(`Clicking CONTINUE...`, "success");
            await simulateHumanClick(continueBtn);
            continueBtn.click(); // Ensure click triggers
        } else {
            logToConsole(`❌ CONTINUE button not found.`, "error");
        }
        
        // Stop the bot so the user can verify payment details
        isBotRunning = false;
        localStorage.setItem('pc_bot_running', 'false');
        updateButtons();
        logToConsole(`Bot halted. Please review payment screen.`, "warning");

        await sleep(3000);
        botActionInProgress = false;
    }


    // Function to check URL and state, update Title
    function checkUrlAndUI() {
        const currentUrl = window.location.href;
        const pageTypeEl = document.getElementById('botPageType');
        
        let message = "🌐 General Page";
        if (currentUrl.includes('/checkout/')) {
            message = "💳 Checkout Page Detected";
        } else if (currentUrl.includes('/product/')) {
            message = "🛍️ Product Page Detected";
        } else if (currentUrl.includes('/search/')) {
            message = "🔍 Search Page Detected";
        } else if (currentUrl.includes('/cart')) {
            message = "🛒 Cart Page Detected";
        }
        
        if (pageTypeEl && currentUrl !== lastUrl) {
            pageTypeEl.innerText = message;
            lastUrl = currentUrl;
            logToConsole(`Navigated: ${message}`, "info");
        }
    }

    // Main loop to continuously evaluate bot actions
    async function botLoop() {
        if (isBotRunning) {
            const currentUrl = window.location.href;
            if (currentUrl.includes('/product/')) {
                await executeProductPageBot();
            } else if (currentUrl.includes('/cart')) {
                await executeCartPageBot();
            } else if (currentUrl.includes('/checkout/')) {
                await executeCheckoutPageBot();
            }
        }
    }

    // Initialize UI
    initUI();
    logToConsole("System initialized.", "success");
    
    // Restore bot state
    if (localStorage.getItem('pc_bot_running') === 'true') {
        isBotRunning = true;
        updateButtons();
        logToConsole("Restored state: Bot is running.", "info");
    } else {
        updateButtons();
    }

    checkUrlAndUI();
    
    // Monitor for navigation/SPA changes
    setInterval(checkUrlAndUI, 500);
    
    // Evaluate bot conditions frequently
    setInterval(botLoop, 1000);

})();
