# NEXUS Public Search

A public, free-tier deployable version of NEXUS Search.

## Deploy to a free public URL

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fwpguidexpro-hub%2FNEXUS-Public-Search)

1. Open the deploy link and sign in to Render (create a free account if needed).
2. Review the Blueprint and choose **Apply / Deploy Blueprint**.
3. When the service status is **Live**, open its `.onrender.com` URL. That will be the public NEXUS Search address instead of `127.0.0.1`.

## Included

- One Google-inspired search UI: All, Images, Videos, Maps and News.
- Free federated web search using whichever public sources are available (Bing and DuckDuckGo; a Google attempt is made but can be blocked).
- Interactive OpenStreetMap tiles and Photon place search.
- Health endpoint at `/healthz` for deployment monitoring.

## Public endpoint safety

This repository intentionally does not include any local indexed pages, analytics, or website-property records from the developer's PC. Public mode exposes only search APIs and static assets. Admin pages, crawler, property verification, and index-management APIs are blocked. Public search analytics are not persisted.

## Free plan note

Render free web services spin down after 15 minutes without inbound traffic; the first request after sleeping may take about a minute to wake up. The service is for a hobby/demo search experience, and free third-party providers have their own limits.

## Local development

```powershell
$env:NEXUS_PUBLIC_MODE='1'
$env:PORT='9301'
node server.js
```

The public service uses Render's assigned `PORT` and binds to `0.0.0.0` in Render. On the installed desktop app, the local bundled backend can continue to run on `127.0.0.1:9200` until the deployed public URL is explicitly set as its search destination.
