Feature: User login
  Scenario: Successful login
    Given I open the main page
    When I click the button "Entrar"
    And I enter "demo" and "password"
    Then I should see the user page for "demo"
