import { Page } from '@playwright/test';
import { BasePage } from '../Base/BasePage';

export class ProductDetailPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private get productName() {
        return this.page.locator('.inventory_details_name');
    }

    private get productPrice() {
        return this.page.locator('.inventory_details_price');
    }

    private get productDescription() {
        return this.page.locator('.inventory_details_desc');
    }

    private get addToCartButton() {
        return this.page.getByRole('button', { name: 'Add to cart' });
    }

    private get backButton() {
        return this.page.getByTestId('back-to-products');
    }

    async getProductName(): Promise<string> {
        await this.waitForElement(this.productName);
        return this.productName.innerText();
    }

    async getProductPrice(): Promise<string> {
        return this.productPrice.innerText();
    }

    async getProductDescription(): Promise<string> {
        return this.productDescription.innerText();
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }
}
