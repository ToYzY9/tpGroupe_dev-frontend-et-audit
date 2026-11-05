<template>
  <article class="bg-base-200 border border-base-300 rounded-box p-6">
    <h2 class="text-xl font-bold text-primary mb-4">Derniers commentaires</h2>

    <ul class="flex flex-col gap-4">

      <li class="flex gap-3">
        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-content text-xs shrink-0">SK</span>
        <div>
          <p class="text-sm"><strong>Sarah Koné</strong> sur <RouterLink to="/tickets/148" class="text-info hover:underline">#148</RouterLink></p>
          <p class="text-sm opacity-70">Le VPN refuse toujours la connexion après la mise à jour du client.</p>
          <p class="text-xs opacity-70 mt-1">Il y a 35 min</p>
        </div>
      </li>

      <li class="flex gap-3">
        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-content text-xs shrink-0">JP</span>
        <div>
          <p class="text-sm"><strong>Jean Petit</strong> sur <RouterLink to="/tickets/145" class="text-info hover:underline">#145</RouterLink></p>
          <p class="text-sm opacity-70">Le câble a été remplacé, l'écran clignote encore par moments.</p>
          <p class="text-xs opacity-70 mt-1">Il y a 3 h</p>
        </div>
      </li>

      <li class="flex gap-3">
        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-content text-xs shrink-0">AB</span>
        <div>
          <p class="text-sm"><strong>Amine Benali</strong> sur <RouterLink to="/tickets/139" class="text-info hover:underline">#139</RouterLink></p>
          <p class="text-sm opacity-70">Mot de passe réinitialisé, en attente de confirmation de l'utilisateur.</p>
          <p class="text-xs opacity-70 mt-1">Hier</p>
        </div>
      </li>

    </ul>
  </article>
</template>
