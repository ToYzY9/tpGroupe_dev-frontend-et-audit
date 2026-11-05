<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100 p-4 text-base-content">
    
    <div class="bg-base-200 p-8 sm:p-10 max-w-[450px] w-full rounded-box border border-base-300">
      
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-primary mb-2">Create an Account</h1>
        <p class="text-base-content/70 text-sm">Join us and get started today!</p>
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
          <label for="email" class="text-sm font-bold">Email</label>
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
          <label for="username" class="text-sm font-bold">Username</label>
          <input 
            id="username"
            v-model="form.username"
            type="text" 
            class="input w-full"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- Champ Password -->
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-bold">Password</label>
          <input 
            id="password"
            v-model="form.password"
            type="password" 
            class="input w-full"
            :disabled="isLoading"
            required
          />
          <p class="text-xs text-base-content/70 mt-0.5">
            8+ characters, with uppercase, lowercase, and numbers.
          </p>
        </div>

        <!-- Champ Confirm Password -->
        <div class="flex flex-col gap-1.5 pt-1">
          <label for="confirmPassword" class="text-sm font-bold">Confirm Password</label>
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
            class="btn btn-primary btn-block font-bold"
          >
            <!-- Spinner daisyUI qui s'affiche si isLoading est true -->
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            <span v-else>Sign Up</span>
          </button>
        </div>
      </form>

      <div class="mt-8 text-center text-sm text-base-content/80">
        Already have an account? 
        <a href="#" class="text-info hover:underline">Log in</a>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../services/firebase' // Chemin vers ton fichier firebase.ts

const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false
})

// États pour l'interface utilisateur
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

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

    // Succès !
    successMessage.value = 'Account created successfully!'
    
    // (Optionnel) Vider le formulaire après succès
    form.email = ''
    form.username = ''
    form.password = ''
    form.confirmPassword = ''
    form.agreedToTerms = false

    // Ici tu peux rediriger l'utilisateur, ex: router.push('/dashboard')

  } catch (error: any) {
    console.error("Firebase Error:", error)
    
    // Traduction des erreurs Firebase communes
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