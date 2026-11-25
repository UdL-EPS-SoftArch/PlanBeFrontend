Feature: Navegación y sesión
  Scenario: La home pública muestra la marca de PlanBe
    Given I open the main page
    Then I should see the heading "Haz planes con gente cerca de ti."
    And I should see the link "Entrar" in the navigation bar

  Scenario: Una página protegida redirige al login y vuelve a ella
    When I open the page "/meetups/new"
    Then I should be on the login page with next "/meetups/new"
