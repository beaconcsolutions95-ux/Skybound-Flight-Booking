# Skybound Flight Booking Prototype

UED100 Assessment 2 — educational airline prototype inspired by the Assessment 1 Qantas analysis.

## Run locally
Use Node.js 24 LTS and open the project folder in Visual Studio Code. In Terminal > New Terminal:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Stop with Ctrl+C. Run `npm run build` to generate production files, then optionally `npm run preview` to preview them. If the npm lockfile is present, `npm ci` can install the locked dependencies instead of `npm install`.

## Manual regression tests (expected results)

| Test | Expected result |
| --- | --- |
| Return search with different airports and valid future dates | Simulated availability |
| One-way search | Return date disabled; simulated availability |
| Same origin and destination, with valid dates | Route error; no availability |
| Change any search input or swap airports after a search | Previous result and route error cleared |
| SKY123 / HART | Sample booking displayed |
| Incorrect booking reference | Booking error |
| SY218 and travel date | Simulated status |
| Empty contact form | Field validation errors |
| Fictional name, valid email, message of at least 15 characters | Demo confirmation; no email sent |
| Narrow browser window | Mobile navigation opens and closes |

Run these tests after installing this revision; expected results are not a record of completed tests.

## Limitations
All flight availability, booking and status data are simulated. No backend, real bookings, email delivery or authentication is implemented. Header search, sign-in and footer policy links are placeholders. Contact validation is client-side only. Google Fonts require internet; fallback fonts are available. Full accessibility compliance has not been verified.

## Design and repository
- Figma Make: https://www.figma.com/make/gPs9AD1R2jckzwVbRABtXp/Skybound-Flight-Booking-Prototype?code-node-id=0-6
- GitHub: https://github.com/beaconcsolutions95-ux/Skybound-Flight-Booking

Keep package-lock.json from the local npm installation in version control. Do not commit node_modules, dist, or credentials.
