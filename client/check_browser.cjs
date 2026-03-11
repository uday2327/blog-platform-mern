const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
        page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
        page.on('requestfailed', request => console.log('BROWSER NETWORK ERROR:', request.url(), request.failure().errorText));

        console.log('Navigating to http://localhost:5173 ...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
        
        console.log('Page loaded successfully. Waiting 2 seconds for dynamic errors...');
        await new Promise(r => setTimeout(r, 2000));
        
        await browser.close();
    } catch (err) {
        console.error('PUPPETEER CRASH:', err.message);
        process.exit(1);
    }
})();
