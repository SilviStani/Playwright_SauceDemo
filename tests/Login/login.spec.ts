import { test, expect } from '../../fixtures';

test.describe('Login', () => {

    test.use({ storageState: { cookies: [], origins: [] } });

    test('login exitoso redirige a inventario', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(
            process.env.STANDARD_USER!,
            process.env.PASSWORD!
        );

        await expect(loginPage.page).toHaveURL(/.*inventory/);
    });

    test('usuario bloqueado ve mensaje de error', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(
            process.env.LOCKED_OUT_USER!,
            process.env.PASSWORD!
        );

        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Sorry, this user has been locked out.');
    });

    test('campos vacios muestran error de validacion', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login('', '');

        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username is required');
    });

    test('password incorrecto muestra error de credenciales', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(process.env.STANDARD_USER!, 'wrong_password');

        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username and password do not match any user in this service');
    });

    test('username vacio con password completo muestra error de validacion', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login('', process.env.PASSWORD!);

        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username is required');
    });

    test('cerrar el mensaje de error lo oculta', async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login('', '');
        await loginPage.closeErrorMessage();
        const visible = await loginPage.isErrorVisible();
        expect(visible).toBe(false);
    });

});
