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
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('Добавляет булки и ингредиенты в конструктор', () => {
      // Проверяем отображение ингредиентов
      cy.get(`[data-cy="${testBun.type}"]`).should('exist');
      cy.get(`[data-cy="${testMain.type}"]`).should('exist');
      cy.get(`[data-cy="${testSauce.type}"]`).should('exist');

      // Добавляем ингредиенты через кнопку "Добавить"
      cy.get(`[data-cy="${testBun.type}"]`)
        .first()
        .find('button')
        .contains('Добавить')
        .click();
      cy.get(`[data-cy="${testMain.type}"]`)
        .first()
        .find('button')
        .contains('Добавить')
        .click();
      cy.get(`[data-cy="${testSauce.type}"]`)
        .first()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем конструктор
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
      cy.get(`[data-cy="${testBun.type}"]`).first().click();
      cy.get('[data-cy="modal"]').should('be.visible');

      // Закрытие по крестику
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Открытие и закрытие по оверлею
      cy.get(`[data-cy="${testBun.type}"]`).first().click();
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Мокируем API
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      // Авторизуемся
      cy.setCookie('accessToken', authTokens.accessToken);
      localStorage.setItem('refreshToken', authTokens.refreshToken);

      // Добавляем ингредиенты
      cy.get(`[data-cy="${testBun.type}"]`)
        .first()
        .find('button')
        .contains('Добавить')
        .click();
      cy.get(`[data-cy="${testMain.type}"]`)
        .first()
        .find('button')
        .contains('Добавить')
        .click();
    });

    it('Создает заказ и очищает конструктор', () => {
      // Оформляем заказ
      cy.get('button').contains('Оформить заказ').click();

      // Проверяем модальное окно
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('#modals h2').should('contain', orderData.order.number);

      // Закрываем модальное окно
      cy.get('#modals button').first().click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Проверяем очистку конструктора
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });

    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });
  });
});
