<script setup lang="ts">
import { Ticket } from 'lucide-vue-next'
</script>

<template>
  <article class="flex flex-col gap-3 bg-white border border-gray-200 rounded-lg p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-[11px] font-medium text-gray-500">Tickets Ouverts</h2>
      <Ticket class="w-4 h-4 text-blue-700" />
    </header>

    <p class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-blue-700">124</span>
      <span class="text-[10px] font-semibold text-gray-700">vs 156 hier</span>
    </p>

    <p class="text-[10px] font-semibold text-blue-700">Diminution de 20%</p>
  </article>
</template>
