import { Page } from '@playwright/test';
import { BasePage } from '../Base/BasePage';

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private get firstNameInput() {
        return this.page.getByTestId('firstName');
    }

    private get lastNameInput() {
        return this.page.getByTestId('lastName');
    }

    private get zipCodeInput() {
        return this.page.getByTestId('postalCode');
    }

    private get continueButton() {
        return this.page.getByTestId('continue');
    }

    private get cancelButton() {
        return this.page.getByTestId('cancel');
    }

    private get errorMessage() {
        return this.page.getByTestId('error');
    }

    private get finishButton() {
        return this.page.getByTestId('finish');
    }

    private get orderTotal() {
        return this.page.locator('.summary_total_label');
    }

    private get confirmationHeader() {
        return this.page.locator('.complete-header');
    }

    private get summaryItems() {
        return this.page.locator('.cart_item');
    }

    async fillShippingInfo(firstName: string, lastName: string, zip: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zip);
    }

    async continue(): Promise<void> {
        await this.continueButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async getErrorMessage(): Promise<string> {
        await this.waitForElement(this.errorMessage);
        return this.errorMessage.innerText();
    }

    async getOrderTotal(): Promise<string> {
        await this.waitForElement(this.orderTotal);
        return this.orderTotal.innerText();
    }

    async getSummaryItemNames(): Promise<string[]> {
        return this.summaryItems.locator('.inventory_item_name').allInnerTexts();
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }

    async getConfirmationMessage(): Promise<string> {
        await this.waitForElement(this.confirmationHeader);
        return this.confirmationHeader.innerText();
    }
}
