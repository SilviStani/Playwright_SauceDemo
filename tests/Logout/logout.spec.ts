import { test, expect } from '../../fixtures';

test.describe('Logout', () => {

    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.navigate();
    });

    test('logout redirige a la pagina de login', async ({ inventoryPage }) => {
        await inventoryPage.logout();
        await expect(inventoryPage.page).toHaveURL('/');
    });

    test('despues de logout el campo de usuario es visible', async ({ inventoryPage, loginPage }) => {
        await inventoryPage.logout();
        await expect(loginPage.page.getByPlaceholder('Username')).toBeVisible();
    });

});
