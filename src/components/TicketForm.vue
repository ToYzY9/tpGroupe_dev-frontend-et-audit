<template>
  <div class="bg-[#1e1f2e] border border-gray-700/60 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
    
    <div class="p-6 border-b border-gray-700/60">
      <h2 class="text-2xl font-bold text-white mb-2">Déclarer un incident</h2>
      <p class="text-sm text-gray-400">
        Décrivez le problème : un technicien prendra le ticket en charge. Les champs marqués * sont obligatoires.
      </p>
    </div>

    <div class="p-6">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-white">Titre de l'incident *</label>
          <input 
            v-model="form.title" 
            type="text" 
            placeholder="Ex. : impossible de me connecter au VPN" 
            class="w-full bg-[#14151f] border border-gray-600 text-white placeholder-gray-500 rounded-md px-4 py-2 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" 
            maxlength="100"
            required
          />
          <span class="text-xs text-gray-400">Entre 1 et 100 caractères.</span>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          
          <div class="flex flex-col gap-2 w-full md:w-1/2">
            <label class="text-sm font-semibold text-white">Catégorie *</label>
            <select 
              v-model="form.category" 
              class="w-full bg-[#14151f] border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors appearance-none"
              required
            >
              <option disabled value="">Choisir une catégorie</option>
              <option value="materiel">Matériel</option>
              <option value="logiciel">Logiciel</option>
              <option value="reseau">Réseau</option>
              <option value="acces">Accès / Compte</option>
            </select>
          </div>

          <div class="flex flex-col gap-2 w-full md:w-1/2">
            <label class="text-sm font-semibold text-white">Priorité *</label>
            <div class="flex flex-wrap gap-3 items-center">
              <label 
                v-for="p in priorities" 
                :key="p"
                class="flex items-center gap-2 px-4 py-1.5 rounded-full border cursor-pointer transition-all duration-200"
                :class="[
                  form.priority === p 
                    ? 'border-pink-500 bg-pink-500/10 text-pink-400' 
                    : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-800'
                ]"
              >
                <input 
                  type="radio" 
                  v-model="form.priority" 
                  :value="p" 
                  class="hidden" 
                  required
                />
                <span 
                  class="w-2.5 h-2.5 rounded-full"
                  :class="form.priority === p ? 'bg-pink-500' : 'bg-gray-500'"
                ></span>
                <span class="text-sm font-medium">{{ p }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-white">Description détaillée *</label>
          <textarea 
            v-model="form.description" 
            placeholder="Ce qui se passe, depuis quand, le message d'erreur affiché, le numéro du poste concerné..." 
            class="w-full bg-[#14151f] border border-gray-600 text-white placeholder-gray-500 rounded-md px-4 py-3 h-32 resize-none focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors" 
            maxlength="2000"
            required
          ></textarea>
          <div class="flex justify-between items-center text-xs text-gray-400 mt-1">
            <span>Au moins 1 caractère.</span>
            <span>{{ form.description.length }} / 2000</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-700/60">
          <button 
            type="button" 
            class="px-6 py-2 rounded-md border border-gray-600 text-white font-medium hover:bg-gray-800 transition-colors" 
            @click="emit('cancel')"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="px-6 py-2 rounded-md bg-[#ec4899] hover:bg-[#db2777] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            :disabled="!isValid"
          >
            Envoyer le ticket
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

export type TicketPriority = 'Basse' | 'Moyenne' | 'Haute' | 'Critique'

export interface TicketFormData {
  title: string
  category: string
  priority: TicketPriority
  description: string
}

const emit = defineEmits<{
  (e: 'submit-ticket', data: TicketFormData): void
  (e: 'cancel'): void
}>()

const form = reactive<TicketFormData>({
  title: '',
  category: '',
  priority: 'Moyenne',
  description: ''
})

const priorities: TicketPriority[] = ['Basse', 'Moyenne', 'Haute', 'Critique']

const isValid = computed(() =>
  form.title.trim().length >= 1 &&
  form.category !== '' &&
  form.description.trim().length >= 1
)

const handleSubmit = () => {
  if (isValid.value) {
    emit('submit-ticket', {
      ...form,
      title: form.title.trim(),
      description: form.description.trim()
    })
  }
}
</script>