
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

/** Remplit uniquement les champs fournis (une valeur vide / false = champ laissé tel quel). */
function remplirFormulaire(valeurs: Partial<Champs>) {
  if (valeurs.email) cy.get('#email').type(valeurs.email)
  if (valeurs.username) cy.get('#username').type(valeurs.username)
  if (valeurs.password) cy.get('#password').type(valeurs.password)
  if (valeurs.confirmPassword) {
    cy.get('#confirmPassword').type(valeurs.confirmPassword)
  }
  if (valeurs.terms) cy.get('#terms').check()
}

describe("Formulaire d'inscription", () => {
  beforeEach(() => {
    // Arrange : page d'inscription
    cy.visit(URL_LOCAL+'/', {
      onBeforeLoad(win) {
        win.indexedDB.deleteDatabase('firebaseLocalStorageDb')
      },
    })
    cy.get('#email').type('test@test.fr')
    cy.get('#password').type('test2026CDA')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', URL_LOCAL+'/dashboard')

    cy.visit(URL_LOCAL+'/register')
  })


  describe('Champ vide', () => {
    it('Bloquer l\'envoi si le formulaire est vide', () => {
      // Act
      cy.get('button[type="submit"]').click()


    })

    const champsObligatoires = ['email', 'username', 'password', 'confirmPassword', 'terms'] as const

    champsObligatoires.forEach((champ) => {
      it(`doit bloquer l'envoi si seul le champ "${champ}" est vide`, () => {
        // Arrange : tout est rempli sauf un champ
        const valeurs: Partial<Champs> = { ...VALIDES }
        if (champ === 'terms') valeurs.terms = false
        else valeurs[champ] = ''

        // Act
        remplirFormulaire(valeurs)
        cy.get('button[type="submit"]').click()

        // Assert
        cy.get(`#${champ}:invalid`).should('exist')
        cy.get('@signUp.all').should('have.length', 0)
      })
    })
  })

  describe('Mot de passe faible', () => {
    it('doit refuser un mot de passe de moins de 8 caractères', () => {
      // Act
      remplirFormulaire({ ...VALIDES, password: 'Abc12', confirmPassword: 'Abc12' })
      cy.get('button[type="submit"]').click()

      // Assert : message front + aucun appel Firebase
      cy.contains('Password must be at least 8 characters long.').should('be.visible')
      cy.get('@signUp.all').should('have.length', 0)
      cy.contains('Account created successfully!').should('not.exist')
      cy.url().should('include', '/register')
    })
  })

  describe('Email invalide', () => {
    ;['pas-un-email', 'test@', '@test.fr'].forEach((emailInvalide) => {
      it(`doit refuser l'email "${emailInvalide}"`, () => {
        // Act
        remplirFormulaire({ ...VALIDES, email: emailInvalide })
        cy.get('button[type="submit"]').click()

        // Assert : validation native du type="email" (le formulaire n'est pas envoyé)
        cy.get('#email:invalid').should('exist')
        cy.get('#email').then(($el) => {
          const input = $el[0] as HTMLInputElement
          expect(input.validity.typeMismatch, 'typeMismatch').to.eq(true)
          expect(input.validationMessage).to.not.be.empty
        })
        cy.get('@signUp.all').should('have.length', 0)
        cy.url().should('include', '/register')
      })
    })
  })

  describe('Inscription valide', () => {
    it('Créer le compte, déconnecter puis reconnecter le nouvel utilisateur', () => {
      // Arrange : email unique à chaque exécution (Firebase refuse les doublons)
      const email = `cda.${Date.now()}@test.fr`
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

      // --- Assert 1 : compte créé, formulaire réinitialisé ---
      cy.wait('@signUp').its('response.statusCode').should('eq', 200)
      cy.contains('Account created successfully!', { timeout: 10000 }).should('be.visible')
      cy.get('.text-error').should('not.exist')
      cy.get('#email').should('have.value', '')
      cy.get('#username').should('have.value', '')
      cy.get('#password').should('have.value', '')
      cy.get('#confirmPassword').should('have.value', '')
      cy.get('#terms').should('not.be.checked')

      // --- Act 2 : déconnexion ---
      cy.contains('button', 'Déconnexion').click()

      // --- Assert 2 : retour sur la page de connexion ---
      cy.url().should('include', '/connexion')

      // --- Act 3 : reconnexion avec le nouveau compte ---
      cy.get('#email').type(email)
      cy.get('#password').type(motDePasse)
      cy.get('button[type="submit"]').click()

      // --- Assert 3 : le nouvel utilisateur est bien connecté ---
      cy.url({ timeout: 10000 }).should('include', '/dashboard')
    })
  })
})