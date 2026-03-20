import path from "node:path";
import { chromium, type Page } from "@playwright/test";

async function verifySalon(): Promise<void> {
  console.log("Starting visual verification on PREVIEW...");
  const browser = await chromium.launch();
  const page: Page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`CONSOLE ERROR: "${msg.text()}"`);
  });

  page.on("pageerror", (err) => {
    console.log(`PAGE ERROR: "${err.message}"`);
  });

  try {
    console.log("Navigating to http://localhost:4173/#/proyectos/salon");
    await page.goto("http://localhost:4173/#/proyectos/salon", {
      waitUntil: "networkidle",
    });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(3000);

    const screenshotPath = path.resolve("salon-verification-preview.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    const textLocator = page.getByText("Zero Vanity");
    const isVisible = await textLocator.first().isVisible();

    if (isVisible) {
      console.log('SUCCESS: "Zero Vanity" branding detected.');
    } else {
      console.log('WARNING: "Zero Vanity" branding NOT detected.');
    }
  } catch (error) {
    console.error("Verification failed:", error);
  } finally {
    await browser.close();
  }
}

verifySalon();
