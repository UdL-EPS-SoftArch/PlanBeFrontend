Feature: User login
  Scenario: Successful login
    Given I open the main page
    When I click the button "Entrar"
    And I enter the seeded user credentials
    Then I should see the user page for "demo"
