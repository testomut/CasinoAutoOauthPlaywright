// fixture.ts
import { test as baseTest } from '@playwright/test';
import { RegistrationPage } from '../page-object/RegistrationPage';
import { LoginPage } from '../page-object/LoginPage';
import { ProfilePage } from '../page-object/ProfilePage';

const userLogin = process.env.USERNAME_VBET as string;
const userPassword = process.env.PASSWORD_VBET as string;

// Helper function to perform login
async function loginUser(page) {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login({ 
        login: userLogin, 
        password: userPassword 
    });
    await loginPage.closePopUpCompleteVerification();
}

export const test = baseTest.extend<{ 
    regPage: RegistrationPage,
    loginPage: LoginPage,
    loggedInPage: LoginPage,
    profilePage: ProfilePage,
}>({
    regPage: async ({ page }, use) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.open();
        await use(registrationPage);
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await use(loginPage);
    },
    loggedInPage: async ({ page }, use) => {
        await loginUser(page);  // Use helper function to login
        await use(new LoginPage(page));
    },
    profilePage: async ({ page }, use) => {
        await loginUser(page);  // Use helper function to login
        const profilePage = new ProfilePage(page);
        await profilePage.open(); 
        await use(profilePage);
    }
});
