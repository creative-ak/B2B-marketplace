<template>
  <div v-if="active" class="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md sticky top-0 z-50 border-b border-amber-600">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
          !
        </div>
        <div>
          <div class="font-semibold flex items-center gap-2">
            <span>Admin Impersonation Active</span>
            <span class="text-xs bg-slate-950/15 px-2 py-0.5 rounded font-mono">
              Admin: {{ adminName }}
            </span>
          </div>
          <div class="text-xs opacity-90 flex items-center gap-2 mt-0.5">
            <span>Viewing as: <strong>{{ targetName }}</strong> ({{ targetRole.toUpperCase() }})</span>
            <span>·</span>
            <span class="italic">Reason: "{{ reason }}"</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <form :action="restoreUrl" method="POST">
          <input type="hidden" name="_token" :value="csrfToken" />
          <button
            type="submit"
            class="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded text-xs font-semibold shadow cursor-pointer transition-colors"
          >
            ← Return to Admin Console
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: { type: Boolean, default: false },
  adminName: { type: String, default: 'Administrator' },
  targetName: { type: String, default: 'User' },
  targetRole: { type: String, default: 'manufacturer' },
  reason: { type: String, default: 'Support troubleshooting' },
  restoreUrl: { type: String, default: '/admin/impersonate/restore' },
  csrfToken: { type: String, default: '' }
});
</script>
