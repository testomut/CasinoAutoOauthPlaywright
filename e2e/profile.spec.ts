import { test } from '../fixtures/fixture';
import { ProfileData } from '../types/Types';
import { faker } from '@faker-js/faker';
import { requireEnv } from '../config/env';

// The scenario that successfully changes the account's password lives in
// e2e/manual/password-change.spec.ts instead of here, so this file never
// mutates the shared account's credentials - see that file for why.
test.describe('Profile Tests', () => {
    const { USERNAME_VBET: userLogin, PASSWORD_VBET: userPassword } = requireEnv(
        'USERNAME_VBET',
        'PASSWORD_VBET',
    );
    const incorrectPassword = 'incorrectPassword';

    test('fails to update profile data with incorrect password', async ({ profilePage }) => {
        const userData: ProfileData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthDate: '14.05.1985',
            gender: 'Male',
            documentNumber: faker.string.numeric(7),
            taxNumber: faker.string.numeric(10),
        };
        await profilePage.updateProfile(userData, incorrectPassword);
        await profilePage.checkInvalidPasswordError();
    });

    test('successfully updates profile data with correct password', async ({ profilePage }) => {
        const { PHONE_VBET: userPhone } = requireEnv('PHONE_VBET');
        const userData: ProfileData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthDate: '14.05.1985',
            gender: 'Male',
            documentNumber: faker.string.numeric(7),
            taxNumber: faker.string.numeric(10),
        };
        await profilePage.updateProfile(userData, userPassword);
        await profilePage.verifyProfileUpdateSuccess();
        const constDataUser = {
            email: userLogin,
            phone: userPhone,
        };
        await profilePage.checkProfileData({ ...userData, ...constDataUser });
    });

    test('checks functionality of the Verify Now button', async ({ profilePage }) => {
        await profilePage.openVerificationPage();
        await profilePage.checkVerificationPage();
    });

    test('checks functionality of the Deposit button', async ({ profilePage }) => {
        await profilePage.openDepositPage();
        await profilePage.checkDepositPage();
    });

    test('checks functionality of the Withdrawal button', async ({ profilePage }) => {
        await profilePage.openWithdrawalPage();
        await profilePage.checkWithdrawalPage();
    });

    test('activates an incorrect promo code', async ({ profilePage }) => {
        await profilePage.typePromoCode('Wrong Promo');
        await profilePage.checkPromoCodeError();
    });

    // Uses NEW_PASSWORD_VBET only as form input - the current-password
    // check fails first, so the account's password never actually changes.
    test('attempts to change password with incorrect current password', async ({ profilePage }) => {
        const { NEW_PASSWORD_VBET: newUserPassword } = requireEnv('NEW_PASSWORD_VBET');
        await profilePage.updatePassword(newUserPassword, 'WrongPass12');
        await profilePage.checkCurrentPasswordError();
    });
});
