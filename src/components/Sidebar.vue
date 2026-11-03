<template>

    <section class="flex flex-col gap-10 w-64  pl-6 pt-6 border-r border-gray-100 h-screen">
        <div>
            <h2 class="text-blue-800 text-xl font-bold">
                Abstract Support
            </h2>
            <p class="text-gray-400 text-xs font-medium mt-0.5">Technical Operations</p>
        </div>


        <ul class="flex flex-col gap-2 -ml-6 w-full">

            <li @click="activeItem = 'dashboard'"
                :class="activeItem === 'dashboard' ? 'bg-indigo-50 text-indigo-900 font-semibold border-r-4 border-emerald-800' : 'text-gray-500 hover:bg-gray-50'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <LayoutGrid class="w-5 h-5" />
                <span>Dashboard</span>
            </li>

            
            <li @click="activeItem = 'ticket'"
                :class="activeItem === 'ticket' ? 'bg-indigo-50 text-indigo-900 font-semibold border-r-4 border-emerald-800' : 'text-gray-500 hover:bg-gray-50'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <Ticket class="w-5 h-5" />
                <span>Tickets</span>
            </li>


            <li @click="activeItem = 'analytics'"
                :class="activeItem === 'analytics' ? 'bg-indigo-50 text-indigo-900 font-semibold border-r-4 border-emerald-800' : 'text-gray-500 hover:bg-gray-50'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    
                <ChartNoAxesCombined class="w-5 h-5" />
                <span>Analytics</span>

            </li>


            <li @click="activeItem = 'settings'"
                :class="activeItem === 'settings' ? 'bg-indigo-50 text-indigo-900 font-semibold border-r-4 border-emerald-800' : 'text-gray-500 hover:bg-gray-50'"
                class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                <Settings class="w-5 h-5" />
                <span>Settings</span>
            </li>
        </ul>

        <div class="mt-auto">
            <hr class="border-t border-gray-300 my-2 w-full" />

            <button
                class="flex  items-center justify-center gap-2 w-full h-9 bg-blue-700 text-white text-sm font-semibold rounded-sm hover:bg-blue-800 active:scale-95 transition">
                <span class="text-xl font-light">+</span>
                New Incident
            </button>

            <ul class="flex flex-col gap-2 -ml-6 w-full">
                <li @click="activeItem = 'support'"
                    :class="activeItem === 'support' ? 'bg-indigo-50 text-indigo-900 font-semibold border-r-4 border-emerald-800' : 'text-gray-500 hover:bg-gray-50'"
                    class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    <CircleHelp class="w-5 h-5" /> Support
                </li>
                <li @click="activeItem = 'logOut'"
                    :class="activeItem === 'logOut' ? 'bg-indigo-50 text-indigo-900 font-semibold border-r-4 border-emerald-800' : 'text-gray-500 hover:bg-gray-50'"
                    class="flex gap-3 items-center h-12 pl-6 pr-4 w-full cursor-pointer transition-colors">
                    <LogOut class="w-5 h-5" /><span>Log out</span>
                </li>
            </ul>
        </div>
    </section>
</template>


<script setup lang="ts">
    import { LayoutGrid, Ticket, ChartNoAxesCombined, Settings, CircleHelp, LogOut } from 'lucide-vue-next'
    import { ref } from 'vue'

    const activeItem = ref('dashboard')


</script>
