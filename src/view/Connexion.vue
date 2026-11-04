<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-base-100 text-base-content">

    <div class="card w-full max-w-sm bg-base-200 border border-base-300 shadow-xl">
      <form class="card-body gap-5" @submit.prevent="login" novalidate>
        <h1 class="card-title justify-center text-2xl font-semibold text-primary">
          Se connecter
        </h1>

        <!-- Email -->
        <fieldset class="fieldset">
          <label for="email" class="label font-semibold text-base-content">
            Adresse email <span class="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="votre@email.com"
            autocomplete="email"
            class="input w-full bg-base-100 text-base-content
                   border-base-content/40 placeholder:text-base-content/60
                   focus:outline-2 focus:outline-offset-2 focus:outline-base-content"
            :class="{ '!border-error': errorMessage }"
            :aria-invalid="!!errorMessage"
            v-model="email"
          />
        </fieldset>

        <!-- Mot de passe -->
        <fieldset class="fieldset">
          <label for="password" class="label font-semibold text-base-content">
            Mot de passe <span class="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            autocomplete="current-password"
            class="input w-full bg-base-100 text-base-content
                   border-base-content/40 placeholder:text-base-content/60
                   focus:outline-2 focus:outline-offset-2 focus:outline-base-content"
            :class="{ '!border-error': errorMessage }"
            :aria-invalid="!!errorMessage"
            v-model="password"
          />
        </fieldset>

        <!-- Bouton principal -->
        <button
          type="submit"
          class="btn btn-primary w-full gap-2 font-semibold shadow-none
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="size-5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Se connecter
        </button>

        <!-- Message d'erreur -->
        <div
          v-if="errorMessage"
          role="alert"
          class="alert alert-error alert-soft text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "vue-router";
import { auth } from "../services/firebase";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email ou mot de passe incorrect.";
      case "auth/network-request-failed":
        return "Problème de connexion réseau.";
    }
  }
  return "Une erreur est survenue. Veuillez réessayer.";
}

async function login() {
  errorMessage.value = "";
  if (!email.value || !password.value) {
    errorMessage.value = "Veuillez renseigner votre email et votre mot de passe.";
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push({ name: "dashboard" });
  } catch (error){
    errorMessage.value = getErrorMessage(error);
  }
}


</script>