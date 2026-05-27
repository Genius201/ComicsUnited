# ComicsUnited — Deployment Guide

A step-by-step checklist for contributors deploying ComicsUnited to production.
Keep this document updated as the stack evolves.

---

## 📋 Prerequisites

Before deploying, confirm you have the following:

- [ ] Node.js **v20+** installed (`node -v`)
- [ ] npm **v9+** installed (`npm -v`)
- [ ] Access to the [Netlify](https://netlify.com) dashboard for this site
- [ ] Access to the GitHub repository with push rights to `main`
- [ ] All required secrets added to GitHub and Netlify (see [Environment Variables](#environment-variables))

---

## 🔐 Environment Variables

Never commit `.env` files to the repository. All environment variables are injected at build time.

### GitHub Repository Secrets
Set these under **Settings → Secrets and variables → Actions**:

| Secret Name | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the production API |
| `VITE_APP_NAME` | Application display name |
| `NETLIFY_AUTH_TOKEN` | Personal access token from Netlify account settings |
| `NETLIFY_SITE_ID` | Found in Netlify site settings → General → Site ID |

### Netlify Environment Variables
Set these under **Site configuration → Environment variables** as a backup and for Netlify-triggered builds:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the production API |
| `VITE_APP_NAME` | Application display name |

> ⚠️ `.env.production` must **never** be committed to the repo. It is listed in `.gitignore`. If you accidentally commit it, immediately rotate any exposed keys and run `git rm --cached .env.production`.

---

## 🧹 Pre-Deploy Checklist

Run through these before merging anything into `main`:

### Code Quality
- [ ] No `console.log` statements left in production components
- [ ] No `TestApp.jsx`, `restructure.sh`, or numbered draft files (e.g. `Comics United (1).jsx`) present in `src/`
- [ ] No hardcoded `localhost` URLs in any component or config file
- [ ] All new components are in their correct `src/` subdirectory (`pages/`, `services/`, `utils/`)

### Configuration
- [ ] `netlify.toml` — `NODE_VERSION` is set to `"20"`
- [ ] `netlify.toml` — CSP `connect-src` does **not** reference `localhost:3001`
- [ ] `package.json` — `json-server` script does **not** use `--host 0.0.0.0`
- [ ] `.gitignore` includes `.env`, `.env.production`, and `.env.production.local`

### Dependencies
- [ ] Run `npm ci` (not `npm install`) to install from the lockfile exactly
- [ ] No known high/critical vulnerabilities: `npm audit --audit-level=high`
- [ ] `package-lock.json` is committed and up to date

---

## 🏗️ Local Build Verification

Always verify the production build locally before pushing to `main`:

```bash
# Install dependencies from lockfile
npm ci

# Run the production build
npm run build

# Preview the built output locally
npm run preview
