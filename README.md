# Tippiti TypeScript Client

Official TypeScript client for the [Tippiti](https://tippiti.io) API – the transcription and dictation platform for physicians, attorneys, forensic examiners and professional typing services.

- **Interactive API docs:** [apidocs.tippiti.io](https://apidocs.tippiti.io)
- **OpenAPI specification:** [tippiti/openapi](https://github.com/tippiti/openapi)
- **Platform:** [tippiti.io](https://tippiti.io)
- **Support:** [app.tippiti.io/support/create](https://app.tippiti.io/support/create)

## Installation

```bash
npm install @tippiti/api-client
```

Requires Node.js 20 or newer. Works in any environment that provides the standard `fetch` API (browsers, Deno, Bun, Cloudflare Workers, etc.).

## Quick start

```ts
import { createTippitiClient } from '@tippiti/api-client';

const client = createTippitiClient({
    token: process.env.TIPPITI_TOKEN!,
});

const { data, error } = await client.GET('/dictations', {
    params: {
        query: { include_notes: true },
    },
});

if (error) {
    throw new Error(String(error.message ?? 'Tippiti API request failed'));
}

console.log(data.data);
```

The client is a thin, fully type-safe wrapper around [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/). Every endpoint, request body, query parameter, and response shape is derived directly from the OpenAPI specification at [apidocs.tippiti.io](https://apidocs.tippiti.io).

## Authentication

The client sends your token as a `Bearer` credential in the `Authorization` header. Tokens are scoped to the issuing user's permissions (main user or sub-user with the relevant capabilities) and can be created in the account settings.

## Resource IDs

All resource identifiers are sqid-encoded strings prefixed with `aid-`, for example `aid-xyz12345`. The TypeScript types reflect this – `id` parameters are typed as `string`, not `number`:

```ts
await client.GET('/dictations/{dictation}', {
    params: { path: { dictation: 'aid-xyz12345' } },
});
```

Raw integer IDs are rejected with a `404` response.

## Response envelope

Every successful response follows the shape:

```json
{ "success": true, "data": { ... } }
```

Failure responses follow:

```json
{ "success": false, "message": "...", "errors": { ... } }
```

Validation failures return `422` with per-field error messages. Rate-limit breaches return `429` with a `Retry-After` header.

## Custom base URL

```ts
const client = createTippitiClient({
    token: '...',
    baseUrl: 'https://staging.app.tippiti.io/api',
});
```

## Using the raw types

```ts
import type { components, operations, paths } from '@tippiti/api-client';

type Dictation = components['schemas']['DictationResource'];
type CreateDictationBody = operations['dictation.store']['requestBody']['content']['application/json'];
```

## Versioning

This client follows [Semantic Versioning](https://semver.org). A release note in [CHANGELOG.md](CHANGELOG.md) accompanies every version. Breaking changes to the underlying API produce a major version bump of this package.

## License

[MIT](LICENSE). The Tippiti platform, trademarks and data are not covered by this license.
