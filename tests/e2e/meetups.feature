Feature: Descubrir quedadas
  In order to find plans near me
  As a visitor
  I want to browse and filter meetups from the discovery page

  Scenario: La página de quedadas muestra los filtros y el estado de la lista
    When I open the page "/meetups"
    Then I should see the heading "Quedadas"
    And I should see the meetup filters
    And I should see the pagination summary
    And I should see the meetup list or a clear empty message
    And I should not see the create meetup action

  Scenario: Los filtros se guardan en la URL y se restauran al recargar
    When I open the page "/meetups"
    When I filter meetups by category "Deporte" and city "Lleida"
    Then the meetups URL should contain "category=SPORTS" and "city=Lleida"
    When I reload the page
    Then the category filter should contain "Deporte"
    And the city filter should contain "Lleida"

  Scenario: Una ciudad sin resultados muestra un mensaje claro
    When I open the page "/meetups"
    When I filter meetups by city "CiudadQueNoExiste123"
    Then I should see the empty meetups message

  Scenario: Un usuario con sesión ve el botón para crear quedada
    Given I open the login page
    When I click the button "Entrar"
    And I enter the seeded user credentials
    Then I should see the user page for "demo"
    When I open the page "/meetups"
    Then I should see the create meetup action
