import { Page } from '@playwright/test';
import { BasePage } from '../Base/BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private get usernameInput() {
        return this.page.getByPlaceholder('Username');
    }

    private get passwordInput() {
        return this.page.getByPlaceholder('Password');
    }

    private get loginButton() {
        return this.page.getByRole('button', { name: 'Login' });
    }

    private get errorMessage() {
        return this.page.getByTestId('error');
    }

    async navigate(): Promise<void> {
        await super.navigate('/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(): Promise<string> {
        await this.waitForElement(this.errorMessage);
        return this.errorMessage.innerText();
    }

    async closeErrorMessage(): Promise<void> {
        await this.page.getByTestId('error-button').click();
    }

    async isErrorVisible(): Promise<boolean> {
        return this.errorMessage.isVisible();
    }
}
