import { expect, Page } from '@playwright/test';
import { OauthData, FieldNameLogin } from '../types/Types';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('https://www.vbet.ua/en/');
        await this.page.locator('.sign-in').click();
        // await this.page.locator('.entrance-popup-bc.login').waitFor();
    }

    async login(credentials: OauthData) {
        await this.page.fill('input[name="username"]', credentials.login);
        await this.page.fill('input[name="password"]', credentials.password);
        await this.page.click('button[type="submit"]');
    }
    async closePopUpCompleteVerification() {
        await this.page.click('div:nth-child(7) > .popup-middleware-bc > .popup-inner-bc > .e-p-close-icon-bc');
        await this.page.waitForSelector('.hdr-user-avatar-icon-bc');
    }

    async verifyLoginSuccess() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Before betting, complete verification. Verify your account with Diia, BankID or use the quick verification form. You can upload an additional document in the personal cabinet.');
        this.closePopUpCompleteVerification();
    }

    async AuthenticationErrorChecker() {
        const locator = this.page.locator('.entrance-f-error-message-bc');
        await expect(locator).toContainText('Invalid Username or Password');
    }

    async checkForInputErrors(input: FieldNameLogin) {
        const num = input === "email" ? 0 : 1;
        await expect(this.page.locator(`.entrance-f-item-bc`).nth(num).locator('.form-control-message-holder-bc').isHidden).toBeTruthy;
    }

    async logOut() {
        await this.closePopUpCompleteVerification();
        await this.page.hover('.hdr-user-avatar-icon-bc');
        await this.page.click('.logout-profile .btn');
    }

    async LogoutValidator () {
        await expect(this.page.locator('.hdr-user-avatar-icon-bc').isHidden).toBeTruthy;
    }

    async resetPassword (email: string) {
        await this.page.click('.sg-n-forgot-password');
        await this.page.fill('input[name="email"]', email);
        await this.page.click('.entrance-form-action-item-bc .btn');
    }

    async resetPasswordSuccessCheck () {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Password reset complete. Please check your email.');
    }

    async resetPasswordFailureCheck () {
        await expect(this.page.locator('.form-control-message-bc').isHidden).toBeTruthy;
    }
}
