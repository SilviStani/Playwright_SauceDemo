import { Page } from '@playwright/test';
import { BasePage } from '../Base/BasePage';

export class InventoryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private get pageTitle() {
        return this.page.locator('.title');
    }

    private get productItems() {
        return this.page.locator('.inventory_item');
    }

    private get cartBadge() {
        return this.page.locator('.shopping_cart_badge');
    }

    async navigate(): Promise<void> {
        await super.navigate('/inventory.html');
    }

    async getPageTitle(): Promise<string> {
        await this.waitForElement(this.pageTitle);
        return this.pageTitle.innerText();
    }

    async getProductCount(): Promise<number> {
        return this.productItems.count();
    }

    async getProductNames(): Promise<string[]> {
        return this.productItems.locator('.inventory_item_name').allInnerTexts();
    }

    async addToCart(productName: string): Promise<void> {
        const item = this.productItems.filter({ hasText: productName });
        await item.getByRole('button', { name: 'Add to cart' }).click();
    }

    async getCartCount(): Promise<string> {
        await this.waitForElement(this.cartBadge);
        return this.cartBadge.innerText();
    }

    async goToCart(): Promise<void> {
        await this.page.locator('.shopping_cart_link').click();
    }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.page.locator('.product_sort_container').selectOption(option);
    }

    async getFirstProductName(): Promise<string> {
        return this.productItems.first().locator('.inventory_item_name').innerText();
    }

    async getFirstProductPrice(): Promise<string> {
        return this.productItems.first().locator('.inventory_item_price').innerText();
    }

    async goToProductDetail(productName: string): Promise<void> {
        const item = this.productItems.filter({ hasText: productName });
        await item.locator('.inventory_item_name').click();
    }

    async getProductImageSrcs(): Promise<(string | null)[]> {
        return this.productItems.locator('img').evaluateAll(
            (imgs: HTMLImageElement[]) => imgs.map(img => img.getAttribute('src'))
        );
    }


}
