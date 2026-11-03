<script setup lang="ts">
import { ShieldCheck, CircleCheck } from 'lucide-vue-next'
</script>

<template>
  <article class="flex flex-col gap-3 bg-white border border-gray-200 rounded-lg p-4">
    <header class="flex items-center justify-between">
      <h2 class="text-[11px] font-medium text-gray-500">SLA Compliance</h2>
      <ShieldCheck class="w-4 h-4 text-blue-700" />
    </header>

    <p class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-blue-700">98.2%</span>
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600">
        <CircleCheck class="w-3 h-3" />
        Cible atteinte
      </span>
    </p>

    <div class="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
      <div class="h-full w-[98%] bg-blue-700 rounded-full"></div>
    </div>
  </article>
</template>
