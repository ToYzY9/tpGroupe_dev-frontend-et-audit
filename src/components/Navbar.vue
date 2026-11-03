<template>
     
    <section class="w-full px-6 py-3 flex bg-[#f9f9fe] border-b border-gray-100 h-16 items-center justify-between">
        
        
        <div class="relative w-full max-w-xl">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search class="w-4 h-4 text-gray-400"/>
            </span>
            <input 
                type="text" 
                placeholder="Rechercher un ticket, un utilisateur..." 
                class="w-full pl-9 pr-4 py-1.5 bg-white text-sm text-gray-700 placeholder-gray-400 border border-indigo-100 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
        </div>
        
        
        <div class="flex items-center gap-6"> 
            
            <!-- Icônes de notifications et historique -->
            <div class="flex items-center gap-4 text-gray-500">
                <button class="relative hover:text-indigo-600 transition-colors">
                    <Bell :size="20" />
                    <!-- Point rouge de notification ajusté pour être bien centré en haut à droite -->
                    <span class="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                <button class="hover:text-indigo-600 transition-colors">
                    <History :size="20" />
                </button>
            </div>
            
             
            <hr class="border-t-0 border-l border-gray-300 h-6 w-px mx-1 inline-block" />
            
            <!-- Profil Utilisateur -->
            <div class="flex items-center gap-3">
                 
                <div class="flex flex-col text-right">
                    <p class="text-blue-600 text-xs font-semibold">Marc Dupont</p>
                    <p class="text-gray-400 text-[10px] mt-0.5">Technicien Senior L2</p>
                </div>
                 
                <div class="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs overflow-hidden">
                     
                    <span class="opacity-80">MD</span>
                </div>
            </div>
            
        </div>
    </section>
</template>

<script setup lang="ts">

    import { Search, Bell, History } from 'lucide-vue-next'


</script>
