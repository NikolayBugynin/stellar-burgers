export {};

declare global {
  namespace Cypress {
    interface Chainable {
      addIngredient(type: 'bun' | 'main' | 'sauce'): Chainable<void>;
      openIngredientModal(type: string): Chainable<void>;
      createOrder(): Chainable<void>;
    }
  }
}
