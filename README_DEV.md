# Developer notes — Scam Verification Engine (SVE_02)

This file contains quick steps to install dependencies, run the server, and run tests locally.

Prerequisites
- Node.js 18+ (recommended). Use your preferred Node.js version manager (nvm, fnm, etc.).
- npm (bundled with Node.js)

Install dev dependencies (root)
1. From repository root:
   npm ci

Install server deps
2. From repository root:
   cd server && npm ci
   cd ..

Run tests
- From repository root:
  npm test

Notes and troubleshooting
- The server makes network calls (WHOIS, SSL certificate fetch, DNS resolution). Tests that perform real network calls may be flaky. If you have tests that expect offline behavior, either mock network calls in the tests or run them behind a stable network.
- If CI is failing due to network lookups, consider adding a mock mode to the engine (e.g., env var `SVE_TEST_MODE=true`) which returns stable responses for WHOIS/SSL/DNS.
- The `server/blacklist.json` file is used by server/index.js for blacklist checks. Keep it in place unless you want to centralize blacklists elsewhere.
- If tests are in `server/tests`, ensure your root `package.json` test script runs Jest/Mocha against that directory (or update test paths to the root `tests` dir).

Developer contact
- If tests fail due to external dependencies (WHOIS / network lookups), add small unit tests that mock the external functions in `server/scamEngine.js` to keep CI deterministic.
