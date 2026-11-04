<template>
  <article class="bg-base-200 border border-base-300 rounded-box p-6">
    <h2 class="text-xl font-bold text-primary mb-4">Mes tickets par catégorie</h2>

    <ul class="flex flex-col gap-4">

      <li>
        <div class="flex justify-between text-sm mb-1.5">
          <span class="font-semibold">Accès</span>
          <span class="opacity-70">3 tickets</span>
        </div>
        <div class="h-2 w-full bg-base-100 rounded-full overflow-hidden">
          <div class="h-full w-[38%] bg-info rounded-full"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between text-sm mb-1.5">
          <span class="font-semibold">Matériel</span>
          <span class="opacity-70">2 tickets</span>
        </div>
        <div class="h-2 w-full bg-base-100 rounded-full overflow-hidden">
          <div class="h-full w-[25%] bg-info rounded-full"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between text-sm mb-1.5">
          <span class="font-semibold">Logiciel</span>
          <span class="opacity-70">2 tickets</span>
        </div>
        <div class="h-2 w-full bg-base-100 rounded-full overflow-hidden">
          <div class="h-full w-[25%] bg-info rounded-full"></div>
        </div>
      </li>

      <li>
        <div class="flex justify-between text-sm mb-1.5">
          <span class="font-semibold">Réseau</span>
          <span class="opacity-70">1 ticket</span>
        </div>
        <div class="h-2 w-full bg-base-100 rounded-full overflow-hidden">
          <div class="h-full w-[12%] bg-info rounded-full"></div>
        </div>
      </li>

    </ul>
  </article>
</template>
