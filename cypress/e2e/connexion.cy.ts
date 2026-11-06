describe('Formulaire de connexion', () => {

  const email = 'test@test.fr';
  const mdp = 'test2026CDA';

  beforeEach(() => {
    // Arrange : repartir déconnecté à chaque test.
    // Firebase garde la session dans IndexedDB (non vidée par Cypress) ;
    // sans ça, le guard du routeur redirige /connexion vers /dashboard.
    cy.visit('http://localhost:5173/connexion', {
      onBeforeLoad(win) {
        win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
      },
    });
  });

  it("Connexion d'un utilisateur valide", () => {
    // Act : saisir les identifiants et soumettre
    cy.get('#email').type(email);
    cy.get('#password').type(mdp, { log: false });
    cy.get('button[type="submit"]').click();

    // Assert : redirection vers le dashboard, aucune erreur affichée
    cy.url().should('include', 'http://localhost:5173/dashboard');
  });

  it('Erreur avec un mauvais mot de passe', () => {
    cy.get('#email').type(email);
    cy.get('#password').type('mauvais-mdp', { log: false });
    cy.get('button[type="submit"]').click();

    cy.get('[role="alert"]',)
      .should('be.visible')
      .and('contain', 'Email ou mot de passe incorrect.');
    cy.url().should('not.include', '/dashboard');
  });

  it('Refuser un formulaire vide', () => {
    cy.get('button[type="submit"]').click();

    cy.get('[role="alert"]')
      .should('contain', 'Veuillez renseigner votre email et votre mot de passe.');
  });

  it('Bouton "Se connecter" désactivé avec un formulaire vide', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Accès au /dashboard sans être connecté', () => {
    cy.visit('http://localhost:5173/connexion');
    cy.url().should('include', 'http://localhost:5173/dashboard');
  });

});
