# FillSaathi AI

FillSaathi AI is a privacy-first form filling assistant concept. It helps users understand confusing physical or online forms without collecting sensitive values.

## What it does

- Explains what each form field means
- Tells the user what to write and where to write it
- Warns before sharing sensitive fields like Aadhaar, PAN, bank account number, OTP, card number, CVV, password, UPI PIN, etc.
- Gives a final checklist before submitting a form
- Works as a simple static website demo

## Privacy-first rule

This website does not include any backend API key, AI secret, database credential, or GitHub Actions workflow.

The current demo runs in the browser only. It does not send form text anywhere.

## Future backend plan

When adding a real AI backend, keep all keys on the server only:

```env
POLLINATIONS_API_KEY=your_secret_key_here
```

Never put secret keys inside `index.html`, `styles.css`, `app.js`, or any public frontend file.

## Local use

Open `index.html` in a browser.

## Deploy

You can deploy this as a static website on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any normal hosting. No GitHub Actions are required by this project.

## Project files

- `index.html` - main website
- `styles.css` - design
- `app.js` - browser-only guide generator
- `SECURITY.md` - security notes
- `.env.example` - backend-only environment variable example
- `.gitignore` - keeps local secrets out of git
