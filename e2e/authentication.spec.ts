import { test } from '../fixtures/fixture';
import { FieldNameLogin } from '../types/Types';
import { requireEnv } from '../config/env';

test.describe('Authentication Tests', () => {
    const { USERNAME_VBET: userLogin, PASSWORD_VBET: userPassword } = requireEnv(
        'USERNAME_VBET',
        'PASSWORD_VBET',
    );

    test('logs in successfully with valid credentials', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: userPassword,
        });
        await loginPage.verifyLoginSuccess();
        await loginPage.closePopUpCompleteVerification();
    });

    test('shows an error when the password is incorrect', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: 'wrongPassword',
        });
        await loginPage.checkAuthenticationError();
    });

    test('shows an error when the account does not exist', async ({ loginPage }) => {
        await loginPage.login({
            login: 'notExistUser@test.com',
            password: userPassword,
        });
        await loginPage.checkAuthenticationError();
    });

    test('requires an email address to log in', async ({ loginPage }) => {
        await loginPage.login({
            login: '',
            password: userPassword,
        });
        await loginPage.verifyRequiredFieldError(FieldNameLogin.Email);
    });

    test('logs the user out and returns to the unauthenticated state', async ({ loggedInPage }) => {
        await loggedInPage.logOut();
        await loggedInPage.verifyLogout();
    });

    test('confirms the password reset request', async ({ loginPage }) => {
        await loginPage.resetPassword(userLogin);
        await loginPage.verifyPasswordResetSuccess();
    });

    test('does not reveal whether an email is registered during password reset', async ({
        loginPage,
    }) => {
        await loginPage.resetPassword('wrongEmail@qweqwe.com');
        await loginPage.verifyNoAccountDisclosure();
    });
});
