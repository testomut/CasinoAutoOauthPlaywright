import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    // false: profile.spec.ts mutates the real account's password mid-suite,
    // and later tests depend on that change - the file is order-dependent.
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: process.env.CASINO_BASE_URL || 'https://www.vbet.ua',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
