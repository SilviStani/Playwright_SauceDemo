import { test, expect } from '../../fixtures';

test.describe('Inventory', () => {

    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.navigate();
    });

    test('la pagina de inventario muestra el titulo Products', async ({ inventoryPage }) => {
        const title = await inventoryPage.getPageTitle();
        expect(title).toBe('Products');
    });

    test('se muestran 6 productos en el inventario', async ({ inventoryPage }) => {
        const count = await inventoryPage.getProductCount();
        expect(count).toBe(6);
    });

    test('agregar un producto al carrito actualiza el badge a 1', async ({ inventoryPage }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        const count = await inventoryPage.getCartCount();
        expect(count).toBe('1');
    });

    test('ordenar Z a A muestra el producto correcto primero', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('za');
        const first = await inventoryPage.getFirstProductName();
        expect(first).toBe('Test.allTheThings() T-Shirt (Red)');
    });

    test('ordenar por precio menor a mayor muestra el producto mas barato primero', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('lohi');
        const price = await inventoryPage.getFirstProductPrice();
        expect(price).toBe('$7.99');
    });

    test('ordenar por precio mayor a menor muestra el producto mas caro primero', async ({ inventoryPage }) => {
        await inventoryPage.sortBy('hilo');
        const price = await inventoryPage.getFirstProductPrice();
        expect(price).toBe('$49.99');
    });

});
