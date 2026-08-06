import { test } from '../fixtures/fixture';
import { FieldNameLogin } from '../types/Types';
import { requireEnv } from '../config/env';

test.describe('Authentication Tests', () => {
    const { USERNAME_VBET: userLogin, PASSWORD_VBET: userPassword } = requireEnv(
        'USERNAME_VBET',
        'PASSWORD_VBET',
    );

    test('Successful Login', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: userPassword,
        });
        await loginPage.verifyLoginSuccess();
    });

    test('Incorrect Password', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: 'wrongPassword',
        });
        await loginPage.checkAuthenticationError();
    });

    test('Nonexistent User', async ({ loginPage }) => {
        await loginPage.login({
            login: 'notExistUser@test.com',
            password: userPassword,
        });
        await loginPage.checkAuthenticationError();
    });

    test('Empty Fields (Login)', async ({ loginPage }) => {
        await loginPage.login({
            login: '',
            password: userPassword,
        });
        await loginPage.checkForInputErrors(FieldNameLogin.Email);
    });

    test('Logout', async ({ loggedInPage }) => {
        await loggedInPage.logOut();
        await loggedInPage.verifyLogout();
    });

    test('Password Recovery', async ({ loginPage }) => {
        await loginPage.resetPassword(userLogin);
        await loginPage.verifyPasswordResetSuccess();
    });

    test('Password Recovery (Nonexistent Email)', async ({ loginPage }) => {
        await loginPage.resetPassword('wrongEmail@qweqwe.com');
        await loginPage.verifyPasswordResetFailure();
    });
});
