import { store } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return { ...toRefs(store) };
    },
    template: `
        <div class="fixed bottom-6 right-6 z-[80] space-y-3 pointer-events-none">
            <transition-group name="fade-slide">
                <div v-for="toast in toasts" :key="toast.id" 
                     class="glass-panel border-emerald-500/30 rounded-2xl p-4 shadow-glow-success flex items-center gap-3 max-w-sm animate-fade-up pointer-events-auto">
                    <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                        <h5 class="text-sm font-bold text-slate-800 dark:text-white">{{ toast.title }}</h5>
                        <p class="text-slate-500 dark:text-slate-400 text-xs">{{ toast.message }}</p>
                    </div>
                </div>
            </transition-group>
        </div>
    `
}