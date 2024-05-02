import { test } from '../fixtures/fixture'; 
import { FieldNameLogin } from '../types/Types';

test.describe('Authentication Tests', () => {
    const userLogin = process.env.USERNAME_VBET as string;
    const userPassword = process.env.PASSWORD_VBET as string;

    test('Successful Login', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: userPassword
        });
        await loginPage.verifyLoginSuccess();
    });

    test('Incorrect Password', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: 'wrongPassword'
        });
        await loginPage.AuthenticationErrorChecker();
    });

    test('Nonexistent User', async ({ loginPage }) => {
        await loginPage.login({
            login: 'notExistUser@test.com',
            password: userPassword
        });
        await loginPage.AuthenticationErrorChecker();
    });

    test('Empty Fields (Login)', async ({ loginPage }) => {
        await loginPage.login({
            login: '',
            password: userPassword
        });
        await loginPage.checkForInputErrors(FieldNameLogin.Email);
    });

    test('Logout', async ({ loggedInPage }) => {
        await loggedInPage.logOut();
        await loggedInPage.LogoutValidator();
    });

    test('Password Recovery', async ({ loginPage }) => {
        await loginPage.resetPassword(userLogin);
        await loginPage.resetPasswordSuccessCheck();
    });

    test('Password Recovery (Nonexistent Email)', async ({ loginPage }) => {
        await loginPage.resetPassword('wrongEmail@qweqwe.com');
        await loginPage.resetPasswordFailureCheck();
    });
});
