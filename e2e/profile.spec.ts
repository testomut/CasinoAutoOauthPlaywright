import { test } from '../fixtures/fixture'; 
import { ProfileData } from '../types/Types';
import { faker } from '@faker-js/faker';

test.describe('Profile Tests', () => {
    const userPassword = process.env.PASSWORD_VBET as string;
    const userLogin = process.env.USERNAME_VBET as string;
    const userPhone = process.env.PHONE_VBET as string;

    // Tests failure to update profile data with an incorrect password
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

    // Tests successful update of profile data with the correct password
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

    // Verifies the functionality of the 'Verify Now' button
    test('checks functionality of the Verify Now button', async ({ profilePage }) => {
        await profilePage.OpenVerificationPage();
        await profilePage.CheckVerificationPage();
    });

    // Tests the functionality of the Deposit button
    test('checks functionality of the Deposit button', async ({ profilePage }) => {
        await profilePage.OpenDepositePage();
        await profilePage.CheckDepositePage();
    });

    // Tests the functionality of the Withdrawal button
    test('checks functionality of the Withdrawal button', async ({ profilePage }) => {
        await profilePage.OpenWithdrawalPage();
        await profilePage.CheckWithdrawalPage();
    });

    // Activates an incorrect promo code and checks for errors
    test('activates an incorrect promo code', async ({ profilePage }) => {
        await profilePage.typePromoCode('Wrong Promo');
        await profilePage.PromoCodeErrorChecker();
    });

    // Attempts to change the password using an incorrect current password
    test('attempts to change password with incorrect current password', async ({ profilePage }) => {
        await profilePage.UpdatePassword('Qwerty12','WrongPass12');
        await profilePage.checkErrorMessageCurrentPassword();
    });

    // Successfully changes the password
    test('Successfully changes password', async ({ profilePage }) => {
        await profilePage.UpdatePassword('Qwerty12', userPassword);
        await profilePage.passwordUpdateSuccessManager();
    });
});
