import { expect, Page } from '@playwright/test';
import { RegistrationData, FieldName, PasswordValidation } from '../types/Types';

export class RegistrationPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('/en/');
        await this.page.locator('.register').click();
        await this.page.locator('.entrance-popup-bc.register').waitFor();
    }

    async fillRegistrationForm(data: RegistrationData) {
        if (data.email !== undefined) {
            await this.page.fill('input[name="email"]', data.email);
        }
        if (data.password !== undefined) {
            await this.page.fill('input[name="password"]', data.password);
        }
        if (data.confirmPassword !== undefined) {
            await this.page.fill('input[name="repeat_password"]', data.confirmPassword);
        }
        if (data.phoneNumber !== undefined) {
            await this.page.fill('input[name="phoneNumber"]', data.phoneNumber);
        }
        if (data.promoCode !== undefined) {
            await this.page.fill('input[name="promo_code"]', data.promoCode);
        }
        // The checkbox has no direct "checked" attribute exposed here, so its
        // current state is inferred from whether the validation message is
        // hidden, and only toggled if that differs from the desired state.
        const ifMarkedCheckbox = await this.page
            .locator('.checkbox-control-bc .form-control-message-holder-bc')
            .isHidden();

        if (
            (data.agreeToTerms === true && !ifMarkedCheckbox) ||
            (data.agreeToTerms === false && ifMarkedCheckbox)
        ) {
            await this.page.locator('.checkbox-control-icon-bc').click();
        }
    }

    async submit() {
        await this.page.click('button[type="submit"]');
    }

    async checkErrorMessage(field: FieldName, errorMessage: string) {
        let messageSelector = `.form-control-bc:has(input[name="${field}"]) .form-control-message-holder-bc .form-control-message-bc`;
        if (field === FieldName.PhoneNumber) {
            messageSelector = `.form-controls-group-bc.telephone .form-control-message-holder-bc .form-control-message-bc`;
        }
        if (field === FieldName.Agree) {
            messageSelector = `.checkbox-control-bc .form-control-message-bc`;
        }
        if (field === FieldName.Password) {
            await this.page.locator('input[name="phoneNumber"]').scrollIntoViewIfNeeded();
        }
        await this.page.waitForSelector(messageSelector);
        await expect(this.page.locator(messageSelector)).toHaveText(errorMessage);
    }

    async checkPasswordValidation(verificationList: PasswordValidation) {
        const requiredClass = verificationList.isRequired ? '.bc-i-checked' : '.invalid';
        await expect(
            this.page
                .locator('.validation-check-info:has-text("This field is required")')
                .locator(requiredClass),
        ).toBeHidden();

        const containsDigitClass = verificationList.containsDigit ? '.bc-i-checked' : '.invalid';
        await expect(
            this.page
                .locator(
                    '.validation-check-info:has-text("Password should contain at least one digit. ")',
                )
                .locator(containsDigitClass),
        ).toBeHidden();

        const noSpacesClass = verificationList.noSpaces ? '.bc-i-checked' : '.invalid';
        await expect(
            this.page
                .locator(
                    '.validation-check-info:has-text("Password should not contain any spaces.")',
                )
                .locator(noSpacesClass),
        ).toBeHidden();

        const hasLowerAndUpperClass = verificationList.hasLowerAndUpper
            ? '.bc-i-checked'
            : '.invalid';
        await expect(
            this.page
                .locator(
                    '.validation-check-info:has-text("Password should contain lower and upper characters.")',
                )
                .locator(hasLowerAndUpperClass),
        ).toBeHidden();

        const onlyEnglishCharsClass = verificationList.onlyEnglishChars
            ? '.bc-i-checked'
            : '.invalid';
        await expect(
            this.page
                .locator(
                    '.validation-check-info:has-text("Password should contain only English characters. ")',
                )
                .locator(onlyEnglishCharsClass),
        ).toBeHidden();

        const minLengthClass = verificationList.minLength ? '.bc-i-checked' : '.invalid';
        await expect(
            this.page
                .locator('.validation-check-info:has-text("Password minimal length 8")')
                .locator(minLengthClass),
        ).toBeHidden();

        const maxLengthClass = verificationList.maxLength ? '.bc-i-checked' : '.invalid';
        await expect(
            this.page
                .locator('.validation-check-info:has-text("Password maximal length 50")')
                .locator(maxLengthClass),
        ).toBeHidden();
    }

    async checkSuccessRegistration() {
        const locator = this.page.locator('.congrats-block');
        await expect(locator).toContainText('Great! You’re almost there.');
        await this.page.locator('.btn:has-text("Ok")').click();
    }
}
