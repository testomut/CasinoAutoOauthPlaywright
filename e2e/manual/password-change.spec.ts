import { test } from '../../fixtures/fixture';
import { requireEnv } from '../../config/env';
import { ProfilePage } from '../../page-object/ProfilePage';

// Mutates the real account's password, so this stays manual-only
// (excluded via --grep-invert @manual) and is run with
// `npm run test:password-change` under supervision.
async function changePasswordAndRestore(
    profilePage: ProfilePage,
    originalPassword: string,
    temporaryPassword: string,
) {
    let passwordChanged = false;
    let restoreError: unknown;

    try {
        await profilePage.updatePassword(temporaryPassword, originalPassword);
        await profilePage.verifyPasswordUpdateSuccess();
        passwordChanged = true;
    } finally {
        // Only restore once the temporary password is confirmed - restoring
        // with an unconfirmed "current password" could leave the account
        // worse off than just letting the original failure propagate.
        if (passwordChanged) {
            try {
                await profilePage.updatePassword(originalPassword, temporaryPassword);
                await profilePage.verifyPasswordUpdateSuccess();
            } catch (error) {
                restoreError = error;
            }
        }
    }

    if (restoreError) {
        throw new Error(
            'Password restoration failed. The test account may require manual recovery.',
            { cause: restoreError },
        );
    }
}

test.describe('Password Change (manual) @manual', () => {
    test('changes the password and restores the original', async ({ profilePage }) => {
        const { PASSWORD_VBET: originalPassword, NEW_PASSWORD_VBET: temporaryPassword } =
            requireEnv('PASSWORD_VBET', 'NEW_PASSWORD_VBET');

        await changePasswordAndRestore(profilePage, originalPassword, temporaryPassword);
    });
});
