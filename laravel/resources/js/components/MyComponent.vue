<template>
  <div class="p-6 bg-teal-50 border-2 border-teal-500 rounded-xl my-4 text-slate-900 shadow-sm">
    <div class="flex items-center gap-2 text-teal-800 font-bold text-sm uppercase tracking-wide">
      <span class="w-3 h-3 rounded-full bg-teal-600"></span>
      <span>Yeh component Vue 3 (resources/js/components/MyComponent.vue) se render ho raha hai!</span>
    </div>

    <p class="text-xs text-slate-700 mt-2 leading-relaxed">
      Aapka Laravel Blade template server-side HTML render karta hai, aur Vite ke zariye Vue 3 component 
      <code class="bg-white px-2 py-0.5 rounded border border-teal-300 font-mono text-teal-900">&lt;my-component&gt;&lt;/my-component&gt;</code> 
      ke taur par reactive ho jata hai.
    </p>

    <!-- Reactive Counter Demo -->
    <div class="mt-4 pt-3 border-t border-teal-200 flex flex-wrap items-center gap-4">
      <div class="text-xs font-semibold text-slate-800">
        Vue 3 Reactive State Counter: <span class="text-base font-mono font-bold text-teal-900">{{ count }}</span>
      </div>
      <button 
        @click="count++" 
        class="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
      >
        Click to Increment (+1)
      </button>
      <button 
        @click="count = 0" 
        class="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs cursor-pointer"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>
