<template>
  <div class="relative w-full" ref="containerRef">
    <form @submit.prevent="handleSubmit" class="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-600 bg-white">
      <select 
        v-if="!isMobile" 
        v-model="selectedCategory" 
        class="bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2.5 border-r border-slate-300 outline-none cursor-pointer max-w-[170px] truncate"
      >
        <option value="All">All Categories</option>
        <option value="Textiles, Fabrics & Garments">Textiles & Garments</option>
        <option value="Industrial Machinery & Equipment">Industrial Machinery</option>
        <option value="Electrical, Motors & Solar">Electrical & Solar</option>
        <option value="Packaging & Material Handling">Packaging</option>
        <option value="Chemical & Pharma Processing">Chemical & Pharma</option>
        <option value="Construction & Building Hardware">Construction</option>
      </select>

      <div class="relative flex-1 flex items-center">
        <input
          type="text"
          v-model="query"
          @focus="isOpen = true"
          @input="isOpen = true"
          @keydown="handleKeyDown"
          :placeholder="placeholderText"
          class="w-full px-3 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          v-if="query"
          type="button"
          @click="query = ''"
          class="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full"
        >
          ✕
        </button>
      </div>

      <button
        type="submit"
        class="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <span>Search</span>
      </button>
    </form>

    <!-- Autocomplete Suggestions Dropdown -->
    <div 
      v-if="isOpen" 
      class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 max-h-[460px] overflow-y-auto"
    >
      <!-- Matching Products Section -->
      <div class="p-3">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-2 flex items-center justify-between">
          <span>{{ query.trim() ? 'Product Suggestions' : 'Trending in Cloths & Industry' }}</span>
          <span v-if="query.trim()" class="text-[10px] text-teal-700 font-mono font-medium">
            {{ matchingProducts.length }} results
          </span>
        </div>

        <div v-if="matchingProducts.length === 0" class="py-3 text-center text-xs text-slate-500">
          No direct product matches found for "{{ query }}".
        </div>

        <div v-else class="space-y-1">
          <div
            v-for="(product, idx) in matchingProducts"
            :key="product.id"
            @click="selectProduct(product)"
            class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 text-slate-800"
          >
            <div class="w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-slate-900 truncate flex items-center gap-1.5">
                <span class="truncate">{{ product.name }}</span>
                <span v-if="product.category.includes('Textile')" class="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                  Cloth
                </span>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span class="truncate">{{ product.manufacturerName }}</span>
                <span>·</span>
                <span class="font-mono text-slate-600">MOQ: {{ product.moq }} {{ product.unit }}s</span>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="text-xs font-bold text-teal-900 font-mono">
                ₹{{ Number(product.basePrice).toLocaleString('en-IN') }}
              </div>
              <div class="text-[10px] text-slate-400">/ {{ product.unit }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Cloth Searches -->
      <div class="p-3 bg-slate-50">
        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-2">
          Trending Textile Searches
        </div>
        <div class="flex flex-wrap gap-1.5 px-2">
          <button
            v-for="(item, i) in trendingSearches"
            :key="i"
            @click="selectQuery(item)"
            class="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs text-slate-700 hover:border-teal-600 hover:text-teal-900 transition-colors cursor-pointer"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  initialQuery: { type: String, default: '' },
  isMobile: { type: Boolean, default: false },
  productsData: { type: Array, default: () => [] }
});

const query = ref(props.initialQuery);
const selectedCategory = ref('All');
const isOpen = ref(false);
const containerRef = ref(null);

const placeholderText = computed(() => 
  props.isMobile 
    ? 'Search cotton fabrics, sarees, machinery...' 
    : 'Search fabrics, cotton yarn, sarees, T-shirts, machinery...'
);

const trendingSearches = [
  'Cotton Jersey Fabric 180 GSM',
  'Surat Banarasi Silk Sarees',
  'Indigo Denim Twill 12.5 Oz',
  'Jaipur Block Print Cambric',
  "Men's Combed Cotton T-Shirts",
  'Anarkali Rayon Kurti Set',
  '30s Combed Cotton Weaving Yarn'
];

const matchingProducts = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) {
    return props.productsData.slice(0, 4);
  }
  return props.productsData.filter(p => {
    return p.name.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q) ||
           p.manufacturerName.toLowerCase().includes(q);
  }).slice(0, 5);
});

const selectProduct = (product) => {
  window.location.href = `/products/${product.slug || product.id}`;
};

const selectQuery = (term) => {
  query.value = term;
  window.location.href = `/products?search=${encodeURIComponent(term)}`;
};

const handleSubmit = () => {
  const params = new URLSearchParams();
  if (query.value) params.set('search', query.value);
  if (selectedCategory.value !== 'All') params.set('category', selectedCategory.value);
  window.location.href = `/products?${params.toString()}`;
};

const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
