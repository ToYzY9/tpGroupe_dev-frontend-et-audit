import { defineStore } from 'pinia';
import { ref } from 'vue';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isInitialized = ref(false); // Permet de savoir si Firebase a fini de vérifier la session

  // Écoute en temps réel l'état de la connexion Firebase
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    isInitialized.value = true;
  });

  return { user, isInitialized };
});
