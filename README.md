# Skybound Flight Booking Prototype

UED100 Assessment 2 — educational airline prototype inspired by the Assessment 1 Qantas analysis.

## Run in Visual Studio Code
1. Install Node.js 24 LTS from https://nodejs.org/ and open this folder in VS Code.
2. Open Terminal > New Terminal. Run each command separately:

```sh
npm install -g pnpm
pnpm install --frozen-lockfile
pnpm run dev
```

3. Open the local URL printed by Vite (usually http://localhost:5173/).
4. In a separate terminal, run `pnpm run build` and `pnpm run format --check` to verify the build and formatting.

## Demo tests
- Search Sydney to Melbourne with future travel dates; select one-way to disable return date.
- Swap airports and change passenger count.
- Retrieve booking SKY123 / HART; try incorrect details.
- Check flight status using SY218 and a date.
- Submit an empty contact form, then use a fictional name, example@example.com and a message of at least 15 characters.
- Resize browser to mobile width and test navigation.

All results are simulated; no real bookings, emails or flight lookups occur. Sign-in and header search are placeholders. The original application logic is retained, including its limitations (e.g. identical airports are not rejected). Google Fonts require internet; fallback fonts are available.

## Packaging notes
The supplied Figma Make source, stylesheet, image, dependency files and TypeScript configuration are retained. The Vite configuration and HTML shell were simplified to remove the missing Figma-specific site.json dependency. No dependencies or build output are bundled. Local build and browser tests remain to be performed.

Figma Make: https://www.figma.com/make/gPs9AD1R2jckzwVbRABtXp/Skybound-Flight-Booking-Prototype?code-node-id=0-6
