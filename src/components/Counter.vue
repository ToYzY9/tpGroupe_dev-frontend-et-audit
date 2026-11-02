<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <section >
    <button type="button" class="counter btn bg-[#03C755] text-white border-[#00b544]" @click="count++">Count is {{ count }}</button>
  </section>
</template>