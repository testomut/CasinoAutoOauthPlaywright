import 'dotenv/config';

/**
 * Reads the given environment variables and throws a single, clear error
 * listing every missing name if any are unset or empty. Never prints
 * the values themselves - only the variable names.
 */
export function requireEnv<Name extends string>(...names: Name[]): Record<Name, string> {
    const missing = names.filter((name) => !process.env[name]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return Object.fromEntries(names.map((name) => [name, process.env[name] as string])) as Record<
        Name,
        string
    >;
}
