import createClient, { type Client, type ClientOptions } from 'openapi-fetch';
import type { paths } from './generated.js';

export type TippitiClient = Client<paths>;

export type TippitiClientOptions = {
    /**
     * Tippiti API token. Obtainable from the account settings at
     * https://app.tippiti.io/settings/api.
     */
    token: string;

    /**
     * Override the API base URL. Defaults to https://app.tippiti.io/api.
     */
    baseUrl?: string;

    /**
     * Additional options forwarded to the underlying openapi-fetch client.
     */
    fetchOptions?: Omit<ClientOptions, 'baseUrl' | 'headers'>;
};

/**
 * Creates a typed client for the Tippiti API.
 *
 * All resource IDs used with this client are sqid-encoded strings prefixed
 * with `aid-` (for example `aid-xyz12345`). Raw integer IDs are rejected
 * with a 404 response by the server.
 */
export function createTippitiClient(options: TippitiClientOptions): TippitiClient {
    return createClient<paths>({
        ...options.fetchOptions,
        baseUrl: options.baseUrl ?? 'https://app.tippiti.io/api',
        headers: {
            Authorization: `Bearer ${options.token}`,
            Accept: 'application/json',
        },
    });
}

export type { paths, components, operations } from './generated.js';
