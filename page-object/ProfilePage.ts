import { expect, Page } from '@playwright/test';
import { ProfileData, FullProfileData } from '../types/Types';

export class ProfilePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.click('.hdr-user-avatar-icon-bc');
        await this.page.waitForSelector('.my-profile-info-block');
    }

    async updateProfile(userData:ProfileData, password: string) {
        if (userData.firstName !== undefined) {
            await this.page.fill('input[name="first_name"]', userData.firstName);  // Selector updated to target input by name attribute
        }
        if (userData.lastName !== undefined) {
            await this.page.fill('input[name="last_name"]', userData.lastName);  // Selector updated to target input by name attribute
        }
        if (userData.birthDate !== undefined) {
            await this.page.evaluate(() => {
                const dateInput = document.querySelector('[placeholder].form-control-input-bc') as Element;
                dateInput.removeAttribute('readonly');
            });
            await this.page.fill('input[placeholder].form-control-input-bc', userData.birthDate);  // Selector updated to target input by name attribute
        }
        if (userData.gender !== undefined) {
            await this.page.getByText('Choose gender').click();
            const labelLocator = this.page.locator('label').filter({
                hasText: new RegExp(`^${userData.gender}$`)
            });
            await labelLocator.click();
        }
        if (userData.documentNumber !== undefined) {
            await this.page.fill('input[name="doc_number"]', userData.documentNumber);  // Selector updated to target input by name attribute
        }
        if (userData.taxNumber !== undefined) {
            await this.page.fill('input[name="iban"]', userData.taxNumber);  // Selector updated to target input by name attribute
        }
        await this.page.fill('input[name="password"]', password);
        await this.page.getByRole('button', { name: 'Save changes' }).click();
    }

    async checkProfileData(userData:FullProfileData) {
        await this.page.reload();
        if (userData.firstName !== undefined) {
            const locator = this.page.locator('input[name="first_name"]');
            await expect(locator).toHaveValue(userData.firstName);
        }
        if (userData.lastName !== undefined) {
            const locator = this.page.locator('input[name="last_name"]');
            await expect(locator).toHaveValue(userData.lastName);
        }
        if (userData.birthDate !== undefined) {
            const birthSplit = userData.birthDate.split('.');
            const newBirthDateFormat = `${birthSplit[2]}-${birthSplit[1]}-${birthSplit[0]}`
            const locator = this.page.locator('input[name="birth_date"]');
            await expect(locator).toHaveValue(newBirthDateFormat);
        }
        if (userData.gender !== undefined) {
            const locator = this.page.locator('.multi-select-bc .form-control-select-bc');
            await expect(locator).toContainText(userData.gender)
        }
        if (userData.documentNumber !== undefined) {
            const locator = this.page.locator('input[name="doc_number"]');
            await expect(locator).toHaveValue(userData.documentNumber);
        }
        if (userData.taxNumber !== undefined) {
            const locator = this.page.locator('input[name="iban"]');
            await expect(locator).toHaveValue(userData.taxNumber);
        }
        if (userData.email !== undefined) {
            const locator = this.page.locator('input[name="email"]');
            await expect(locator).toHaveValue(userData.email);
        }
    
        if (userData.phone !== undefined) {
            const locator = this.page.locator('input[name="phoneNumber"]');
            await expect(locator).toHaveValue(userData.phone);
        }
    }

    async InvalidPasswordErrorChecker() {
        const locator = this.page.locator('.form-control-message-bc');
        await expect(locator).toContainText('Wrong Password');
    }

    async ProfileUpdateSuccessManager() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Personal information updated');
    }

    async OpenVerificationPage() {
        await this.page.click('.account-verified-button');
    }

    async CheckVerificationPage() {
        const locator = this.page.locator('.my-profile-info-block .overlay-header');
        await expect(locator).toContainText('Verification');
    }

    async OpenDepositePage() {
        await this.page.click('.bc-i-wallet');
    }

    async CheckDepositePage() {
        const locator = this.page.locator('.my-profile-info-block .overlay-header');
        await expect(locator).toContainText('Deposit');
    }

    async OpenWithdrawalPage() {
        await this.page.click('.u-i-p-a-withdraw-bc');
    }

    async CheckWithdrawalPage() {
        const locator = this.page.locator('.my-profile-info-block .overlay-header');
        await expect(locator).toContainText('Withdraw');
    }

    async typePromoCode(code:string) {
        await this.page.fill('input[name="promoCode"]', code);
        await this.page.click('button[type="submit"]');
    }

    async PromoCodeErrorChecker() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('This promo code is no longer valid');
    }

    async UpdatePassword(newPass: string, oldPass:string) {
        await this.page.click('a[href*="change-password"]');
        await this.page.fill('input[name="password"]', oldPass);
        await this.page.fill('input[name="new_password"]', newPass);
        await this.page.fill('input[name="new_password_confirm"]', newPass);
        await this.page.click('.right-aligned ');
    }

    async checkErrorMessageCurrentPassword() {
        const locator = this.page.locator('.form-control-message-bc');
        await expect(locator).toContainText('The old password is incorrect.');
    }

    async passwordUpdateSuccessManager() {
        const locator = this.page.locator('.casino-popup-content');
        await expect(locator).toContainText('Password changed');
    }
}
