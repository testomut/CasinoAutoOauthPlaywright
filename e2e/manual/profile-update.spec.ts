import { test } from '../../fixtures/fixture';
import { requireEnv } from '../../config/env';
import { ProfileData } from '../../types/Types';
import { faker } from '@faker-js/faker';

// Updates identity-adjacent fields (birth date, document number, tax
// number) on the real shared account. A regulated casino site may lock
// these once verified, so a reliable automatic restore can't be assumed -
// this stays manual-only rather than risk a cleanup step silently failing.
test.describe('Profile Update (manual) @manual', () => {
    test('persists updated profile data after reload', async ({ profilePage }) => {
        const {
            USERNAME_VBET: userLogin,
            PASSWORD_VBET: userPassword,
            PHONE_VBET: userPhone,
        } = requireEnv('USERNAME_VBET', 'PASSWORD_VBET', 'PHONE_VBET');

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
        await profilePage.checkProfileData({
            ...userData,
            email: userLogin,
            phone: userPhone,
        });
    });
});
