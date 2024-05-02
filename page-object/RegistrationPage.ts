// RegistrationPage.ts
import { expect, Page } from '@playwright/test';
import { RegistrationData, FieldName, PasswordValidation } from '../types/Types';

export class RegistrationPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('https://www.vbet.ua/en/');
        await this.page.locator('.register').click();
        await this.page.locator('.entrance-popup-bc.register').waitFor();
    }

    async fillRegistrationForm(data: RegistrationData) {
        if (data.email !== undefined) {
            await this.page.fill('input[name="email"]', data.email);  // Selector updated to target input by name attribute
        }
        if (data.password !== undefined) {
            await this.page.fill('input[name="password"]', data.password);  // More specific selector
        }
        if (data.confirmPassword !== undefined) {
            await this.page.fill('input[name="repeat_password"]', data.confirmPassword);  // Corrected field name
        }
        if (data.phoneNumber !== undefined) {
            await this.page.fill('input[name="phoneNumber"]', data.phoneNumber);  // More specific selector
        }
        if (data.promoCode !== undefined) {
            await this.page.fill('input[name="promo_code"]', data.promoCode);  // Corrected field name
        }
        const ifMarkedCheckbox = await this.page.locator('.checkbox-control-bc .form-control-message-holder-bc').isHidden();
        
        if ((data.agreeToTerms === true && !ifMarkedCheckbox) || (data.agreeToTerms === false && ifMarkedCheckbox) ) {
            await this.page.locator('.checkbox-control-icon-bc').click();  // Checkbox by name
        }
    }

    async submit() {
        await this.page.click('button[type="submit"]');  // More specific selector for submit button
    }

    async checkErrorMessage(field: FieldName, errorMessage: string) {
        let messageSelector = `.form-control-bc:has(input[name="${field}"]) .form-control-message-holder-bc .form-control-message-bc`;
        if(field === FieldName.PhoneNumber) {
            messageSelector = `.form-controls-group-bc.telephone .form-control-message-holder-bc .form-control-message-bc`;
        }
        if(field === FieldName.Agree) {
            messageSelector = `.checkbox-control-bc .form-control-message-bc`;
        }
        if(field === FieldName.Password) {
            await this.page.locator('input[name="phoneNumber"]').scrollIntoViewIfNeeded();
        }
        await this.page.waitForSelector(messageSelector);
        await expect(this.page.locator(messageSelector)).toHaveText(errorMessage);
    }

    async checkPasswordValidation(verificationList: PasswordValidation) {
        // Проверяем, что поле не пустое
        const requiredClass = verificationList.isRequired ? '.bc-i-checked' : '.invalid';
        await expect(this.page.locator('.validation-check-info:has-text("This field is required")').locator(requiredClass).isHidden).toBeTruthy;
      
        // Проверяем, что пароль не содержит пробелов
        const noSpacesClass = verificationList.noSpaces ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should contain at least one digit. ")').locator(requiredClass).isHidden).toBeTruthy;
      
        // Проверяем, что пароль содержит только английские символы
        const onlyEnglishCharsClass = verificationList.onlyEnglishChars ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should not contain any spaces.")').locator(requiredClass).isHidden).toBeTruthy;
      
        // Проверяем, что пароль содержит хотя бы одну цифру
        const containsDigitClass = verificationList.containsDigit ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should contain lower and upper characters.")').locator(requiredClass).isHidden).toBeTruthy;
      
        // Проверяем, что пароль содержит и заглавные, и строчные буквы
        const hasLowerAndUpperClass = verificationList.hasLowerAndUpper ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should contain only English characters. ")').locator(requiredClass).isHidden).toBeTruthy;
      
        // Проверяем, что минимальная длина пароля — 8 символов
        const minLengthClass = verificationList.minLength ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password minimal length 8")').locator(requiredClass).isHidden).toBeTruthy;
      
        // Проверяем, что максимальная длина пароля — 50 символов
        const maxLengthClass = verificationList.maxLength ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password maximal length 50")').locator(requiredClass).isHidden).toBeTruthy;
    }

    async checkSuccessRegistration() {
        const locator = this.page.locator('.congrats-block');
        await expect(locator).toContainText('Great! You’re almost there.');
        await this.page.locator('.btn:has-text("Ok")').click();
    }
}
