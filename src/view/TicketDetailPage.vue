<template>
   <section v-if="ticket" class="flex flex-col gap-6">
    <header>
        <div class="flex  items-center gap-2">
                <router-link :to="{ name: 'tickets' }" class="hover:text-secondary-content">Mes tickets assignés ></router-link>
                 <p> Ticket #{{ ticket.id }}</p>
            </div>
         
        <h1 class="text-3xl font-bold">Détails du ticket</h1>

    </header>
   </section>
   <p v-else>Ticket introuvable.</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Ticket } from '../components/types/ticket'
import { getTickets } from '../components/services/tickets.api.js'

const route = useRoute()
const ticket = ref<Ticket | undefined>()

onMounted(async () => {
  const tickets = await getTickets()
  ticket.value = tickets.find((t) => t.id === Number(route.params.id))
})
</script>
