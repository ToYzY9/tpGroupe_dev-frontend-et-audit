<template>
  <div class="page flex flex-col items-center gap-6 w-96 mx-auto">

    <div class="card card-surface w-full">
      <h1 class="titre text-center pt-5">Se Connecter</h1>

      <form class="card-body gap-4" @submit.prevent="login" novalidate>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text libelle">Adresse Email</span>
          </div>
          <input
            type="email"
            placeholder="votre@email.com"
            class="input input-bordered w-full champ"
            :class="{ 'champ-erreur': errorMessage }"
            :aria-invalid="!!errorMessage"
            v-model="email"
          />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text libelle">Mot de passe</span>
          </div>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            class="input input-bordered w-full champ"
            :class="{ 'champ-erreur': errorMessage }"
            :aria-invalid="!!errorMessage"
            v-model="password"
          />
        </label>

        <button type="submit" class="btn btn-primary btn-action w-full gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Se connecter
        </button>

         <!-- Error message -->
        <div v-if="errorMessage" role="alert" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

async function login() {
  errorMessage.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push({ name: "dashbord" });
  } catch {
    errorMessage.value = "Erreur de connexion : login ou mot de passe invalide";
  }
}
</script>

<style scoped lang="css">
.page {
  height: 100vh;
  justify-content: center;
  max-width: 100%;
}
</style>