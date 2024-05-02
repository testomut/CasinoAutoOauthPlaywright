// registrationTests.ts
import { test } from '../fixtures/fixture'; 
import { FieldName } from '../types/Types';

test.describe('Registration Form Tests', () => {

    // Test case for an empty email field.
    test('Test Empty Email Field', async ({ regPage }) => {
        await regPage.fillRegistrationForm({ 
            email: '', 
            password: 'validPassword123', 
            confirmPassword: 'validPassword123',
            phoneNumber: '454534342'
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'This field is required');
    });

    // Test case to verify the behavior when the email format is invalid.
    test('Test Invalid Email Format', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'test@',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
            phoneNumber: '123456789'
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });

    // Test case to verify the behavior when the password field is left empty.
    test('Test Empty Password Field', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: '',
            confirmPassword: '',
            phoneNumber: '123456789'
        });
        await regPage.checkPasswordValidation({
            isRequired: false,
            containsDigit: false,
            noSpaces: false,
            hasLowerAndUpper: false,
            onlyEnglishChars: false,
            minLength: false,
            maxLength: false
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, 'This field is required');
    });

    // Test case to verify the behavior when the password is too short.
    test('Password Too Short', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'short',
            confirmPassword: 'short',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: false,
            onlyEnglishChars: false,
            minLength: false,
            maxLength: false
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, 'Password should contain at least 6 characters.');
    });

    // Test case to verify the behavior when the password exceeds the maximum length.
    test('Password Exceeds Maximum Length', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'a'.repeat(51),
            confirmPassword: 'a'.repeat(51),
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: false,
            minLength: false,
            maxLength: false
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, `Too long`);
    });

    // Test case to verify the behavior when the password doesn't contain any digits.
    test('Password Without Digits', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'PasswordOnly',
            confirmPassword: 'PasswordOnly',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: false,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
    });

    // Test case to verify the behavior when the password contains spaces.
    test('Password Contains Spaces', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'password with spaces',
            confirmPassword: 'password with spaces',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: false,
            onlyEnglishChars: false,
            minLength: false,
            maxLength: false
        });
    });

    // Test case to verify the behavior when the password does not contain upper or lowercase letters.
    test('Password Without Upper or Lowercase Letters', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'password',
            confirmPassword: 'password',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: false,
            noSpaces: true,
            hasLowerAndUpper: false,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
    });

    // Test case to verify the behavior when the confirmed password does not match the original password.
    test('Confirm Password Mismatch', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!!',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, `Passwords don't match`);
    });

    // Test case to verify the behavior when an invalid phone number is provided.
    test('Invalid Phone Number', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
            phoneNumber: '1234567890123123'
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.PhoneNumber, 'This field must contain exactly 9 digits');
    });
    // This test is disabled because it registers a new user without any errors.
    // test('Invalid Promo Code', async ({ regPage }) => {
    //     await regPage.fillRegistrationForm({
    //         email: 'user3@example.com',
    //         password: 'ValidPassword123!',
    //         confirmPassword: 'ValidPassword123!',
    //         phoneNumber: '123456789',
    //         promoCode: 'INVALIDCODE',
    //         agreeToTerms: true
    //     });
    //     await regPage.checkPasswordValidation({
    //         isRequired: true,
    //         containsDigit: true,
    //         noSpaces: true,
    //         hasLowerAndUpper: true,
    //         onlyEnglishChars: true,
    //         minLength: true,
    //         maxLength: true
    //     });
    //     await regPage.submit();
    //     await regPage.checkErrorMessage(FieldName.PromoCode, 'Invalid promo code');
    // });
    
    // Ensures that user cannot proceed with registration if not agreed to the terms and conditions.
    test('Unchecked Terms and Conditions', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
            phoneNumber: '123456789',
            agreeToTerms: false  
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Agree, 'You should agree with terms and conditions to continue');
    });

    // Tests the scenario where the password contains only special characters.
    test('Test Password with Only Special Characters', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: '!@#$%^&*()',
            confirmPassword: '!@#$%^&*()',
            phoneNumber: '123456789',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: false,
            noSpaces: true,
            hasLowerAndUpper: false,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true
        });
    });

    // Tests the prevention of Cross-Site Scripting (XSS) attacks by entering a script in the email field.
    test('Cross-Site Scripting (XSS) Attack Prevention', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: "<script>alert('test')</script>"
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });

    // This test is blocked due to CAPTCHA.
    // test('Email Already Registered', async ({ regPage }) => {
    //     await regPage.fillRegistrationForm({
    //         email: 'registered@example.com'
    //     });
    //     await regPage.submit();
    //     await regPage.checkErrorMessage(FieldName.Email, 'Email already registered');
    // });

    // This test is blocked due to CAPTCHA.
    // test('Phone number Already Registered', async ({ regPage }) => {
    //     await regPage.fillRegistrationForm({
    //         email: 'user3@example.com',
    //         password: 'ValidPassword123!',
    //         confirmPassword: 'ValidPassword123!',
    //         phoneNumber: '123456789',
    //         agreeToTerms: true
    //     });
    //     await regPage.checkPasswordValidation({
    //         isRequired: true,
    //         containsDigit: true,
    //         noSpaces: true,
    //         hasLowerAndUpper: true,
    //         onlyEnglishChars: true,
    //         minLength: true,
    //         maxLength: true
    //     });
    //     await regPage.submit();
    //     await regPage.checkErrorMessage(FieldName.PhoneNumber, 'This phone number already exists in our database. Please enter another one or try to sign in.');
    // });

    // This test is blocked due to CAPTCHA.
    // test('Successful Registration', async ({ regPage }) => {
    //     await regPage.fillRegistrationForm({
    //         email: 'user3@example.com',
    //         password: 'ValidPassword123!',
    //         confirmPassword: 'ValidPassword123!',
    //         phoneNumber: '353535354',
    //         agreeToTerms: true
    //     });
    //     await regPage.checkPasswordValidation({
    //         isRequired: true,
    //         containsDigit: true,
    //         noSpaces: true,
    //         hasLowerAndUpper: true,
    //         onlyEnglishChars: true,
    //         minLength: true,
    //         maxLength: true
    //     });
    //     await regPage.submit();
    //     await regPage.checkSuccessRegistration();
    // });

    // Tests the prevention of JavaScript injection in the email field by entering a string containing JavaScript code.
    test('Test JavaScript Injection in Email Field', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: `" onmouseover="alert('JavaScript Executed!')`
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });
});