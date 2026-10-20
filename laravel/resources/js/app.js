import './bootstrap';
import { createApp } from 'vue';

// Import Vue 3 Hybrid Components
import MyComponent from './components/MyComponent.vue';
import SearchAutocomplete from './components/SearchAutocomplete.vue';
import RfqModal from './components/RfqModal.vue';
import QuotationComparison from './components/QuotationComparison.vue';
import ImpersonationBanner from './components/ImpersonationBanner.vue';

// Initialize Vue 3 App with Hybrid Mount over Laravel Blade
const app = createApp({});

// Register Global Vue 3 Components for use within Blade views
app.component('my-component', MyComponent);
app.component('search-autocomplete', SearchAutocomplete);
app.component('rfq-modal', RfqModal);
app.component('quotation-comparison', QuotationComparison);
app.component('impersonation-banner', ImpersonationBanner);

// Sabse Important: Yeh ID aapke Blade template ke <div id="app"> se match honi chahiye
app.mount('#app');
