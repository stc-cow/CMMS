# GitHub Actions & Netlify Deployment Setup

## Overview

This project uses GitHub Actions to automatically build and deploy to Netlify on every push to the `main` branch.

## Current Workflow

The `.github/workflows/jekyll-gh-pages.yml` file (renamed from Jekyll to Node.js) contains:

1. **Build Stage**: 
   - Checks out code
   - Sets up Node.js v20
   - Installs dependencies with pnpm
   - Runs type checking
   - Builds the client with Vite

2. **Deploy Stage** (only on main branch pushes):
   - Downloads the build artifact
   - Deploys to Netlify using your site credentials

## Setup Instructions

### Step 1: Connect Netlify to GitHub

1. Go to [Netlify](https://netlify.com) and sign in
2. Connect your GitHub repository:
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose the repository: `stc-cow/CMMS`
   - Leave build settings blank (we'll use GitHub Actions instead)
   - Click "Deploy site"

### Step 2: Get Netlify Credentials

1. In Netlify, go to **Team Overview** → **Settings** → **Auth token**
2. Generate a new **Personal access token** and copy it
3. In Netlify, go to **Site settings** → **General**
4. Copy your **Site ID**

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository: `stc-cow/CMMS`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - **Name**: `NETLIFY_AUTH_TOKEN`
   - **Value**: (paste your Netlify auth token)
4. Click **New repository secret** and add:
   - **Name**: `NETLIFY_SITE_ID`
   - **Value**: (paste your Netlify site ID)

### Step 4: Verify Deployment

1. Make a commit and push to `main`
2. Go to your GitHub repository → **Actions**
3. Watch the workflow run
4. Check deployment status in Netlify dashboard
5. Visit your Netlify URL to see the deployed app

## Workflow File Location

`.github/workflows/jekyll-gh-pages.yml` - Main CI/CD workflow

## Build Configuration

The build process:
- **Install**: `pnpm install --frozen-lockfile`
- **Type Check**: `pnpm run typecheck`
- **Build**: `pnpm run build:client`
- **Output**: `dist/spa/`

## Environment Variables

If your application needs environment variables during the build, add them to:

1. **GitHub Actions secrets** (for build-time variables)
2. **Netlify environment variables** (for runtime variables)

Currently set in Netlify:
- None (add as needed)

## Troubleshooting

### Deployment fails with "NETLIFY_AUTH_TOKEN not found"
- Verify the secrets are added to GitHub repository settings
- Check that secret names match exactly

### Build fails
- Check GitHub Actions logs for specific error messages
- Run `pnpm install` and `pnpm run build:client` locally to debug

### Site shows old version
- Clear Netlify cache: **Site settings** → **Builds & deploy** → **Clear cache and redeploy**
- Or redeploy manually from Netlify dashboard

## Manual Deployment (Optional)

If you prefer to deploy manually without GitHub Actions:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
pnpm run build:client

# Deploy
netlify deploy --prod --dir=dist/spa
```

## Next Steps

1. ✅ Complete the setup steps above
2. Make a test commit to main
3. Verify the build and deployment in GitHub Actions
4. Check your Netlify dashboard for the deployed site

## Support

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Netlify Docs**: https://docs.netlify.com
- **Netlify Environment Variables**: https://docs.netlify.com/configure-builds/environment-variables/
