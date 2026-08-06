import { test } from '../../fixtures/fixture';
import { requireEnv } from '../../config/env';
import { ProfilePage } from '../../page-object/ProfilePage';

// Mutates the real account's password, so it's tagged @manual and
// excluded from the default suite via --grep-invert in package.json.
// Run only via `npm run test:password-change`, under supervision.
//
// Restoration always runs, even if the initial change fails, and is
// re-verified explicitly rather than assumed. If restoration itself
// fails, that's what gets thrown - treat it as a signal the account
// needs manual recovery, not as an ordinary test failure. Neither
// password is ever logged.
//
// This hasn't been run against the live site from this environment -
// VBET geo-blocks it (see README.md "External-system limitations"), so
// the restoration path is validated by type checking, not execution.
async function changePasswordAndRestore(
    profilePage: ProfilePage,
    originalPassword: string,
    temporaryPassword: string,
) {
    let changeError: unknown;
    try {
        await profilePage.updatePassword(temporaryPassword, originalPassword);
        await profilePage.verifyPasswordUpdateSuccess();
    } catch (error) {
        changeError = error;
    }

    try {
        await profilePage.updatePassword(originalPassword, temporaryPassword);
        await profilePage.verifyPasswordUpdateSuccess();
    } catch {
        throw new Error(
            'Failed to restore the original password after the password-change test. ' +
                'The account may still be on the temporary password and require manual recovery.',
        );
    }

    if (changeError) {
        throw changeError;
    }
}

test.describe('Password Change (manual) @manual', () => {
    test('changes the password and restores the original', async ({ profilePage }) => {
        const { PASSWORD_VBET: originalPassword, NEW_PASSWORD_VBET: temporaryPassword } =
            requireEnv('PASSWORD_VBET', 'NEW_PASSWORD_VBET');

        await changePasswordAndRestore(profilePage, originalPassword, temporaryPassword);
    });
});
