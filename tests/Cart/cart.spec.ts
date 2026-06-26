import { test, expect } from '../../fixtures';

test.describe('Cart', () => {

    test.describe('con un producto', () => {

        test.beforeEach(async ({ loginPage, inventoryPage }) => {
            await loginPage.navigate();
            await loginPage.login(
                process.env.STANDARD_USER!,
                process.env.PASSWORD!
            );
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await inventoryPage.goToCart();
        });

        test('el carrito muestra el producto agregado', async ({ cartPage }) => {
            const names = await cartPage.getItemNames();
            expect(names).toContain('Sauce Labs Backpack');
        });

        test('eliminar un producto lo remueve del carrito', async ({ cartPage }) => {
            await cartPage.removeItem('Sauce Labs Backpack');
            const count = await cartPage.getCartItemCount();
            expect(count).toBe(0);
        });

        test('continuar comprando redirige al inventario', async ({ cartPage }) => {
            await cartPage.continueShopping();
            await expect(cartPage.page).toHaveURL(/.*inventory/);
        });

        test('el badge desaparece al eliminar el ultimo producto', async ({ cartPage }) => {
            await cartPage.removeItem('Sauce Labs Backpack');
            const badgeVisible = await cartPage.isCartBadgeVisible();
            expect(badgeVisible).toBe(false);
        });

    });

    test.describe('con multiples productos', () => {

        test.beforeEach(async ({ loginPage, inventoryPage }) => {
            await loginPage.navigate();
            await loginPage.login(
                process.env.STANDARD_USER!,
                process.env.PASSWORD!
            );
            await inventoryPage.addToCart('Sauce Labs Backpack');
            await inventoryPage.addToCart('Sauce Labs Bike Light');
            await inventoryPage.goToCart();
        });

        test('el carrito muestra todos los productos agregados', async ({ cartPage }) => {
            const names = await cartPage.getItemNames();
            expect(names).toContain('Sauce Labs Backpack');
            expect(names).toContain('Sauce Labs Bike Light');
        });

        test('el carrito refleja la cantidad correcta de items', async ({ cartPage }) => {
            const count = await cartPage.getCartItemCount();
            expect(count).toBe(2);
        });

    });

});
