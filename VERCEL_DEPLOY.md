# Vercel Deployment Guide - PixelForge Nexus Client

## Fixes Applied for Vercel Build

1. **Vite config**: Changed `minify: 'terser'` to `minify: 'esbuild'` (Vite 5 uses esbuild by default; terser requires an extra plugin and was likely causing the build to fail).

2. **Favicon**: Replaced missing `/vite.svg` reference with an inline favicon to avoid 404s.

3. **Node version**: Added `engines` in package.json and `.nvmrc` so Vercel uses Node 18+.

## Vercel Project Settings

When importing from GitHub, use:

| Setting | Value |
|--------|--------|
| **Root Directory** | `client` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` (default) |
| **Install Command** | `npm install` (default) |

## Environment Variables (optional)

Add in Vercel → Project → Settings → Environment Variables:

| Name | Value | Notes |
|------|--------|--------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | Your Render backend URL. Leave empty for same-origin (if you proxy API later). |

## Steps to Deploy

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import **AjayLohith/ProjectMangement** from GitHub.
3. Set **Root Directory** to `client` (click Edit next to it).
4. Leave Framework Preset as **Vite**.
5. (Optional) Add `VITE_API_URL` if your API is on Render.
6. Click **Deploy**.

## If Build Still Fails

- In the build logs, find the first red error line (e.g. `Error: ...` or `Failed to compile`).
- If it’s an ESLint error: in **client/package.json**, change the build script to:
  - `"build": "vite build"`  
  (and ensure you don’t run `lint` in the same script unless you fix all lint errors).
- If it’s a missing module: run `npm install` and `npm run build` inside the `client` folder locally and fix any errors, then push and redeploy.

## After Deploy

- Your app will be at `https://project-mangement-xxx.vercel.app` (or your custom domain).
- Set **CLIENT_URL** on your Render backend to this URL so CORS and cookies work.
