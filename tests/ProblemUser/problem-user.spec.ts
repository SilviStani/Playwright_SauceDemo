import { test, expect } from '../../fixtures';

test.describe('Problem User', () => {

    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(process.env.PROBLEM_USER!, process.env.PASSWORD!);
    });

    test('todas las imagenes del inventario muestran el mismo src incorrecto', async ({ inventoryPage }) => {
        const srcs = await inventoryPage.getProductImageSrcs();
        const unique = new Set(srcs);
        // Para problem_user todas las imagenes apuntan al mismo archivo incorrecto
        expect(unique.size).toBe(1);
    });

    test('el ordenamiento Z a A no cambia el orden de los productos', async ({ inventoryPage }) => {
        const namesAntesDeSortear = await inventoryPage.getProductNames();
        await inventoryPage.sortBy('za');
        const namesDespuesDeSortear = await inventoryPage.getProductNames();
        // Para problem_user el sort no tiene efecto — el orden no cambia
        expect(namesDespuesDeSortear).toEqual(namesAntesDeSortear);
    });

    test('el campo last name no acepta input en el formulario de checkout', async ({ inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInfo('Jane', 'Doe', '12345');
        await checkoutPage.continue();
        // Para problem_user el campo Last Name se limpia solo — no acepta input
        const error = await checkoutPage.getErrorMessage();
        expect(error).toContain('Last Name is required');
    });

});
