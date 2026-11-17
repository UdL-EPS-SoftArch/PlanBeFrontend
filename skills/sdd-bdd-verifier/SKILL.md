---
name: sdd-bdd-verifier
description: Execute Cucumber + Playwright E2E verification tests and Next.js build checks, and extract token-efficient diagnostic feedback.
---

# SDD BDD Verifier Skill

This skill provides AI agents with E2E test execution, build verification, and token-efficient failure diagnostic instructions.

## Prerequisites
Before running E2E tests, ensure both servers are running:
1. **Spring Boot Backend ([`spring-template`](https://github.com/UdL-EPS-SoftArch/spring-template))**: listening on `http://127.0.0.1:8080` (default profile seeds user `"demo"` / `"password"`).
2. **Next.js Frontend (`react-template`)**: listening on `http://localhost:3000` (`npm run dev` or `npm run build && npm run start`).

## Verification Commands
```bash
# Run Cucumber + Playwright E2E tests with concise progress output
npm run test:e2e:ci

# Verify TypeScript types and Next.js production build
npm run build
```

## Failure Diagnosis Routine
When an E2E test fails, do NOT load `playwright-report/results.html` into context (it embeds base64 screenshots and is very large). Instead:
1. Inspect the terminal failure summary output from `npm run test:e2e:ci` or check `playwright-report/results.json`.
2. Extract only:
   - Failing Feature & Scenario name
   - Exact step that failed (`Given`/`When`/`Then`)
   - Playwright error message (e.g., locator timeout, missing `#id`, strict mode violation, or HTTP error from `halClient.ts`)
   - Step definition file and line number (`tests/e2e/steps/*.steps.ts`)

## Fix Protocol
Apply minimal diff changes to either the step definition (`tests/e2e/steps/*.steps.ts`), HAL service (`src/api/*Api.ts`), or page component (`src/app/.../page.tsx`) to resolve the failure.
