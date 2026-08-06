# Authentication Flow Testing with Playwright

This project demonstrates how I organize Playwright tests for registration, authentication, logout, and profile-management flows. It combines Page Objects, fixtures, generated test data, test-case documentation, and published Playwright reports.

The tested application is a live, real third-party casino site (VBET). This is a portfolio/reference project, not an official test suite for that product, and it doesn't claim production coverage.

## What this project demonstrates

- Playwright and TypeScript test organization
- Registration form validation
- Login, logout, and password recovery
- Profile-management scenarios
- Page Objects (`LoginPage`, `RegistrationPage`, `ProfilePage`)
- Fixture composition (`fixtures/fixture.ts`)
- Generated test data with Faker
- Environment-based account configuration
- Test-case documentation and Playwright HTML reports/traces

## Test scope

- `e2e/registration.spec.ts` - client-side form validation (empty/invalid fields, password rules, XSS/injection attempts); a few scenarios that would complete a real registration are commented out because the live site's CAPTCHA blocks them.
- `e2e/authentication.spec.ts` - login, logout, and password recovery against a real account.
- `e2e/profile.spec.ts` - profile updates and promo-code handling against the same account.
- `e2e/manual/password-change.spec.ts` - changes the account's real password and restores it. Mutates credentials, so it's excluded from the default suite and run only via its own command (see Commands).

This covers the flows that exist, not a claim of complete coverage of the target application.

## Project structure

```
e2e/             registration, authentication, profile specs (e2e/manual - see above)
page-object/     LoginPage, RegistrationPage, ProfilePage
fixtures/        fixture.ts - wires page objects into tests, handles login
config/          env.ts - validates required env vars before credential-dependent tests run
types/           shared TypeScript types (form data, validation shape)
docs/            published Playwright HTML report (GitHub Pages)
```

## Installation

```bash
npm ci
npx playwright install chromium
```

## Environment setup

```bash
cp .env.example .env
```

Fill in a disposable test account's `USERNAME_VBET`, `PASSWORD_VBET`, and `PHONE_VBET` locally, plus `NEW_PASSWORD_VBET` (the temporary password `password-change.spec.ts` uses and restores from). Never commit `.env` - it's gitignored. Credential-dependent tests fail fast with a clear "Missing required environment variables" error instead of silently running with empty values; `registration.spec.ts` needs none of this.

## Commands

| Command                                 | What it does                                       |
| --------------------------------------- | -------------------------------------------------- |
| `npm test`                              | Full suite except the manual password-change spec  |
| `npm run test:headed`                   | Same, headed                                       |
| `npm run test:debug`                    | Playwright inspector                               |
| `npm run test:ui`                       | Playwright's UI mode                               |
| `npm run test:password-change`          | The password-change/restore spec, run deliberately |
| `npm run test:report`                   | Open the last HTML report                          |
| `npm run lint` / `format` / `typecheck` | ESLint / Prettier / `tsc --noEmit`                 |

## Reports and documentation

- [Test case spreadsheet](https://docs.google.com/spreadsheets/d/1_LbOWBECjryKrfWVjCq-mcK7tSAWRUUWexUPb1FZf10/edit?usp=sharing) - the scenarios this suite is based on.
- [Published Playwright report](https://testomut.github.io/CasinoAutoOauthPlaywright/) - an example execution artifact from a past run, not proof that the current commit passes. Only the CI-run code-quality checks reflect the latest commit; the live suite isn't part of that gate (see below).

## External-system limitations

VBET is a live third-party site I don't control. Confirmed directly while working on this repo: the site geo-blocks requests from at least some cloud/datacenter IP ranges ("Your location doesn't allow you to consult this website"), which is why there's no default CI workflow running the live suite - it would fail for reasons unrelated to the code, likely including from GitHub's own hosted runners. Beyond that, the suite can be affected by CAPTCHA on real registration/login, the shared test account's data state, UI changes, and rate limits. The `authentication`/`profile` suites log in and update profile data on the real account, so repeated runs aren't fully isolated from each other; the password-change scenario specifically is isolated further (see Test scope).

## Author

Stanislav Mokshyn - [github.com/testomut](https://github.com/testomut)

## License

[MIT](./LICENSE)
