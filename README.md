# NEXUS Public Search

Public, free-tier deployable version of NEXUS Search.

## Included

- A single Google-inspired search interface: All, Images, Videos, Maps and News.
- Free federated search sources when available (Bing, DuckDuckGo and a Google attempt). Google may block automated traffic.
- Interactive OpenStreetMap tiles and Photon location search.
- Works as a public Node.js web service, including Render free instance support.

## Privacy and public endpoints

This repository does not include any local indexed pages, user analytics or site property records from the developer's PC. Public mode exposes only search and public static-asset routes; admin, crawl, property verification and index-management API routes are blocked. Search logs are not persisted.

## Deploy for free

Use Render Blueprint deployment with this repository. It uses the public service port assigned by Render, binds to 0.0.0.0, and exposes a /healthz endpoint. Render free instances sleep after inactivity and may take about a minute to wake up; the local installed desktop browser remains locally hosted until configured to use the deployed public service.

## Open data

Map search uses Photon and map tiles from OpenStreetMap. Respect provider usage policies; free public services are rate-limited.
