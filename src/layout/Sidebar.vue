<template>

    <section class="flex flex-col gap-10 w-64  pl-6 pt-6 bg-base-200 border-r border-base-300 h-screen">
        <div>
            <h2 class="text-blue-800 text-xl font-bold">
                Abstract Support
            </h2>
            <p class="opacity-70 text-xs font-medium mt-0.5">Technical Operations</p>
        </div>


        <ul class="flex flex-col gap-2 -ml-6 w-full">
           <RouterLink to="/dashboard"> 
            <li @click="activeItem = 'dashboard'"
                :class="activeItem === 'dashboard' ? 'bg-blue-700/30 text-white font-semibold border-r-4 border-blue-700' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <LayoutGrid class="w-5 h-5" />
                <span>Dashboard</span>
                
            </li>
            </RouterLink>

            <RouterLink to="/page-ticket">
            <li @click="activeItem = 'ticket'"
                :class="activeItem === 'ticket' ? 'bg-blue-700/30 text-white font-semibold border-r-4 border-blue-700' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <Ticket class="w-5 h-5" />
                <span>Tickets</span>
            </li>
            </RouterLink>

            <RouterLink to="/analytics">
            <li @click="activeItem = 'analytics'"
                :class="activeItem === 'analytics' ? 'bg-blue-700/30 text-white font-semibold border-r-4 border-blue-700' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    
                <ChartNoAxesCombined class="w-5 h-5" />
                <span>Analytics</span>

            </li>
            </RouterLink>


            <li @click="activeItem = 'settings'"
                :class="activeItem === 'settings' ? 'bg-blue-700/30 text-white font-semibold border-r-4 border-blue-700' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <Settings class="w-5 h-5" />
                <span>Settings</span>
            </li>
        </ul>

        <div class="mt-auto">
            <hr class="border-t border-base-300 my-2 w-full" />
            <RouterLink to="/create-ticket">
            <button
                class="flex  items-center justify-center gap-2 w-full h-9 bg-blue-700 text-white text-sm font-semibold rounded-sm hover:bg-blue-800 active:scale-95 transition">
                <span class="text-xl font-light">+</span>
               Nouvel incident
            </button>
            </RouterLink>

            <ul class="flex flex-col gap-2 -ml-6 w-full">
                <li @click="activeItem = 'support'"
                    :class="activeItem === 'support' ? 'bg-blue-700/30 text-white font-semibold border-r-4 border-blue-700' : 'text-base-content/70 hover:bg-base-300'"
                    class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    <CircleHelp class="w-5 h-5" /> Support
                </li>
                <li @click="activeItem = 'logOut'"
                    :class="activeItem === 'logOut' ? 'bg-blue-700/30 text-white font-semibold border-r-4 border-blue-700' : 'text-base-content/70 hover:bg-base-300'"
                    class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    <Deconnexion></Deconnexion>
                </li>
            </ul>
        </div>
    </section>
</template>


<script setup lang="ts">
    import { LayoutGrid, Ticket, ChartNoAxesCombined, Settings, CircleHelp, LogOut } from 'lucide-vue-next'
    import { ref } from 'vue'
import Deconnexion from '../components/Deconnexion.vue';

    const activeItem = ref('dashboard')


</script>
