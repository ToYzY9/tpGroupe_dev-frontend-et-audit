<script setup lang="ts">
import { Timer, TrendingUp } from 'lucide-vue-next'
</script>

<template>
  <article class="flex flex-col gap-3 bg-base-200 border border-base-300 rounded-box p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-[11px] font-medium text-blue-500">Temps Moyen de Résolution</h2>
      <Timer class="w-4 h-4 text-blue-500" />
    </header>

    <p class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-blue-500">42m</span>
      <span class="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-500">
        <TrendingUp class="w-3 h-3" />
        +5%
      </span>
    </p>

    <div class="h-1 w-full bg-base-300 rounded-full overflow-hidden">
      <div class="h-full w-[70%] bg-blue-700 rounded-full"></div>
    </div>
  </article>
</template>
