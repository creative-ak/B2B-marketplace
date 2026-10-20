<template>
  <div>
    <!-- Trigger Button if used standalone -->
    <button 
      v-if="showTriggerButton" 
      @click="isOpen = true" 
      class="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
    >
      <span>+ Post Buy Requirement</span>
    </button>

    <!-- Modal Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">
              {{ productName ? 'Request Best Quotation' : 'Post Buy Requirement (RFQ)' }}
            </h3>
            <p class="text-xs text-slate-500">
              Connect directly with verified Surat silk mills, Tirupur knitters & industrial plants
            </p>
          </div>
          <button @click="isOpen = false" class="text-slate-400 hover:text-slate-700 text-base font-bold">
            ✕
          </button>
        </div>

        <form :action="submitUrl" method="POST" class="p-5 space-y-4 text-xs">
          <input type="hidden" name="_token" :value="csrfToken" />
          <input v-if="productId" type="hidden" name="product_id" :value="productId" />

          <div>
            <label class="block font-semibold text-slate-800 mb-1">
              Product / Cloth / Equipment Needed *
            </label>
            <input
              type="text"
              name="product_title"
              required
              v-model="title"
              placeholder="e.g. 180 GSM Bio-Washed Cotton Knitted Fabric, Surat Banarasi Sarees..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Quantity Required *</label>
              <input
                type="number"
                name="quantity_required"
                min="1"
                required
                v-model="quantity"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Unit</label>
              <select name="unit" v-model="unit" class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="Kg">Kg (Knitted Fabric / Yarn)</option>
                <option value="Meter">Meter (Fabric Yardage / Denim)</option>
                <option value="Piece">Piece (Sarees / T-Shirts)</option>
                <option value="Set">Set (Kurti Sets / Machines)</option>
                <option value="Metric Ton">Metric Ton</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Target Price / Unit (₹)</label>
              <input
                type="number"
                name="target_price"
                placeholder="Optional budget"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-800 mb-1">Delivery Destination *</label>
              <input
                type="text"
                name="delivery_location"
                required
                placeholder="e.g. Delhi, Surat, Bengaluru..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-800 mb-1">Detailed Technical Specifications</label>
            <textarea
              name="specifications"
              rows="3"
              placeholder="Mention required GSM, yarn count, colors, catalog assortments, or certifications..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none resize-none"
            ></textarea>
          </div>

          <div class="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              @click="isOpen = false"
              class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer shadow-xs"
            >
              Submit Commercial RFQ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  productId: { type: String, default: '' },
  productName: { type: String, default: '' },
  defaultUnit: { type: String, default: 'Piece' },
  defaultQuantity: { type: Number, default: 10 },
  csrfToken: { type: String, default: '' },
  submitUrl: { type: String, default: '/enquiries' },
  showTriggerButton: { type: Boolean, default: false }
});

const isOpen = ref(false);
const title = ref(props.productName);
const quantity = ref(props.defaultQuantity);
const unit = ref(props.defaultUnit);
</script>
