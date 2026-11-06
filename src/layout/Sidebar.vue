<template>

    <section class="flex flex-col gap-10 w-64 pt-6 bg-base-200 border-r border-base-300 h-screen">
        <div class="px-6">
            <h2 class="text-primary text-xl font-bold">
                Abstract Support
            </h2>
            <p class="opacity-70 text-xs font-medium mt-0.5">Technical Operations</p>
        </div>


        <ul class="flex flex-col gap-2 w-full">
           <RouterLink to="/dashboard">
            <li @click="activeItem = 'dashboard'"
                :class="activeItem === 'dashboard' ? 'bg-primary/30 text-primary-content font-semibold border-r-4 border-primary' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <LayoutGrid class="w-5 h-5" />
                <span>Dashboard</span>
                
            </li>
            </RouterLink>

            <RouterLink to="/page-ticket">
            <li @click="activeItem = 'ticket'"
                :class="activeItem === 'ticket' ? 'bg-primary/30 text-primary-content font-semibold border-r-4 border-primary' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <Ticket class="w-5 h-5" />
                <span>Tickets</span>
            </li>
            </RouterLink>

            <RouterLink to="/analytics">
            <li @click="activeItem = 'analytics'"
                :class="activeItem === 'analytics' ? 'bg-primary/30 text-primary-content font-semibold border-r-4 border-primary' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    
                <ChartNoAxesCombined class="w-5 h-5" />
                <span>Analytics</span>

            </li>
            </RouterLink>


            <li @click="activeItem = 'settings'"
                :class="activeItem === 'settings' ? 'bg-primary/30 text-primary-content font-semibold border-r-4 border-primary' : 'text-base-content/70 hover:bg-base-300'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <Settings class="w-5 h-5" />
                <span>Settings</span>
            </li>
        </ul>

        <div class="mt-auto">
            <hr class="border-t border-base-300 mb-4 w-full" />
            <RouterLink to="/create-ticket" class="block px-6">
            <button
                class="btn btn-primary w-full">
                <span class="text-xl font-light">+</span>
               Nouvel incident
            </button>
            </RouterLink>

            <ul class="flex flex-col gap-2 mt-2 w-full">
                <RouterLink to="/register">
                <li @click="activeItem = 'createAccount'"
                    :class="activeItem === 'createAccount' ? 'bg-primary/30 text-primary-content font-semibold border-r-4 border-primary' : 'text-base-content/70 hover:bg-base-300'"
                    class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    <UserPlus  class="w-5 h-5" /> Create account
                </li>
                </RouterLink>
                <li @click="activeItem = 'logOut'"
                    :class="activeItem === 'logOut' ? 'bg-primary/30 text-primary-content font-semibold border-r-4 border-primary' : 'text-base-content/70 hover:bg-base-300'"
                    class="flex gap-3 items-center   cursor-pointer transition-colors">
                    <Deconnexion></Deconnexion>
                </li>
            </ul>
        </div>
    </section>
</template>


<script setup lang="ts">
    import { LayoutGrid, Ticket, ChartNoAxesCombined, Settings, UserPlus } from 'lucide-vue-next'
    import { ref } from 'vue'
import Deconnexion from '../components/Deconnexion.vue';

    const activeItem = ref('dashboard')


</script>
