import { defineStore } from 'pinia';
import { ref } from 'vue';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isInitialized = ref(false);

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    isInitialized.value = true;
  });

  return { user, isInitialized };
});
