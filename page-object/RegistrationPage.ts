// RegistrationPage.ts
import { expect, Page } from '@playwright/test';
import { RegistrationData, FieldName, PasswordValidation } from '../types/Types';

export class RegistrationPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Opens the registration page and waits for the registration popup to become visible.
    async open() {
        await this.page.goto('https://www.vbet.ua/en/');
        await this.page.locator('.register').click();
        await this.page.locator('.entrance-popup-bc.register').waitFor();
    }

    // Fills the registration form with data provided through the RegistrationData interface.
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
        // Handles the checkbox interaction based on user agreement.
        const ifMarkedCheckbox = await this.page.locator('.checkbox-control-bc .form-control-message-holder-bc').isHidden();
        
        if ((data.agreeToTerms === true && !ifMarkedCheckbox) || (data.agreeToTerms === false && ifMarkedCheckbox) ) {
            await this.page.locator('.checkbox-control-icon-bc').click();
        }
    }

    // Clicks the submit button to attempt registering the user.
    async submit() {
        await this.page.click('button[type="submit"]');  // More specific selector for submit button
    }

    // Checks for error messages associated with specific fields in the registration form.
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

    // Validates password according to the specified criteria in the PasswordValidation interface.
    async checkPasswordValidation(verificationList: PasswordValidation) {
        const requiredClass = verificationList.isRequired ? '.bc-i-checked' : '.invalid';
        await expect(this.page.locator('.validation-check-info:has-text("This field is required")').locator(requiredClass).isHidden).toBeTruthy;
        
        const noSpacesClass = verificationList.noSpaces ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should contain at least one digit. ")').locator(requiredClass).isHidden).toBeTruthy;
      
        
        const onlyEnglishCharsClass = verificationList.onlyEnglishChars ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should not contain any spaces.")').locator(requiredClass).isHidden).toBeTruthy;
      
        
        const containsDigitClass = verificationList.containsDigit ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should contain lower and upper characters.")').locator(requiredClass).isHidden).toBeTruthy;
      
        
        const hasLowerAndUpperClass = verificationList.hasLowerAndUpper ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password should contain only English characters. ")').locator(requiredClass).isHidden).toBeTruthy;
      
        
        const minLengthClass = verificationList.minLength ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password minimal length 8")').locator(requiredClass).isHidden).toBeTruthy;
      
        
        const maxLengthClass = verificationList.maxLength ? 'bc-i-checked' : 'invalid';
        await expect(this.page.locator('.validation-check-info:has-text("Password maximal length 50")').locator(requiredClass).isHidden).toBeTruthy;
    }

    // Verifies that registration was successful by checking for a congratulatory message.
    async checkSuccessRegistration() {
        const locator = this.page.locator('.congrats-block');
        await expect(locator).toContainText('Great! You’re almost there.');
        await this.page.locator('.btn:has-text("Ok")').click();
    }
}
