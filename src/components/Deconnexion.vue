<template>
  <button 
    @click="logout" 
    class="flex gap-3 items-center text-red-500 transition-colors"
    :disabled="isLoading"
  >
    <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
    <template v-else>
      <LogOut  class="w-5 h-5" />
      Déconnexion
    </template>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {   signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'vue-router';
import { auth } from '../services/firebase';
import {LogOut} from 'lucide-vue-next'
// const router = useRouter();
const isLoading = ref<boolean>(false);

async function logout(): Promise<void> {
  isLoading.value = true;
  
  signOut(auth)
    .then(() => {
      window.location.href = '/connexion';
    })
    .catch((error: unknown) => {
      if (error instanceof FirebaseError) {
        console.error('Erreur Firebase de déconnexion :', error.message);
      } else {
        console.error('Erreur inconnue :', error);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}

</script>