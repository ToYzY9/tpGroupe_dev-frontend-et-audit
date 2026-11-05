describe('Tableau de bord', () => {

  const email = 'test@test.fr';
  const mdp = 'test2026CDA';

  // Repartir déconnecté : Firebase garde la session dans IndexedDB
  const visiterDeconnecte = (url: string) => {
    cy.visit(url, {
      onBeforeLoad(win) {
        win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
      },
    });
  };

  it("CT-05 d : Redirection d'un visiteur non connecté", () => {
    visiterDeconnecte('http://localhost:5173/dashboard');

    cy.url().should('eq', 'http://localhost:5173/');
    cy.get('#email').should('be.visible');
    cy.contains('h1', 'Tableau de bord').should('not.exist');
  });

  it('CT-05 e : Affichage du tableau de bord après connexion', () => {
    visiterDeconnecte('http://localhost:5173/connexion');
    cy.get('#email').type(email);
    cy.get('#password').type(mdp, { log: false });
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('h1', 'Tableau de bord').should('be.visible');
    cy.get('section[aria-label="Résumé de la journée"]').scrollIntoView().should('be.visible');
    ['Mes tickets prioritaires', 'Derniers commentaires', 'Mes tickets par catégorie', "Flux d'activité"].forEach((titre) => {
      cy.contains(titre).scrollIntoView().should('be.visible');
    });
  });

});
