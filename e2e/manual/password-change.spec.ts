import { test } from '../../fixtures/fixture';
import { requireEnv } from '../../config/env';
import { ProfilePage } from '../../page-object/ProfilePage';

// Mutates the real account's password, so it's tagged @manual and
// excluded from the default suite via --grep-invert in package.json.
// Run only via `npm run test:password-change`, under supervision.
//
// Restore the original password only after the temporary password
// change was confirmed. If the change itself isn't confirmed, restoring
// would use an unverified "current password" and risks making things
// worse - so the original failure propagates as-is instead. If the
// change succeeds but restoration fails, that's reported as its own
// clear error, since the account may now be left on the temporary
// password. Neither password is ever logged.
//
// This hasn't been run against the live site from this environment -
// VBET geo-blocks it (see README.md "External-system limitations"), so
// the restoration path is validated by type checking, not execution.
async function changePasswordAndRestore(
    profilePage: ProfilePage,
    originalPassword: string,
    temporaryPassword: string,
) {
    // passwordChanged's value is provable at every point below - an
    // unconfirmed change would already have thrown before it's read -
    // but it's kept explicit (start false, flip true only after a
    // verified change, gate restoration on it) so that invariant is
    // visible in the code itself, not just in the control flow.
    // eslint-disable-next-line no-useless-assignment
    let passwordChanged = false;

    // Not wrapped in try/catch: if this throws, the original error
    // propagates untouched and restoration below is never attempted.
    await profilePage.updatePassword(temporaryPassword, originalPassword);
    await profilePage.verifyPasswordUpdateSuccess();
    passwordChanged = true;

    if (passwordChanged) {
        try {
            await profilePage.updatePassword(originalPassword, temporaryPassword);
            await profilePage.verifyPasswordUpdateSuccess();
        } catch (restoreError) {
            throw new Error(
                'Password restoration failed. The test account may require manual recovery.',
                { cause: restoreError },
            );
        }
    }
}

test.describe('Password Change (manual) @manual', () => {
    test('changes the password and restores the original', async ({ profilePage }) => {
        const { PASSWORD_VBET: originalPassword, NEW_PASSWORD_VBET: temporaryPassword } =
            requireEnv('PASSWORD_VBET', 'NEW_PASSWORD_VBET');

        await changePasswordAndRestore(profilePage, originalPassword, temporaryPassword);
    });
});
