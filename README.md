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
- `e2e/profile.spec.ts` - profile updates, password change, and promo-code handling against the same account.

This covers the flows that exist, not a claim of complete coverage of the target application.

## Project structure

```
e2e/             registration, authentication, profile specs
page-object/     LoginPage, RegistrationPage, ProfilePage
fixtures/        fixture.ts - wires page objects into tests, handles login
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

Fill in a disposable test account's `USERNAME_VBET`, `PASSWORD_VBET`, and `PHONE_VBET` locally, plus `NEW_PASSWORD_VBET` (the value `profile.spec.ts`'s password-change tests set the account's password to). Never commit `.env` - it's gitignored, and `authentication.spec.ts`/`profile.spec.ts` won't run without it.

## Commands

| Command                                 | What it does                       |
| --------------------------------------- | ---------------------------------- |
| `npm test`                              | Full suite, headless               |
| `npm run test:headed`                   | Full suite, headed                 |
| `npm run test:debug`                    | Playwright inspector               |
| `npm run test:ui`                       | Playwright's UI mode               |
| `npm run test:report`                   | Open the last HTML report          |
| `npm run lint` / `format` / `typecheck` | ESLint / Prettier / `tsc --noEmit` |

## Reports and documentation

- [Test case spreadsheet](https://docs.google.com/spreadsheets/d/1_LbOWBECjryKrfWVjCq-mcK7tSAWRUUWexUPb1FZf10/edit?usp=sharing) - the scenarios this suite is based on.
- [Published Playwright report](https://testomut.github.io/CasinoAutoOauthPlaywright/) - an example execution artifact from a past run, not proof that the current commit passes. Only the CI-run code-quality checks reflect the latest commit; the live suite isn't part of that gate (see below).

## External-system limitations

VBET is a live third-party site I don't control. Confirmed directly while working on this repo: the site geo-blocks requests from at least some cloud/datacenter IP ranges ("Your location doesn't allow you to consult this website"), which is why there's no default CI workflow running the live suite - it would fail for reasons unrelated to the code, likely including from GitHub's own hosted runners. Beyond that, the suite can be affected by CAPTCHA on real registration/login, the shared test account's data state, UI changes, and rate limits. The `authentication`/`profile` suites also mutate the real account (login sessions, password changes), so repeated runs aren't fully isolated from each other.

## Author

Stanislav Mokshyn - [github.com/testomut](https://github.com/testomut)

## License

[MIT](./LICENSE)
