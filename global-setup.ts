import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(process.env.BASE_URL!);
    await page.getByPlaceholder('Username').fill(process.env.STANDARD_USER!);
    await page.getByPlaceholder('Password').fill(process.env.PASSWORD!);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*inventory/);

    await page.context().storageState({ path: 'auth.json' });
    await browser.close();
}

export default globalSetup;
