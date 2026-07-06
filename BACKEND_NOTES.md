# Backend Notes

This public repo currently contains only a static frontend demo.

When you add real AI later, create a private backend. Keep provider credentials only in server-side environment variables or hosting secret manager.

Recommended production flow:

1. Frontend sends only non-sensitive field labels to your backend.
2. Backend calls the AI provider.
3. Backend returns simple instructions to the frontend.
4. Do not log private user values.
5. Do not store uploaded forms by default.

Never put real provider credentials, database passwords, or private tokens in public frontend code.
