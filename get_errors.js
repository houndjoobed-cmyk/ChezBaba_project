const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on("console", (msg) => {
        console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
    });

    page.on("pageerror", (err) => {
        console.log("PAGE ERROR:", err.message);
    });

    try {
        await page.goto("https://chezbaba-shop.netlify.app/vendor/dashboard", {
            waitUntil: "networkidle0",
        });
    } catch (err) {
        console.error("GOTO ERROR:", err);
    }

    await browser.close();
})();
