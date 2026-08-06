import { expect, Page } from '@playwright/test';
import { OauthData, FieldNameLogin } from '../types/Types';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('/en/');
        await this.page.locator('.sign-in').click();
    }

    async login(credentials: OauthData) {
        await this.page.fill('input[name="username"]', credentials.login);
        await this.page.fill('input[name="password"]', credentials.password);
        await this.page.click('button[type="submit"]');
    }

    async closePopUpCompleteVerification() {
        await this.page.locator('.popup-middleware-bc .e-p-close-icon-bc').click();
        await this.page.waitForSelector('.hdr-user-avatar-icon-bc');
    }

    async verifyLoginSuccess() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText(
            'Before betting, complete verification. Verify your account with Diia, BankID or use the quick verification form. You can upload an additional document in the personal cabinet.',
        );
    }

    async checkAuthenticationError() {
        const locator = this.page.locator('.entrance-f-error-message-bc');
        await expect(locator).toContainText('Invalid Username or Password');
    }

    async checkForInputErrors(input: FieldNameLogin) {
        const num = input === 'email' ? 0 : 1;
        await expect(
            this.page
                .locator(`.entrance-f-item-bc`)
                .nth(num)
                .locator('.form-control-message-holder-bc'),
        ).toBeHidden();
    }

    async logOut() {
        await this.closePopUpCompleteVerification();
        await this.page.hover('.hdr-user-avatar-icon-bc');
        await this.page.click('.logout-profile .btn');
    }

    async verifyLogout() {
        await expect(this.page.locator('.hdr-user-avatar-icon-bc')).toBeHidden();
    }

    async resetPassword(email: string) {
        await this.page.click('.sg-n-forgot-password');
        await this.page.fill('input[name="email"]', email);
        await this.page.click('.entrance-form-action-item-bc .btn');
    }

    async verifyPasswordResetSuccess() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Password reset complete. Please check your email.');
    }

    async verifyPasswordResetFailure() {
        await expect(this.page.locator('.form-control-message-bc')).toBeHidden();
    }
}
