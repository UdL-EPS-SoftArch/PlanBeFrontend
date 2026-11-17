---
name: sdd-feature-designer
description: Design concise, standardized Cucumber Gherkin E2E feature files (.feature) for Next.js UI flows backed by Spring Data REST.
---

# SDD Feature Designer Skill

This skill guides AI agents (Aider, OpenCode, Claude Code, Cursor, Copilot) to author concise, high-quality Cucumber BDD `.feature` files in `tests/e2e/` for Next.js client features interacting with the [`spring-template`](https://github.com/UdL-EPS-SoftArch/spring-template) Spring Data REST backend.

## Guidelines
- **Size Constraint**: Keep `.feature` files concise (under 50 lines). Focus on core end-to-end user journeys (authentication, navigation, creating, listing, and viewing entities, and form validation errors).
- **Reuse Existing Steps**: Always align with standard navigation and login steps already defined in `tests/e2e/steps/login.steps.ts`:
  - `Given I open the main page`
  - `Given I open the login page`
  - `When I click the button "<buttonText>"`
  - `When I enter "<username>" and "<password>"`
  - `Then I should see the user page for "<username>"`
- **Backend Seed Data**: The [`spring-template`](https://github.com/UdL-EPS-SoftArch/spring-template) backend automatically initializes a default user with username `"demo"` and password `"password"` (`DBInitialization.java`).
- **UI-Driven Language**: Describe user-visible actions (clicking buttons/links, filling form inputs, seeing headings/cards/error messages) rather than raw HTTP status codes.

## Gherkin Template for Next.js E2E Flows

```gherkin
Feature: Manage <Entity>
  In order to <business goal>
  As a registered user
  I want to create and view <entities> in the web application

  Scenario: Create a new <entity> and see it listed
    Given I open the main page
    When I click the button "Login"
    And I enter "demo" and "password"
    Then I should see the user page for "demo"
    When I create a new <entity> with name "Sample <Entity>" and description "Sample description"
    Then I should see the <entity> "Sample <Entity>" in the list

  Scenario: View <entity> details page
    Given I open the main page
    When I click the button "Login"
    And I enter "demo" and "password"
    Then I should see the user page for "demo"
    When I click on the <entity> link "Sample <Entity>"
    Then I should see the <entity> detail page for "Sample <Entity>"
```
