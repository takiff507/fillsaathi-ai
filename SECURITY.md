# Security Policy

FillSaathi AI is designed as a privacy-first form filling assistant.

## Secret handling

Do not place any API key, backend URL with secret token, database password, private certificate, or `.env` value in public frontend files.

Unsafe places for secrets:

- `index.html`
- `styles.css`
- `app.js`
- public images or JSON files
- GitHub commits
- browser local storage

Safe place for secrets:

- server-side environment variables
- private backend runtime configuration
- hosting provider secret manager

## Sensitive user data

The product should warn users before they submit or upload:

- Aadhaar or other ID numbers
- PAN or tax IDs
- bank account numbers
- IFSC with account details
- card numbers, CVV, expiry date
- OTP, password, UPI PIN
- full documents with visible private values

## Recommended production design

1. Extract only field labels from a form image.
2. Mask sensitive values before any AI request.
3. Send only the minimum required text to the backend.
4. Store nothing by default.
5. Add a clear delete option if uploads are supported.
6. Keep logs free of private user values.

## Current demo

The current website is a static browser-only demo. It does not call a backend and does not include API keys.
