// fixture.ts
import { test as baseTest, Page } from '@playwright/test';
import { RegistrationPage } from '../page-object/RegistrationPage';
import { LoginPage } from '../page-object/LoginPage';
import { ProfilePage } from '../page-object/ProfilePage';
import { requireEnv } from '../config/env';

async function loginUser(page: Page) {
    const { USERNAME_VBET, PASSWORD_VBET } = requireEnv('USERNAME_VBET', 'PASSWORD_VBET');
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login({
        login: USERNAME_VBET,
        password: PASSWORD_VBET,
    });
    await loginPage.closePopUpCompleteVerification();
}

export const test = baseTest.extend<{
    regPage: RegistrationPage;
    loginPage: LoginPage;
    loggedInPage: LoginPage;
    profilePage: ProfilePage;
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
        await loginUser(page);
        await use(new LoginPage(page));
    },
    profilePage: async ({ page }, use) => {
        await loginUser(page);
        const profilePage = new ProfilePage(page);
        await profilePage.open();
        await use(profilePage);
    },
});
