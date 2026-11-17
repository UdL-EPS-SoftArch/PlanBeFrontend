# AI-Assisted Spec-Driven Development (SDD) Guide

This guide explains how to expand this Next.js + Spring Data REST (HAL) + Cucumber/Playwright frontend template using AI agents and Spec-Driven Development (SDD).

---

## 1. Architecture & SDD Overview

Development is strictly guided by **Behavior-Driven Development (BDD)** end-to-end scenarios:
1. **Spec Phase**: Write executable Cucumber `.feature` files in `tests/e2e/`.
2. **Red Phase**: Write failing Playwright + Cucumber step definitions (`tests/e2e/steps/*.steps.ts`).
3. **Green Phase**: Implement HAL entity types (`src/types/`), HAL API services (`src/api/`), and Next.js App Router pages/forms (`src/app/`).
4. **Verify Phase**: Execute `npm run test:e2e:ci` (with backend running on `:8080` and Next.js on `:3000`) and `npm run build`.

The project provides **5 modular skill playbooks** in `skills/`:
- `skills/sdd-feature-designer/SKILL.md`
- `skills/sdd-cucumber-steps/SKILL.md`
- `skills/nextjs-hal-api/SKILL.md`
- `skills/nextjs-ui-pages/SKILL.md`
- `skills/sdd-bdd-verifier/SKILL.md`

---

## 2. Using AI Agents with Large Context Windows
*(Tools: OpenCode, Claude Code, Cursor, GitHub Copilot,...)*

When using AI harnesses with high token context limits, agents can read project conventions and execute multi-step workflows autonomously.

### Workflow
1. **Prompt the Agent**:
   ```
   "Add client support for managing 'Tag' entities associated with Records and owned by a User.
   Follow the SDD workflow in AGENTS.md and apply the skills in skills/."
   ```
2. **Agent Execution**:
   - Creates `tests/e2e/tag.feature` using `sdd-feature-designer`.
   - Creates `tests/e2e/steps/tag.steps.ts` using `sdd-cucumber-steps`.
   - Creates `src/types/tag.ts` and `src/api/tagApi.ts` using `nextjs-hal-api`.
   - Creates/updates Next.js pages (`src/app/tags/[id]/page.tsx`, `src/app/users/[id]/page.tsx`) using `nextjs-ui-pages`.
   - Runs `npm run build` and `npm run test:e2e:ci` using `sdd-bdd-verifier`.

---

## 3. Using Aider in VS Code with Restricted APIs & Small Models
*(Tools: Aider + Groq Free Tier 8K Token limit)*

When working under strict token limits (such as Groq's 8K tokens per message limit), **never load all skills or the entire codebase into Aider at once**. Doing so will immediately exceed context limits and result in truncated output.

---

### 3.1 Installation, Configuration & Launching Aider in VS Code

#### Installation
Install or update Aider in your Python environment following instructions at https://aider.chat/docs/install.html

#### Understanding `.aider.conf.yml` Options for Token Budgeting
The root `.aider.conf.yml` controls Aider's runtime options and is essential for keeping the context small:

```yaml
# Models
model: groq/qwen/qwen3.6-27b
editor-model: groq/openai/gpt-oss-120b
weak-model: groq/meta-llama/llama-prompt-guard-2-86m

# Always load project conventions
read:
  - CONVENTIONS.md

# Settings optimized for low-token budget models via Groq
check-model-accepts-settings: false
reasoning-effort: none
edit-format: diff                               # forces diff-style edits, not whole-file rewrites
map-tokens: 512                                 # small repo map instead of the ~1024+ default
max-chat-history-tokens: 2000                   # aggressively trims conversation history each turn
cache-prompts: true

# Behavior
test-cmd: "npm run test:e2e:ci"
auto-test: false
auto-commits: true
auto-lint: false
stream: true
dark-mode: true
```

**Why this configuration keeps context small**:
- `model`, `editor-model`, `weak-model`: Configures Groq models suitable for low-token budgets.
- `read: [CONVENTIONS.md]`: Loads only lightweight (<50 lines) rules. Specific skills from `skills/` are loaded on-demand during session stages.
- `edit-format: diff`: Forces diff-style edits rather than whole-file rewrites to save tokens.
- `map-tokens: 512`: Limits repository map token budget to avoid flooding context.
- `max-chat-history-tokens: 2000`: Aggressively trims conversation history each turn.
- `auto-test: false`: Prevents Aider from re-running tests after every minor chat turn.

#### Starting Aider in VS Code
1. Open VS Code in this repository root.
2. Open the integrated terminal.
3. Set your API key (e.g. for Groq) following the instructions at https://aider.chat/docs/llms/groq.html
4. Start Aider (models are pre-configured in `.aider.conf.yml`):
   ```bash
   aider --watch-files
   ```

---

### 3.2 Key In-Session Commands for Context Management

Once Aider is running inside the VS Code terminal, manage your files and context using these commands:

| In-Session Command | Purpose & Context Control |
| :--- | :--- |
| `/add <file>` | Adds a file to the active session for **editing** or **creating**. |
| `/read <file>` | Adds a file as **read-only context** (e.g. skills, reference code). |
| `/drop <file>` | Removes a file from session context when finished with a stage. |
| `/clear` | Clears conversation history and active files (essential between stages!). |
| `/tokens` | Displays current token usage (ensure total remains under **8,000 tokens**). |

---

### 3.3 Stage-by-Stage BDD Workflow: Feature "Manage Tag for Records"

Below is the step-by-step workflow for developing the Next.js UI and HAL client for a **Tag** entity associated with **Records** (already implemented in [`spring-template`](https://github.com/UdL-EPS-SoftArch/spring-template)) inside an active Aider session in VS Code.

---

#### Stage 1: Design E2E Feature Spec for Tag
Inside your active Aider terminal session in VS Code:

1. **Ensure reasoning is deactivated at the beginning of each session to reduce output tokens budget**:
   ```
   /reasoning-effort none
   ```

2. **Load skill and reference feature as read-only, add target feature file**:
   ```
   /read skills/sdd-feature-designer/SKILL.md
   /read tests/e2e/login.feature
   /add tests/e2e/tag.feature
   ```

3. **Check token budget**:
   ```
   /tokens
   ```

4. **Prompt Aider**:
   > Create the Cucumber E2E scenarios in tests/e2e/tag.feature for creating and viewing Tags as logged-in user "demo". Keep the file under 50 lines.

---

#### Stage 2: Implement Failing Playwright Step Definitions
Before starting Stage 2, drop files from Stage 1 to free up tokens:

1. **Reset context for Stage 2**:
   ```
   /drop skills/sdd-feature-designer/SKILL.md
   /drop tests/e2e/login.feature
   ```

2. **Load step definition skill and context**:
   ```
   /read skills/sdd-cucumber-steps/SKILL.md
   /read tests/e2e/tag.feature
   /read tests/e2e/steps/login.steps.ts
   /add tests/e2e/steps/tag.steps.ts
   ```

3. **Prompt Aider**:
   > Implement the Playwright + Cucumber step definitions in tests/e2e/steps/tag.steps.ts for tests/e2e/tag.feature without duplicating steps from login.steps.ts.

---

#### Stage 3: Implement Tag HAL Entity Type and API Service
Drop previous step definitions from session context:

1. **Reset context for Stage 3**:
   ```
   /drop skills/sdd-cucumber-steps/SKILL.md
   /drop tests/e2e/tag.feature
   /drop tests/e2e/steps/login.steps.ts
   /drop tests/e2e/steps/tag.steps.ts
   ```

2. **Load HAL API skill and reference files**:
   ```
   /read skills/nextjs-hal-api/SKILL.md
   /read src/types/record.ts
   /read src/api/recordApi.ts
   /add src/types/tag.ts
   /add src/api/tagApi.ts
   ```

3. **Prompt Aider**:
   > Implement TagEntity and Tag type in src/types/tag.ts (with uri, name, and records URI array) and TagService in src/api/tagApi.ts following the HAL service conventions.

---

#### Stage 4: Implement Next.js Pages and Forms
Drop HAL API skill and reference files from session context:

1. **Reset context for Stage 4**:
   ```
   /drop skills/nextjs-hal-api/SKILL.md
   /drop src/types/record.ts
   /drop src/api/recordApi.ts
   ```

2. **Load UI pages skill and reference pages**:
   ```
   /read skills/nextjs-ui-pages/SKILL.md
   /read src/types/tag.ts
   /read src/api/tagApi.ts
   /read src/app/records/[id]/page.tsx
   /add src/app/tags/[id]/page.tsx
   /add src/app/users/[id]/page.tsx
   ```

3. **Prompt Aider**:
   > Create the Tag detail Server Component page in src/app/tags/[id]/page.tsx and add Tag listing/creation to src/app/users/[id]/page.tsx.

---

#### Stage 5: BDD Test Verification & Failure Diagnosis
Ensure [`spring-template`](https://github.com/UdL-EPS-SoftArch/spring-template) (`:8080`) and `react-template` (`:3000`) are running, then execute the E2E tests:

1. **Run verification**:
   ```bash
   npm run build && npm run test:e2e:ci
   ```

   An HTML report is also generated at `playwright-report/results.html` (and JSON at `playwright-report/results.json`). Never load `playwright-report/results.html` into Aider as it contains embedded base64 screenshots.

2. **If a test fails**, clear context and load only the verifier skill and failing step/page file:
   ```
   /clear
   /read skills/sdd-bdd-verifier/SKILL.md
   /add tests/e2e/steps/tag.steps.ts
   /add src/app/users/[id]/page.tsx
   ```

3. **Prompt Aider** (pasting only the short terminal failure snippet):
   > Fix the failing step or form selector based on this Cucumber error summary: <paste failure snippet>.

---

## 4. Summary of Rules for Token Budgeting
- **Check tokens frequently**: Run `/tokens` before sending requests to verify you are below **8,000 tokens**.
- **Always `/drop` or `/clear` between stages**: Never leave previous stage code in active context when starting the next stage.
- **Use `/read` for reference files**: Reading files as read-only ensures Aider doesn't attempt to rewrite reference classes.
