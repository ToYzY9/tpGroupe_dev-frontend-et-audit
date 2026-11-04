<script setup lang="ts">
import { Ticket } from 'lucide-vue-next'
</script>

<template>
  <article class="flex flex-col gap-3 bg-base-200 border border-base-300 rounded-box p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-[11px] font-medium text-blue-500">Tickets Ouverts</h2>
      <Ticket class="w-4 h-4 text-blue-500" />
    </header>

    <p class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-blue-500">124</span>
      <span class="text-[10px] font-semibold opacity-70">vs 156 hier</span>
    </p>

    <p class="text-[10px] font-semibold text-blue-500">Diminution de 20%</p>
  </article>
</template>
