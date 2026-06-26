import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string = ''): Promise<void> {
        await this.page.goto(path);
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async waitForElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    async openMenu(): Promise<void> {
        await this.page.locator('.bm-burger-button').click();
        await this.page.locator('.bm-menu').waitFor({ state: 'visible' });
    }

    async logout(): Promise<void> {
        await this.openMenu();
        await this.page.locator('#logout_sidebar_link').click();
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator('.shopping_cart_badge').isVisible();
    }
}
