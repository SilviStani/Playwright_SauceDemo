import { test, expect } from '../../fixtures';

test.describe('Logout', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(
            process.env.STANDARD_USER!,
            process.env.PASSWORD!
        );
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
