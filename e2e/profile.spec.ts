import { test } from '../fixtures/fixture';
import { ProfileData } from '../types/Types';
import { faker } from '@faker-js/faker';
import { requireEnv } from '../config/env';

// Password changes and identity-field updates (name, birth date, documents)
// mutate the real shared account, so those scenarios live under
// e2e/manual instead of here - see that folder for why.
test.describe('Profile Tests', () => {
    const incorrectPassword = 'incorrectPassword';

    test('rejects a profile update when the password is incorrect', async ({ profilePage }) => {
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

    test('opens the verification page from the Verify Now button', async ({ profilePage }) => {
        await profilePage.openVerificationPage();
        await profilePage.checkVerificationPage();
    });

    test('opens the deposit page from the wallet icon', async ({ profilePage }) => {
        await profilePage.openDepositPage();
        await profilePage.checkDepositPage();
    });

    test('opens the withdrawal page from the account menu', async ({ profilePage }) => {
        await profilePage.openWithdrawalPage();
        await profilePage.checkWithdrawalPage();
    });

    test('shows an error when the promo code is invalid', async ({ profilePage }) => {
        await profilePage.typePromoCode('Wrong Promo');
        await profilePage.checkPromoCodeError();
    });

    // Uses NEW_PASSWORD_VBET only as form input - the current-password
    // check fails first, so the account's password never actually changes.
    test('shows an error when the current password is incorrect', async ({ profilePage }) => {
        const { NEW_PASSWORD_VBET: newUserPassword } = requireEnv('NEW_PASSWORD_VBET');
        await profilePage.updatePassword(newUserPassword, 'WrongPass12');
        await profilePage.checkCurrentPasswordError();
    });
});
