<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-[#1F2026] text-[#F4F4F6]">

    <div class="card w-full max-w-sm bg-[#2A2C33] border border-[#3D3F48] shadow-xl">
      <form class="card-body gap-5" @submit.prevent="login" novalidate>
        <h1 class="card-title justify-center text-2xl font-semibold text-[#F4F4F6]">
          Se connecter
        </h1>

        <!-- Email -->
        <fieldset class="fieldset">
          <label for="email" class="label font-semibold text-[#F4F4F6]">
            Adresse email <span class="text-[#F08BB2]" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="votre@email.com"
            autocomplete="email"
            class="input w-full min-h-11 rounded-lg bg-[#1F2026] text-[#F4F4F6]
                   border-[#7C7F8A] placeholder:text-[#A3A6AF]
                   focus:outline-2 focus:outline-offset-2 focus:outline-[#F4F4F6]"
            :class="{ '!border-[#F08BB2]': errorMessage }"
            :aria-invalid="!!errorMessage"
            v-model="email"
          />
        </fieldset>

        <!-- Mot de passe -->
        <fieldset class="fieldset">
          <label for="password" class="label font-semibold text-[#F4F4F6]">
            Mot de passe <span class="text-[#F08BB2]" aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            autocomplete="current-password"
            class="input w-full min-h-11 rounded-lg bg-[#1F2026] text-[#F4F4F6]
                   border-[#7C7F8A] placeholder:text-[#A3A6AF]
                   focus:outline-2 focus:outline-offset-2 focus:outline-[#F4F4F6]"
            :class="{ '!border-[#F08BB2]': errorMessage }"
            :aria-invalid="!!errorMessage"
            v-model="password"
          />
        </fieldset>

        <!-- Bouton principal (Rose 300, survol Rose 200) -->
        <button
          type="submit"
          class="btn w-full min-h-11 rounded-lg gap-2 font-semibold shadow-none
                 bg-[#E0789F] border-[#E0789F] text-[#1F2026]
                 hover:bg-[#EC9BBA] hover:border-[#EC9BBA]
                 active:bg-[#EC9BBA] active:border-[#EC9BBA]
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F4F6]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="size-5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Se connecter
        </button>

        <!-- Message d'erreur (texte #F5A39B sur #451B19) -->
        <div
          v-if="errorMessage"
          role="alert"
          class="alert text-sm rounded-lg bg-[#451B19] border-[#451B19] text-[#F5A39B]"
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
import { useRouter } from "vue-router";
import { auth } from "../firebase";
import { useAuthStore } from "../stores/authStore"; // 1. Importer le store

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const authStore = useAuthStore(); // 2. Initialiser le store

async function login() {
  errorMessage.value = "";
  try {
     // Firebase va déclencher automatiquement le 'onAuthStateChanged' du store dès la réussite
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Utilisateur connecté :", authStore.user);
    console.log("Données brutes de l'utilisateur :", JSON.parse(JSON.stringify(authStore.user)));
    router.push({ name: "analytics" });
  } catch {
    errorMessage.value = "Erreur de connexion : login ou mot de passe invalide";
  }
}


</script>