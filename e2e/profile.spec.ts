import { test } from '../fixtures/fixture'; 
import { ProfileData } from '../types/Types';
import { faker } from '@faker-js/faker';

test.describe('Profile Tests', () => {
    const userPassword = process.env.PASSWORD_VBET as string;
    const userLogin = process.env.USERNAME_VBET as string;
    const userPhone = process.env.PHONE_VBET as string;
    test('fails to update profile data with incorrect password', async ({ profilePage }) => {
        const userData:ProfileData = {
            firstName: faker.person.firstName(), 
            lastName: faker.person.lastName(),
            birthDate: '14.05.1985',
            gender: 'Male',
            documentNumber: faker.string.numeric(7),
            taxNumber: faker.string.numeric(10),
        }
        await profilePage.updateProfile(userData, 'incorrextPassword');
        await profilePage.InvalidPasswordErrorChecker();
    });

    test('successfully updates profile data with correct password', async ({ profilePage }) => {
        const userData:ProfileData = {
            firstName: faker.person.firstName(), 
            lastName: faker.person.lastName(),
            birthDate: '14.05.1985',
            gender: 'Male',
            documentNumber: faker.string.numeric(7),
            taxNumber: faker.string.numeric(10),
        }
        await profilePage.updateProfile(userData, userPassword);
        await profilePage.ProfileUpdateSuccessManager();
        const constDataUser = {
            email: userLogin,
            phone: userPhone
        }
        await profilePage.checkProfileData({...userData,...constDataUser});
    });

    test('checks functionality of the Verify Now button', async ({ profilePage }) => {
        await profilePage.OpenVerificationPage();
        await profilePage.CheckVerificationPage();
    });

    test('checks functionality of the Deposit button', async ({ profilePage }) => {
        await profilePage.OpenDepositePage();
        await profilePage.CheckDepositePage();
    });

    test('checks functionality of the Withdrawal button', async ({ profilePage }) => {
        await profilePage.OpenWithdrawalPage();
        await profilePage.CheckWithdrawalPage();
    });

    test('activates an incorrect promo code', async ({ profilePage }) => {
        await profilePage.typePromoCode('Wrong Promo');
        await profilePage.PromoCodeErrorChecker();
    });

    test('attempts to change password with incorrect current password', async ({ profilePage }) => {
        await profilePage.UpdatePassword('Qwerty12','WrongPass12');
        await profilePage.checkErrorMessageCurrentPassword();
    });

    test('Successfully changes password', async ({ profilePage }) => {
        await profilePage.UpdatePassword('Qwerty12', userPassword);
        await profilePage.passwordUpdateSuccessManager();
    });
});
