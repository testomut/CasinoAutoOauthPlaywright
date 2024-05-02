import { expect, Page } from '@playwright/test';
import { OauthData, FieldNameLogin } from '../types/Types';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Opens the login page and clicks the sign-in button.
    async open() {
        await this.page.goto('https://www.vbet.ua/en/');
        await this.page.locator('.sign-in').click();
    }

    // Logs in using the provided OAuth credentials.
    async login(credentials: OauthData) {
        await this.page.fill('input[name="username"]', credentials.login);
        await this.page.fill('input[name="password"]', credentials.password);
        await this.page.click('button[type="submit"]');
    }

    // Closes the verification popup and waits for the user avatar to be visible, indicating login is successful.
    async closePopUpCompleteVerification() {
        await this.page.click('div:nth-child(7) > .popup-middleware-bc > .popup-inner-bc > .e-p-close-icon-bc');
        await this.page.waitForSelector('.hdr-user-avatar-icon-bc');
    }

    // Verifies if the login success message is displayed and closes the popup.
    async verifyLoginSuccess() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Before betting, complete verification. Verify your account with Diia, BankID or use the quick verification form. You can upload an additional document in the personal cabinet.');
        this.closePopUpCompleteVerification();
    }

    // Checks for the authentication error message when login fails.
    async AuthenticationErrorChecker() {
        const locator = this.page.locator('.entrance-f-error-message-bc');
        await expect(locator).toContainText('Invalid Username or Password');
    }

    // Checks for input errors based on the field name, distinguishing between email and password fields.
    async checkForInputErrors(input: FieldNameLogin) {
        const num = input === "email" ? 0 : 1;
        await expect(this.page.locator(`.entrance-f-item-bc`).nth(num).locator('.form-control-message-holder-bc').isHidden).toBeTruthy;
    }

    // Logs out the user and closes the verification popup if it's open.
    async logOut() {
        await this.closePopUpCompleteVerification();
        await this.page.hover('.hdr-user-avatar-icon-bc');
        await this.page.click('.logout-profile .btn');
    }

    // Validates that the user is logged out by checking that the user avatar is hidden.
    async LogoutValidator() {
        await expect(this.page.locator('.hdr-user-avatar-icon-bc').isHidden).toBeTruthy;
    }

    // Initiates the password reset process.
    async resetPassword(email: string) {
        await this.page.click('.sg-n-forgot-password');
        await this.page.fill('input[name="email"]', email);
        await this.page.click('.entrance-form-action-item-bc .btn');
    }

    // Checks for a successful password reset confirmation message.
    async resetPasswordSuccessCheck() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Password reset complete. Please check your email.');
    }

    // Checks if there are any visible error messages after a failed password reset attempt.
    async resetPasswordFailureCheck() {
        await expect(this.page.locator('.form-control-message-bc').isHidden).toBeTruthy;
    }
}
