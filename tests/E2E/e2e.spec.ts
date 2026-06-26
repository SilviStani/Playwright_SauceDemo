import { test, expect } from '../../fixtures';

test.describe('E2E', () => {

    test.use({ storageState: { cookies: [], origins: [] } });

    test('flujo completo: login, agregar productos, checkout y confirmacion', async ({
        loginPage,
        inventoryPage,
        cartPage,
        checkoutPage,
    }) => {
        // Login
        await loginPage.navigate();
        await loginPage.login(
            process.env.STANDARD_USER!,
            process.env.PASSWORD!
        );
        await expect(loginPage.page).toHaveURL(/.*inventory/);

        // Agregar 2 productos desde inventario
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Fleece Jacket');
        const badgeCount = await inventoryPage.getCartCount();
        expect(badgeCount).toBe('2');

        // Verificar carrito
        await inventoryPage.goToCart();
        const cartItems = await cartPage.getItemNames();
        expect(cartItems).toContain('Sauce Labs Backpack');
        expect(cartItems).toContain('Sauce Labs Fleece Jacket');

        // Checkout — paso 1: formulario
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInfo('Jane', 'Doe', '12345');
        await checkoutPage.continue();
        await expect(checkoutPage.page).toHaveURL(/.*checkout-step-two/);

        // Checkout — paso 2: resumen
        const summaryItems = await checkoutPage.getSummaryItemNames();
        expect(summaryItems).toContain('Sauce Labs Backpack');
        expect(summaryItems).toContain('Sauce Labs Fleece Jacket');

        // Checkout — paso 3: confirmación
        await checkoutPage.finish();
        const confirmation = await checkoutPage.getConfirmationMessage();
        expect(confirmation).toBe('Thank you for your order!');
    });

});
