<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100 p-4 font-sans text-base-content">
    
    <div class="bg-base-200 sm:p-10 max-w-[450px] w-full rounded-lg border border-base-300">
      
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-primary mb-2">Create an Account</h1>
      </div>

      <!-- Messages d'Alerte (Erreur ou Succès) -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-error/10 text-error text-sm rounded-md border border-error/30">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 p-3 bg-success/10 text-success text-sm rounded-md border border-success/30">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Champ Email -->
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-[15px] font-bold">Email</label>
          <input 
            id="email"
            v-model="form.email"
            type="email" 
            class="input w-full rounded-md h-11 text-sm"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- Champ Username -->
        <div class="flex flex-col gap-1.5">
          <label for="username" class="text-[15px] font-bold">Username</label>
          <input 
            id="username"
            v-model="form.username"
            type="text" 
            class="input w-full rounded-md h-11 text-sm"
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
          <label for="password" class="text-[15px] font-bold">Password</label>
          <input 
            id="password"
            v-model="form.password"
            type="password" 
            class="input w-full rounded-md h-11 text-sm"
            :disabled="isLoading"
            required
          />
          <p class="text-xs text-base-content/70 mt-0.5">
            8+ characters, with uppercase, lowercase, and numbers.
          </p>
        </div>

        <!-- Champ Confirm Password -->
        <div class="flex flex-col gap-1.5 pt-1">
          <label for="confirmPassword" class="text-[15px] font-bold">Confirm Password</label>
          <input 
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password" 
            class="input w-full rounded-md h-11 text-sm"
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
            class="checkbox checkbox-primary checkbox-sm rounded mt-0.5 disabled:opacity-50" 
            :disabled="isLoading"
            required
          />
          <label for="terms" class="text-sm text-base-content/80 leading-tight">
            I agree to the 
            <a href="#" class="text-info hover:underline">Terms of Service</a> 
            and 
            <a href="#" class="text-info hover:underline">Privacy Policy</a>.
          </label>
        </div>

        <!-- Bouton Sign Up -->
        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="btn btn-primary btn-block disabled:opacity-70 font-bold text-base normal-case rounded-md h-12 min-h-12 shadow-sm"
          >
            <!-- Spinner daisyUI qui s'affiche si isLoading est true -->
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            <span v-else>Sign Up</span>
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
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

  try {
    isLoading.value = true

    // 1. Création de l'utilisateur avec Email et Mot de passe
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
    const user = userCredential.user

    // 2. Mise à jour du profil Firebase pour y ajouter le "Username"
    await updateProfile(user, {
      displayName: form.username
    })

    // 3. Enregistrement du profil dans la Realtime Database : profiles/{uid}
    await set(dbRef(database, `profiles/${user.uid}`), {
      id_profile: user.uid,
      created_at: serverTimestamp(),
      email: form.email,
      full_name: form.username,
      role: form.role,
      is_active: false
    })

    // Succès !
    successMessage.value = 'Account created successfully!'
    
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
    isLoading.value = false
  }
}
</script>