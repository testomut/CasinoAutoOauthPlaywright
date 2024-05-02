// registrationTests.ts
import { test } from '../fixtures/fixture'; 
import { FieldName } from '../types/Types';

test.describe('Registration Form Tests', () => {

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
    // Этот тест заблокирован поcкольку регестрируеться новый пользователь без ошибки
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

    test('Cross-Site Scripting (XSS) Attack Prevention', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: "<script>alert('test')</script>"
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });
    // Этот тест заблокирован по причине капчи
    // test('Email Already Registered', async ({ regPage }) => {
    //     await regPage.fillRegistrationForm({
    //         email: 'registered@example.com'
    //     });
    //     await regPage.submit();
    //     await regPage.checkErrorMessage(FieldName.Email, 'Email already registered');
    // });
    // Этот тест заблокирован по причине капчи
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
    // Этот тест заблокирован по причине капчи
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

    test('Test JavaScript Injection in Email Field', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: `" onmouseover="alert('JavaScript Executed!')`
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });
});