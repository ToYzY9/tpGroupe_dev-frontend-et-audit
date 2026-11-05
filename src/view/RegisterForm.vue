<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100 p-4 text-base-content">
    
    <div class="bg-base-200 sm:p-10 max-w-[450px] w-full rounded-lg border border-base-300">
      
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-primary mb-2">Créer un compte</h1>
      </div>

      <!-- Messages d'Alerte (Erreur ou Succès) -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-error/10 text-error text-sm rounded-field border border-error/30">
        {{ errorMessage }}
      </div>

      <transition name="fade">
        <div v-if="successMessage" class="mb-4 p-3 bg-success/10 text-success text-sm rounded-md border border-success/30">
          {{ successMessage }}
        </div>
      </transition>

      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Champ Email -->
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-bold">E-mail</label>
          <input 
            id="email"
            v-model="form.email"
            type="email" 
            class="input w-full"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- Champ Username -->
        <div class="flex flex-col gap-1.5">
          <label for="username" class="text-sm font-bold">Nom d'utilisateur</label>
          <input 
            id="username"
            v-model="form.username"
            type="text" 
            class="input w-full"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- Menu déroulant Rôle -->
        <div class="flex flex-col gap-1.5">
          <label for="role" class="text-[15px] font-bold">Rôle</label>
          <select
            id="role"
            v-model="form.role"
            class="select w-full rounded-md h-11 text-sm"
            :disabled="isLoading || rolesLoading"
            required
          >
            <option value="" disabled>
              {{ rolesLoading ? 'Chargement…' : 'Choisir un rôle' }}
            </option>
            <option v-for="r in roles" :key="r.id_role" :value="r.id_role">
              {{ r.role_name }}
            </option>
          </select>
        </div>

        <!-- Champ Password -->
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-bold">Mot de passe</label>
          <input 
            id="password"
            v-model="form.password"
            type="password" 
            class="input w-full"
            :disabled="isLoading"
            required
          />
          <p class="text-xs text-base-content/70 mt-0.5">
            8 caractères minimum, avec des majuscules, des minuscules et des chiffres.
          </p>
        </div>

        <!-- Champ Confirm Password -->
        <div class="flex flex-col gap-1.5 pt-1">
          <label for="confirmPassword" class="text-sm font-bold">Confirmer le mot de passe</label>
          <input 
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password" 
            class="input w-full"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- Checkbox -->
        <div class="flex items-start gap-2.5 pt-2">
          <input 
            id="terms"
            v-model="form.agreedToTerms"
            type="checkbox" 
            class="checkbox checkbox-primary checkbox-sm mt-0.5 disabled:opacity-50" 
            :disabled="isLoading"
            required
          />
          <label for="terms" class="text-sm text-base-content/80 leading-tight">
            J'accepte les 
            <a href="#" class="text-info hover:underline">Conditions d'utilisation</a> 
            et la 
            <a href="#" class="text-info hover:underline">Politique de confidentialité</a>.
          </label>
        </div>

        <!-- Bouton Sign Up -->
        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="btn btn-primary btn-block font-bold"
          >
            <!-- Spinner daisyUI qui s'affiche si isLoading est true -->
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            <span v-else>S'inscrire</span>
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { initializeApp, deleteApp, type FirebaseApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { ref as dbRef, set, get, serverTimestamp } from 'firebase/database'
import { auth, database } from '../services/firebase' // Chemin vers ton fichier firebase.ts

interface Role {
  id_role: number
  role_name: string
}

const form = reactive({
  email: '',
  username: '',
  role: '' as number | '', // contiendra l'id_role choisi
  password: '',
  confirmPassword: '',
  agreedToTerms: false
})

// Liste des rôles lue depuis la table "roles"
const roles = ref<Role[]>([])
const rolesLoading = ref(true)

// États pour l'interface utilisateur
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const snapshot = await get(dbRef(database, 'roles'))
    if (snapshot.exists()) {
      // Firebase renvoie un tableau (clés 0, 1, 2...)
      roles.value = (Object.values(snapshot.val()) as Role[]).filter(Boolean)
    }
  } catch (error) {
    console.error('Impossible de charger les rôles :', error)
    errorMessage.value = 'Impossible de charger la liste des rôles.'
  } finally {
    rolesLoading.value = false
  }
})

const handleRegister = async () => {
  // Réinitialisation des messages
  errorMessage.value = ''
  successMessage.value = ''

  // Validation Front-end
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match!'
    return
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  // Instance Firebase secondaire : createUserWithEmailAndPassword connecte
  // automatiquement le nouvel utilisateur sur l'instance utilisée. En passant par
  // une instance séparée, la session de l'admin (auth) n'est pas touchée.
  let secondaryApp: FirebaseApp | null = null

  try {
    isLoading.value = true

    secondaryApp = initializeApp(auth.app.options, `register-${Date.now()}`)
    const secondaryAuth = getAuth(secondaryApp)

    // 1. Création de l'utilisateur avec Email et Mot de passe (sur l'instance secondaire)
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password)
    const user = userCredential.user

    // 2. Mise à jour du profil Firebase pour y ajouter le "Username"
    await updateProfile(user, {
      displayName: form.username
    })

    const today = new Date().toLocaleDateString('en-CA')
    // 3. Enregistrement du profil dans la Realtime Database : profiles/{uid}
    //    (via `database` de l'instance principale, donc avec les droits de l'admin connecté)
    await set(dbRef(database, `profiles/${user.uid}`), {
      id_profile: user.uid,
      created_at: today,
      email: form.email,
      full_name: form.username,
      role: form.role,
      is_active: false
    })

    // 4. Déconnexion du nouvel utilisateur sur l'instance secondaire uniquement
    await signOut(secondaryAuth)

    // Succès !
    successMessage.value = 'Compte créé avec succès !'
    
    // Vider le formulaire après succès
    form.email = ''
    form.username = ''
    form.role = ''
    form.password = ''
    form.confirmPassword = ''
    form.agreedToTerms = false

  } catch (error: any) {
    console.error("Firebase Error:", error)
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage.value = 'This email is already associated with an account.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Please enter a valid email address.'
        break
      case 'auth/weak-password':
        errorMessage.value = 'The password is too weak. Please use a stronger password.'
        break
      default:
        errorMessage.value = 'An error occurred during registration. Please try again.'
    }
  } finally {
    if (secondaryApp) await deleteApp(secondaryApp)
    isLoading.value = false
  }
}
</script>