import * as authTokens from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';
import * as ingredientsData from '../fixtures/ingredients.json';

describe('Конструктор бургеров', () => {
  const testBun = ingredientsData.data.find((ing) => ing.type === 'bun')!;
  const testMain = ingredientsData.data.find((ing) => ing.type === 'main')!;
  const testSauce = ingredientsData.data.find((ing) => ing.type === 'sauce')!;

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('Добавляет булки и ингредиенты в конструктор', () => {
      cy.addIngredient('bun');
      cy.addIngredient('main');
      cy.addIngredient('sauce');

      // Проверка через алиасы
      cy.get('@bunCard').should('contain', testBun.name);
      cy.get('@mainCard').should('contain', testMain.name);
      cy.get('@sauceCard').should('contain', testSauce.name);

      // Проверка конструктора
      cy.get('.constructor-element__text')
        .first()
        .should('contain', `${testBun.name} (верх)`);
      cy.get('.constructor-element__text')
        .eq(1)
        .should('contain', testMain.name);
      cy.get('.constructor-element__text')
        .eq(2)
        .should('contain', testSauce.name);
      cy.get('.constructor-element__text')
        .last()
        .should('contain', `${testBun.name} (низ)`);
    });
  });

  describe('Модальные окна', () => {
    it('Открывает и закрывает модальное окно ингредиента', () => {
      cy.openIngredientModal('bun');

      // Используем алиас для модального окна
      cy.get('@modal').should('be.visible');

      // Закрытие по крестику
      cy.get('@modal').find('[data-cy="modal-close"]').click();
      cy.get('@modal').should('not.exist');

      // Закрытие по оверлею
      cy.openIngredientModal('bun');
      cy.get('[data-cy="modal-overlay"]').as('modalOverlay');
      cy.get('@modalOverlay').click({ force: true });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      cy.setCookie('accessToken', authTokens.accessToken);
      localStorage.setItem('refreshToken', authTokens.refreshToken);

      cy.addIngredient('bun');
      cy.addIngredient('main');
    });

    it('Создает заказ и очищает конструктор', () => {
      cy.createOrder();

      cy.get('@orderModal').should('be.visible');
      cy.get('@orderModal').contains(orderData.order.number);

      // Закрытие модального окна
      cy.get('@orderModal').find('button').first().click();
      cy.get('@orderModal').should('not.exist');

      // Проверка очистки конструктора
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });

    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });
  });
});
