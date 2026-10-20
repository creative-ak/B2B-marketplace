<template>
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
    <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900">Quotation Comparison Matrix</h3>
        <p class="text-xs text-slate-500">Side-by-side factory quotation evaluation and price breakdown</p>
      </div>
      <span class="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
        {{ quotations.length }} Bids Received
      </span>
    </div>

    <div v-if="quotations.length === 0" class="p-8 text-center text-xs text-slate-500">
      No quotations submitted for this RFQ yet.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px]">
          <tr>
            <th class="p-3">Manufacturer</th>
            <th class="p-3">Quoted Unit Price</th>
            <th class="p-3">Quantity</th>
            <th class="p-3">GST & Tax</th>
            <th class="p-3">Delivery Lead Time</th>
            <th class="p-3">Grand Total</th>
            <th class="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="q in quotations" :key="q.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-3 font-semibold text-slate-900">
              <div>{{ q.manufacturerName }}</div>
              <div class="text-[10px] text-slate-400 font-normal">{{ q.manufacturerCity }}</div>
            </td>
            <td class="p-3 font-mono font-bold text-teal-900">
              ₹{{ Number(q.items[0]?.unit_price || 0).toLocaleString('en-IN') }}
            </td>
            <td class="p-3 font-mono">{{ q.items[0]?.quantity }}</td>
            <td class="p-3 text-slate-600 font-mono">₹{{ Number(q.tax_amount).toLocaleString('en-IN') }} ({{ q.tax_rate }}%)</td>
            <td class="p-3 text-slate-700">{{ q.delivery_timeline }}</td>
            <td class="p-3 font-mono font-extrabold text-sm text-slate-900">
              ₹{{ Number(q.grand_total).toLocaleString('en-IN') }}
            </td>
            <td class="p-3 text-right">
              <button
                v-if="q.status === 'sent'"
                @click="acceptQuote(q.id)"
                class="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold text-[11px] cursor-pointer"
              >
                Accept & Order
              </button>
              <span v-else class="text-[11px] font-semibold text-emerald-700 uppercase">
                {{ q.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quotations: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['accept']);

const acceptQuote = (quoteId) => {
  emit('accept', quoteId);
};
</script>
