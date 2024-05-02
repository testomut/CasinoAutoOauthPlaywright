import { test } from '../fixtures/fixture'; 
import { FieldNameLogin } from '../types/Types';

test.describe('Authentication Tests', () => {
    // Get user credentials from environment variables
    const userLogin = process.env.USERNAME_VBET as string;
    const userPassword = process.env.PASSWORD_VBET as string;

    // Tests successful login scenario using valid credentials
    test('Successful Login', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: userPassword
        });
        await loginPage.verifyLoginSuccess();
    });

    // Tests login scenario using a wrong password
    test('Incorrect Password', async ({ loginPage }) => {
        await loginPage.login({
            login: userLogin,
            password: 'wrongPassword'
        });
        await loginPage.AuthenticationErrorChecker();
    });

    // Tests login scenario using a nonexistent username
    test('Nonexistent User', async ({ loginPage }) => {
        await loginPage.login({
            login: 'notExistUser@test.com',
            password: userPassword
        });
        await loginPage.AuthenticationErrorChecker();
    });

    // Tests login with empty username field
    test('Empty Fields (Login)', async ({ loginPage }) => {
        await loginPage.login({
            login: '',
            password: userPassword
        });
        await loginPage.checkForInputErrors(FieldNameLogin.Email);
    });

    // Tests logout functionality
    test('Logout', async ({ loggedInPage }) => {
        await loggedInPage.logOut();
        await loggedInPage.LogoutValidator();
    });

    // Tests password recovery with valid email
    test('Password Recovery', async ({ loginPage }) => {
        await loginPage.resetPassword(userLogin);
        await loginPage.resetPasswordSuccessCheck();
    });

    // Tests password recovery with a nonexistent email
    test('Password Recovery (Nonexistent Email)', async ({ loginPage }) => {
        await loginPage.resetPassword('wrongEmail@qweqwe.com');
        await loginPage.resetPasswordFailureCheck();
    });
});
