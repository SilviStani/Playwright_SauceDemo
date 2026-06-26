import { test, expect } from '../../fixtures';

test.describe('Checkout', () => {

    test.beforeEach(async ({ inventoryPage, cartPage }) => {
        await inventoryPage.navigate();
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
    });

    test('completar el formulario avanza al resumen del pedido', async ({ checkoutPage }) => {
        await checkoutPage.fillShippingInfo('Jane', 'Doe', '12345');
        await checkoutPage.continue();
        await expect(checkoutPage.page).toHaveURL(/.*checkout-step-two/);
    });

    test('el resumen muestra el producto agregado', async ({ checkoutPage }) => {
        await checkoutPage.fillShippingInfo('Jane', 'Doe', '12345');
        await checkoutPage.continue();
        const items = await checkoutPage.getSummaryItemNames();
        expect(items).toContain('Sauce Labs Backpack');
    });

    test('finalizar la compra muestra el mensaje de confirmacion', async ({ checkoutPage }) => {
        await checkoutPage.fillShippingInfo('Jane', 'Doe', '12345');
        await checkoutPage.continue();
        await checkoutPage.finish();
        const message = await checkoutPage.getConfirmationMessage();
        expect(message).toBe('Thank you for your order!');
    });

    test('enviar formulario vacio muestra error de validacion', async ({ checkoutPage }) => {
        await checkoutPage.continue();
        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('First Name is required');
    });

    test('cancelar en el formulario vuelve al carrito', async ({ checkoutPage }) => {
        await checkoutPage.cancel();
        await expect(checkoutPage.page).toHaveURL(/.*cart/);
    });

});
