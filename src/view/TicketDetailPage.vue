<template>
  <section v-if="ticket" class="flex flex-col gap-6">
    <header>
      <div class="flex items-center gap-2">
        <router-link
          :to="{ name: 'tickets' }"
          class="hover:text-secondary-content"
          >Mes tickets assignés ></router-link
        >
        <p>Ticket #{{ ticket.id }}</p>
      </div>
      <div class="flex items-center gap-2 p-4 bg-base-200 rounded-lg">
        <p class="text-sm text-muted-foreground">
          Ticket #{{ ticket.id }}
        </p>
        <p>- {{ ticket.category }}</p>
        <ticket-status-badge :status="ticket.status" />
        <ticket-priority-badge :priority="ticket.priority" />
      </div>

      <h1 class="text-3xl font-bold">{{ ticket.title }}</h1>
    </header>
  </section>
  <p v-else>Ticket introuvable.</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import type { Ticket } from "../components/types/ticket";
import { getTickets } from "../components/services/tickets.api.js";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge.vue";
import TicketPriorityBadge from "../components/tickets/TicketPriorityBadge.vue";

const route = useRoute();
const ticket = ref<Ticket | undefined>();

onMounted(async () => {
  const tickets = await getTickets()
  ticket.value = tickets.find((t) => t.id === Number(route.params.id))
})
</script>
