import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/Login/LoginPage';
import { InventoryPage } from './pages/Inventory/InventoryPage';
import { CartPage } from './pages/Cart/CartPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';

type Pages = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};

export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    inventoryPage: async ({ page }, use) => {
        const inventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    },
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
});

export { expect };
