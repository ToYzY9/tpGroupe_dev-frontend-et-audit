 <script setup lang="ts">
  import Sidebar from '../components/Sidebar.vue';
  import Navbar from '../components/Navbar.vue';
  import Activity from '../components/Activity.vue';
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">

    <Sidebar></Sidebar>

     
    <div class="flex flex-col flex-1 h-full overflow-hidden">
      <Navbar></Navbar>
      
       
      <div class="flex flex-1 w-full overflow-hidden">
        
        <!--  Contenu principal -->
        <main class="flex-1 p-6 overflow-y-auto">
          <div class="w-full">DFZECE</div>
        </main>
        
         
        <aside class="w-80 border-l border-gray-200 bg-[#f9f9fe] p-6 h-full shrink-0 overflow-y-auto">
          <Activity></Activity>
        </aside>

      </div>  

    </div>

  </div>
</template>
