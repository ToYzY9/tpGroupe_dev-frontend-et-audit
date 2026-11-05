// Tests des composants du tableau de bord sur la vraie base, en lecture seule :
// le résultat attendu est recalculé depuis Firebase puis comparé à ce qui est affiché.
// Les identifiants se trouvent dans cypress.env.json (ADMIN_EMAIL et ADMIN_PASSWORD).

interface TicketBase {
  id_ticket: number;
  id_priority: number;
  id_status: number;
  id_category: number;
  id_technician?: number;
  created_at: string;
}

interface CategorieBase {
  id_category: number;
  category_name: string;
  is_active: boolean;
}

describe('Composants du tableau de bord', () => {

  const app = 'http://localhost:5173';
  const apiKey = 'AIzaSyDKxrtvSsaxF-vpo2P35s2Ft8fWRGPnTf0';
  const database = 'https://fire-one-496af-default-rtdb.europe-west1.firebasedatabase.app';

  // Repartir déconnecté : Firebase garde la session dans IndexedDB
  const visiterDeconnecte = (url: string) => {
    cy.visit(url, {
      onBeforeLoad(win) {
        win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
      },
    });
  };

  const seConnecter = () => {
    cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ ADMIN_EMAIL, ADMIN_PASSWORD }) => {
      visiterDeconnecte(`${app}/connexion`);
      cy.get('#email').type(ADMIN_EMAIL);
      cy.get('#password').type(ADMIN_PASSWORD, { log: false });
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  };

  // Un nœud Firebase peut arriver sous forme de liste ou d'objet : on obtient toujours une liste
  const lireNoeud = <T>(noeud: string, token: string) =>
    cy.request({ url: `${database}/${noeud}.json?auth=${token}`, log: false })
      .then(({ body }) => Object.values(body ?? {}).filter(Boolean) as T[]);

  const lireBase = () =>
    cy.env(['ADMIN_EMAIL', 'ADMIN_PASSWORD']).then(({ ADMIN_EMAIL, ADMIN_PASSWORD }) =>
      cy.request({
        method: 'POST',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true },
        log: false,
      }).then(({ body }) =>
        lireNoeud<TicketBase>('tickets', body.idToken).then((tickets) =>
          lireNoeud<CategorieBase>('categories', body.idToken).then((categories) => ({ tickets, categories })),
        ),
      ),
    );

  const bloc = (titre: string) => cy.contains('h2', titre).parents('article');

  const accorderTickets = (nombre: number) => `${nombre} ${nombre > 1 ? 'tickets' : 'ticket'}`;

  describe('Utilisateur connecté', () => {

    beforeEach(() => {
      seConnecter();
    });

    it('CT-05 a : Comptage des tickets par catégorie', () => {
      lireBase().then(({ tickets, categories }) => {
        const attendu = categories
          .map((categorie) => ({
            ...categorie,
            nombre: tickets.filter((ticket) => ticket.id_category === categorie.id_category).length,
          }))
          .filter((categorie) => categorie.is_active || categorie.nombre > 0)
          .sort((a, b) => b.nombre - a.nombre);

        bloc('Mes tickets par catégorie').find('li').should('have.length', attendu.length);
        attendu.forEach((categorie, index) => {
          bloc('Mes tickets par catégorie').find('li').eq(index).find('span').eq(0).should('have.text', categorie.category_name);
          bloc('Mes tickets par catégorie').find('li').eq(index).find('span').eq(1).should('have.text', accorderTickets(categorie.nombre));
        });
      });
    });

    it('CT-05 b : Liste des tickets critiques à prendre en charge', () => {
      lireBase().then(({ tickets }) => {
        const attendu = tickets
          .filter((ticket) => ticket.id_priority === 1 && ticket.id_status === 1 && ticket.id_technician == null)
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        if (attendu.length === 0) {
          bloc('Mes tickets prioritaires').find('tbody').should('contain', '0 ticket à prendre en charge');
          return;
        }

        bloc('Mes tickets prioritaires').find('tbody tr').should('have.length', attendu.length);
        attendu.forEach((ticket, index) => {
          bloc('Mes tickets prioritaires').find('tbody tr').eq(index).as('ligne');
          cy.get('@ligne').find('td').eq(0).should('have.text', `#${ticket.id_ticket}`);
          cy.get('@ligne').should('contain', 'Critique').and('contain', 'Nouveau');
        });

        // La liste défile dans sa carte : la dernière ligne reste accessible
        bloc('Mes tickets prioritaires').find('.overflow-auto').invoke('outerHeight').should('be.at.most', 384);
        bloc('Mes tickets prioritaires').find('tbody tr').last().scrollIntoView().should('be.visible');
      });
    });

    it('CT-05 c : Compteurs du tableau de bord', () => {
      lireBase().then(({ tickets }) => {
        const compteurs: [string, number][] = [
          ['Mes tickets ouverts', tickets.filter((ticket) => ticket.id_status === 2).length],
          ['Critiques à traiter', tickets.filter((ticket) => ticket.id_priority === 1 && ![3, 4].includes(ticket.id_status)).length],
          ['Tickets non affectés', tickets.filter((ticket) => ticket.id_technician == null).length],
          ['Tickets résolus', tickets.filter((ticket) => ticket.id_status === 3).length],
        ];

        compteurs.forEach(([titre, nombre]) => {
          bloc(titre).find('p.text-3xl').should('have.text', String(nombre));
        });
        bloc('Tickets résolus').should('contain', `sur ${tickets.length} ${tickets.length > 1 ? 'tickets enregistrés' : 'ticket enregistré'}`);
      });
    });

    it('CT-05 e : Affichage du tableau de bord après connexion', () => {
      cy.contains('h1', 'Tableau de bord').should('be.visible');
      cy.get('section[aria-label="Résumé de la journée"]').scrollIntoView().should('be.visible');
      ['Mes tickets prioritaires', 'Derniers commentaires', 'Mes tickets par catégorie', "Flux d'activité"].forEach((titre) => {
        cy.contains(titre).scrollIntoView().should('be.visible');
      });
    });

  });

  it("CT-05 d : Redirection d'un visiteur non connecté", () => {
    visiterDeconnecte(`${app}/dashboard`);

    cy.url().should('eq', `${app}/`);
    cy.get('#email').should('be.visible');
    cy.contains('h1', 'Tableau de bord').should('not.exist');
  });

});
