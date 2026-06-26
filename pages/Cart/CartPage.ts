import { Page } from '@playwright/test';
import { BasePage } from '../Base/BasePage';

export class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private get cartItems() {
        return this.page.locator('.cart_item');
    }

    private get checkoutButton() {
        return this.page.getByTestId('checkout');
    }

    private get continueShoppingButton() {
        return this.page.getByTestId('continue-shopping');
    }

    async getCartItemCount(): Promise<number> {
        return this.cartItems.count();
    }

    async getItemNames(): Promise<string[]> {
        return this.cartItems.locator('.inventory_item_name').allInnerTexts();
    }

    async removeItem(productName: string): Promise<void> {
        const item = this.cartItems.filter({ hasText: productName });
        await item.getByRole('button', { name: 'Remove' }).click();
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async isCartBadgeVisible(): Promise<boolean> {
        return this.page.locator('.shopping_cart_badge').isVisible();
    }
}
