<script setup lang="ts">
import TicketPriorityBadge from '../tickets/TicketPriorityBadge.vue'
</script>

<template>
  <article class="bg-base-200 border border-base-300 rounded-box p-6">
    <h2 class="text-xl font-bold text-primary mb-4">À prendre en charge</h2>

    <ul class="flex flex-col divide-y divide-base-300">

      <li class="flex flex-col gap-2 py-3 first:pt-0">
        <p class="font-semibold">Installer le logiciel de retouche photo</p>
        <div class="flex items-center justify-between gap-2 text-sm">
          <TicketPriorityBadge priority="medium" />
          <button type="button" class="btn btn-primary btn-sm">Prendre</button>
        </div>
      </li>

      <li class="flex flex-col gap-2 py-3">
        <p class="font-semibold">Imprimante du 3e étage hors ligne</p>
        <div class="flex items-center justify-between gap-2 text-sm">
          <TicketPriorityBadge priority="high" />
          <button type="button" class="btn btn-primary btn-sm">Prendre</button>
        </div>
      </li>

      <li class="flex flex-col gap-2 pt-3">
        <p class="font-semibold">Création d'un compte pour un nouvel arrivant</p>
        <div class="flex items-center justify-between gap-2 text-sm">
          <TicketPriorityBadge priority="low" />
          <button type="button" class="btn btn-primary btn-sm">Prendre</button>
        </div>
      </li>

    </ul>
  </article>
</template>
