# Deployment

The public installable study app is intended to run from:

```text
https://learn-products.netlify.app/offline
```

## Netlify

This project is a Next.js app. Netlify supports modern Next.js projects with its OpenNext adapter, and the repository includes `netlify.toml` so the build settings are explicit:

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

Connect the GitHub repository to the Netlify site, then deploy from `main`.

## Phone Install Flow

1. Open `https://learn-products.netlify.app/offline` on the phone.
2. Install from the browser:
   - Android Chrome: Install app or Add to Home screen.
   - iPhone Safari: Share, then Add to Home Screen.
3. Open `/offline` and each level once while online.
4. Use the installed app offline while commuting.

The offline route is statically generated from `content/sonar-products-learning.json`; it does not require the local SQLite database.
