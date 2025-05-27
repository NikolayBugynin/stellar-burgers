Cypress.Commands.add('addIngredient', (type) => {
  cy.get(`[data-cy="${type}"]`).first().as(`${type}Card`);
  cy.get(`@${type}Card`).find('button:contains("Добавить")').click();
});

Cypress.Commands.add('openIngredientModal', (type) => {
  cy.get(`[data-cy="${type}"]`).first().click();
  cy.get('[data-cy="modal"]').as('modal').should('be.visible');
});

Cypress.Commands.add('createOrder', () => {
  cy.get('button:contains("Оформить заказ")').as('orderButton').click();
  cy.get('[data-cy="modal"]').as('orderModal').should('be.visible');
});
