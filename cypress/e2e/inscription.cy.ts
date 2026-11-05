const URL_LOCAL = 'http://localhost:5173'

type Champs = {
  email: string
  username: string
  password: string
  confirmPassword: string
  terms: boolean
}

// Valeurs valides servant de base à chaque test
const VALIDES: Champs = {
  email: 'cda.valide@test.fr',
  username: 'testeurCDA',
  password: 'Test2026CDA!',
  confirmPassword: 'Test2026CDA!',
  terms: true,
}

// Email unique à chaque appel (Firebase refuse les doublons)
const emailUnique = () => `cda.${Date.now()}@test.fr`

/**
 * Remplit le formulaire. Un champ vide ('' ou false) est simplement ignoré,
 * car cy.type('') provoque une erreur Cypress.
 * Le rôle (select obligatoire) est choisi une fois la liste chargée depuis Firebase.
 */
function remplirFormulaire(champs: Champs, choisirRole = true) {
  if (champs.email) cy.get('#email').type(champs.email)
  if (champs.username) cy.get('#username').type(champs.username)

  if (choisirRole) {
    // Index 0 = option "Choisir un rôle" (disabled) -> on prend la première vraie option
    cy.get('#role option').should('have.length.greaterThan', 1)
    cy.get('#role').select(1)
  }

  if (champs.password) cy.get('#password').type(champs.password)
  if (champs.confirmPassword) cy.get('#confirmPassword').type(champs.confirmPassword)
  if (champs.terms) cy.get('#terms').check()
}

// Vérifie qu'AUCUNE requête d'inscription n'est partie vers Firebase
const verifierAucuneInscription = () => {
  cy.get('@signUp.all').should('have.length', 0)
  cy.url().should('include', '/register')
}

describe("Formulaire d'inscription", () => {
  beforeEach(() => {
    // Espionne l'appel Firebase Auth de création de compte
    cy.intercept('POST', '**/accounts:signUp*').as('signUp')

    // --- Connexion préalable (obligatoire pour accéder à /register) ---
    cy.visit(URL_LOCAL + '/', {
      onBeforeLoad(win) {
        win.indexedDB.deleteDatabase('firebaseLocalStorageDb')
      },
    })
    cy.get('#email').type('test@test.fr')
    cy.get('#password').type('test2026CDA')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')

    // --- Accès à la page d'inscription ---
    cy.visit(URL_LOCAL + '/register')
  })

  describe('Champs obligatoires', () => {
    it("Bloque l'envoi si tous les champs sont vides", () => {
      cy.get('button[type="submit"]').click()

      // La validation native (attribut required) bloque la soumission
      cy.get('form').then(($form) => {
        expect(($form[0] as HTMLFormElement).checkValidity()).to.be.false
      })
      cy.get('#email').should('match', ':invalid')
      cy.get('#username').should('match', ':invalid')
      cy.get('#role').should('match', ':invalid')
      cy.get('#password').should('match', ':invalid')
      cy.get('#confirmPassword').should('match', ':invalid')
      cy.get('#terms').should('match', ':invalid')

      verifierAucuneInscription()
    })

    it("Bloque l'envoi si le champ email est vide", () => {
      remplirFormulaire({ ...VALIDES, email: '' })
      cy.get('button[type="submit"]').click()

      cy.get('#email').should('match', ':invalid')
      cy.get('#email').then(($input) => {
        expect(($input[0] as HTMLInputElement).validity.valueMissing).to.be.true
      })
      verifierAucuneInscription()
    })
  })

  describe('Validation des valeurs', () => {
    it('Refuse un mot de passe faible (moins de 8 caractères)', () => {
      const faible = 'Ab1!xyz' // 7 caractères
      remplirFormulaire({
        ...VALIDES,
        email: emailUnique(),
        password: faible,
        confirmPassword: faible,
      })
      cy.get('button[type="submit"]').click()

      // Message du composant (validation front-end dans handleRegister)
      cy.contains('Password must be at least 8 characters long.').should('be.visible')
      cy.contains('Account created successfully!').should('not.exist')
      verifierAucuneInscription()
    })

    it("Refuse un email dans un mauvais format", () => {
      remplirFormulaire({ ...VALIDES, email: 'email-invalide' }) // pas de @
      cy.get('button[type="submit"]').click()

      // Le type="email" fait échouer la validation native -> handleRegister n'est pas appelé
      cy.get('#email').should('match', ':invalid')
      cy.get('#email').then(($input) => {
        expect(($input[0] as HTMLInputElement).validity.typeMismatch).to.be.true
      })
      cy.contains('Account created successfully!').should('not.exist')
      verifierAucuneInscription()
    })
  })

  describe('Inscription valide', () => {
    it('Crée le compte, déconnecte puis reconnecte le nouvel utilisateur', () => {
      // Arrange
      const email = emailUnique()
      const motDePasse = 'Test2026CDA!'

      // --- Act 1 : inscription ---
      remplirFormulaire({
        email,
        username: 'testeurCDA',
        password: motDePasse,
        confirmPassword: motDePasse,
        terms: true,
      })
      cy.get('button[type="submit"]').click()

      // --- Act 2 : déconnexion ---
      cy.contains('button', 'Déconnexion').should('be.visible').and('not.be.disabled').click()

      // --- Assert 2 : retour sur la page de connexion ---
      cy.location('pathname').should('eq', '/connexion')
      cy.get('#email').should('be.visible').and('be.enabled')

      // --- Act 3 : reconnexion avec le nouveau compte ---
      cy.get('#email').type(email)
      cy.get('#email').should('have.value', email) // vérifie que la saisie n'a pas été perdue
      cy.get('#password').type(motDePasse)
      cy.get('#password').should('have.value', motDePasse)
      cy.get('button[type="submit"]').click()
    })
  })
})