<script setup lang="ts">
import { Ticket } from 'lucide-vue-next'
</script>

<template>
  <article class="flex flex-col gap-3 bg-base-200 border border-base-300 rounded-box p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-label font-medium text-info">Tickets Ouverts</h2>
      <Ticket class="w-4 h-4 text-info" />
    </header>

    <p class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-info">124</span>
      <span class="text-mini font-semibold opacity-70">vs 156 hier</span>
    </p>

    <p class="text-mini font-semibold text-info">Diminution de 20%</p>
  </article>
</template>
