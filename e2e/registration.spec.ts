import { test } from '../fixtures/fixture';
import { FieldName } from '../types/Types';

test.describe('Registration Form Tests', () => {
    test('requires an email address during registration', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: '',
            password: 'validPassword123',
            confirmPassword: 'validPassword123',
            phoneNumber: '454534342',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'This field is required');
    });

    test('rejects an invalid email format during registration', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'test@',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
            phoneNumber: '123456789',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });

    test('requires a password during registration', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: '',
            confirmPassword: '',
            phoneNumber: '123456789',
        });
        await regPage.checkPasswordValidation({
            isRequired: false,
            containsDigit: false,
            noSpaces: false,
            hasLowerAndUpper: false,
            onlyEnglishChars: false,
            minLength: false,
            maxLength: false,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, 'This field is required');
    });

    test('rejects a password shorter than the minimum length', async ({ regPage }) => {
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
            maxLength: false,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(
            FieldName.RepeatPassword,
            'Password should contain at least 6 characters.',
        );
    });

    test('rejects a password exceeding the maximum length', async ({ regPage }) => {
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
            maxLength: false,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, `Too long`);
    });

    test('shows the live password-validation state when the password has no digit', async ({
        regPage,
    }) => {
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
            maxLength: true,
        });
    });

    test('shows the live password-validation state when the password contains spaces', async ({
        regPage,
    }) => {
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
            maxLength: false,
        });
    });

    test('shows the live password-validation state when the password has no case variation', async ({
        regPage,
    }) => {
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
            maxLength: true,
        });
    });

    test('rejects mismatched password confirmation', async ({ regPage }) => {
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
            maxLength: true,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.RepeatPassword, `Passwords don't match`);
    });

    test('requires a valid phone number during registration', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
            phoneNumber: '1234567890123123',
        });
        await regPage.checkPasswordValidation({
            isRequired: true,
            containsDigit: true,
            noSpaces: true,
            hasLowerAndUpper: true,
            onlyEnglishChars: true,
            minLength: true,
            maxLength: true,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(
            FieldName.PhoneNumber,
            'This field must contain exactly 9 digits',
        );
    });

    test('requires agreeing to the terms and conditions', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: 'user3@example.com',
            password: 'ValidPassword123!',
            confirmPassword: 'ValidPassword123!',
            phoneNumber: '123456789',
            agreeToTerms: false,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(
            FieldName.Agree,
            'You should agree with terms and conditions to continue',
        );
    });

    test('shows the live password-validation state for a password with only special characters', async ({
        regPage,
    }) => {
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
            maxLength: true,
        });
    });

    test('rejects an XSS script tag in the email field', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: "<script>alert('test')</script>",
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });

    test('rejects a JavaScript injection attempt in the email field', async ({ regPage }) => {
        await regPage.fillRegistrationForm({
            email: `" onmouseover="alert('JavaScript Executed!')`,
        });
        await regPage.submit();
        await regPage.checkErrorMessage(FieldName.Email, 'Please enter a valid email address');
    });
});
