<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './layout/Navbar.vue';
import Sidebar from './layout/Sidebar.vue';
const route = useRoute();
const showLayout = computed(() => route.meta.layout === 'app');
</script>

<template>
  <div v-if="showLayout" class="flex h-screen w-full overflow-hidden">
    <Sidebar />
    <div class="flex flex-col flex-1 h-full overflow-hidden">
      <Navbar />
      <div class="flex flex-1 w-full overflow-hidden">
        <main class="flex-1 p-6 overflow-y-auto">
          <RouterView />
        </main>
      </div>
    </div>
  </div>

  <RouterView v-else />
</template>
