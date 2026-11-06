<template>
     
    <section class="w-full px-6 py-3 flex bg-base-200 border-b border-base-300 h-16 items-center justify-between">
        
        
        <div class="relative w-full max-w-xl">
            <span class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none">
                <Search class="w-4 h-4 opacity-70"/>
            </span>
            <input 
                type="text" 
                placeholder="Rechercher un ticket, un utilisateur..." 
                class="input w-full pl-9"
            />
        </div>
        
        
        <div class="flex items-center gap-6"> 
            
            <!-- Icônes de notifications et historique -->
            <div class="flex items-center gap-4 text-base-content/70">
                <button class="relative hover:text-info transition-colors">
                    <Bell :size="20" />
                    <!-- Point rouge de notification ajusté pour être bien centré en haut à droite -->
                    <span class="absolute top-0.5 right-0.5 w-2 h-2 bg-error rounded-full ring-2 ring-base-200"></span>
                </button>
                <button class="hover:text-info transition-colors">
                    <History :size="20" />
                </button>
            </div>
            
             
            <hr class="border-t-0 border-l border-base-300 h-6 w-px mx-1 inline-block" />
            
            <!-- Profil Utilisateur -->
            <div class="flex items-center gap-3">
                 
                <div class="flex flex-col text-right">
                    <p class="text-info text-xs font-semibold">{{ userName }}</p>
                    <p class="opacity-70 text-mini mt-0.5">Technicien Senior L2</p>
                </div>
                 
                <div class="h-9 w-9 rounded-box bg-secondary flex items-center justify-center text-secondary-content text-xs overflow-hidden">
                     
                    <span class="opacity-80">MD</span>
                </div>
            </div>
            
        </div>
    </section>
</template>

<script setup lang="ts">

    import { Search, Bell, History } from 'lucide-vue-next'
import { useAuthStore } from "../stores/authStore";
import { computed } from 'vue';
const authStore = useAuthStore(); // Accès aux données globales du user
  
 const userName= computed(()=> authStore.user?.displayName ?? authStore.user?.email ?? '')
</script>
