import { test, expect } from '../../fixtures';

test.describe('Product Detail', () => {

    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.navigate();
    });

    test('clic en un producto navega a su pagina de detalle', async ({ inventoryPage }) => {
        await inventoryPage.goToProductDetail('Sauce Labs Backpack');
        await expect(inventoryPage.page).toHaveURL(/.*inventory-item/);
    });

    test('la pagina de detalle muestra el nombre correcto del producto', async ({ inventoryPage, productDetailPage }) => {
        await inventoryPage.goToProductDetail('Sauce Labs Backpack');
        const name = await productDetailPage.getProductName();
        expect(name).toBe('Sauce Labs Backpack');
    });

    test('la pagina de detalle muestra el precio correcto del producto', async ({ inventoryPage, productDetailPage }) => {
        await inventoryPage.goToProductDetail('Sauce Labs Backpack');
        const price = await productDetailPage.getProductPrice();
        expect(price).toBe('$29.99');
    });

    test('agregar al carrito desde el detalle actualiza el badge', async ({ inventoryPage, productDetailPage }) => {
        await inventoryPage.goToProductDetail('Sauce Labs Backpack');
        await productDetailPage.addToCart();
        const count = await inventoryPage.getCartCount();
        expect(count).toBe('1');
    });

    test('el boton back regresa al inventario', async ({ inventoryPage, productDetailPage }) => {
        await inventoryPage.goToProductDetail('Sauce Labs Backpack');
        await productDetailPage.goBack();
        await expect(productDetailPage.page).toHaveURL(/.*inventory\.html/);
    });

});
