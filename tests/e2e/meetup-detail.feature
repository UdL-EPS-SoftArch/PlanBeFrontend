Feature: Detalle de quedada
  In order to decide whether to join a meetup
  As a signed-in user
  I want to see its full details and only the actions I am allowed to perform

  Scenario: El organizador ve los datos reales y sus acciones
    Given a public meetup created by a test user
    When I open the meetup detail page as the owner
    Then I should see the meetup details
    And I should see the meetup placeholders
    And I should see the organizer actions for a public meetup

  Scenario: El organizador cancela una quedada abierta
    Given a public meetup created by a test user
    When I open the meetup detail page as the owner
    And I cancel the meetup
    Then I should see the cancelled meetup

  Scenario: Un visitante puede unirse y abandonar una quedada pública
    Given a public meetup created by a test user
    And a second test user
    When I open the meetup detail page as the visitor
    Then I should see the join action
    And I should not see the organizer actions for a public meetup
    When I click the join action
    Then I should see the leave action
    And I should not see the join action
    When I click the leave action
    Then I should see the join action

  Scenario: Una quedada privada no se muestra a quien no tiene acceso
    Given a private meetup created by a test user
    And a second test user
    When I open the meetup detail page as the visitor
    Then I should see the friendly access denied page
    And I should not see the meetup title

  Scenario: Una persona invitada ve la quedada privada
    Given a private meetup created by a test user
    And a second test user
    And an invitation for the visitor to the meetup
    When I open the meetup detail page as the visitor
    Then I should see the meetup details
    And I should not see the join action
    And I should see the comment action

  Scenario: Una quedada de grupo oculta su detalle a quien no es miembro
    Given a group meetup created by a test user
    And a second test user
    When I open the meetup detail page as the visitor
    Then I should see the friendly not found page
    And I should not see the meetup title

  Scenario: Un identificador inexistente no revela la quedada
    Given a public meetup created by a test user
    When I open a missing meetup detail page as the owner
    Then I should see the friendly access denied page
