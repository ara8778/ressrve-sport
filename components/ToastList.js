import { store } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return { ...toRefs(store) };
    },
    template: `
        <!-- سیستم تراز دقیق: دسکتاپ پایین سمت راست، موبایل کاملاً پایین و در مرکز صفحه بدون تداخل المان‌ها -->
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-[80] space-y-3 pointer-events-none w-[calc(100%-2rem)] max-w-xs sm:max-w-sm md:w-96 transition-all duration-300">
            <!-- استایل تضمینی برای ترنزیشن‌های نرم نوتیفیکیشن -->
            <style>
                .fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .fade-slide-enter-from { opacity: 0; transform: translateY(20px) scale(0.9); }
                .fade-slide-leave-to { opacity: 0; transform: translateY(20px) scale(0.9); }
            </style>
            
            <transition-group name="fade-slide">
                <div v-for="toast in toasts" :key="toast.id" 
                     class="glass-panel border-emerald-500/30 rounded-2xl p-4 shadow-glow-success flex items-center gap-3 w-full pointer-events-auto transition-all duration-300">
                    <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div class="text-right flex-1">
                        <h5 class="text-sm font-bold text-slate-800 dark:text-white">{{ toast.title }}</h5>
                        <p class="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{{ toast.message }}</p>
                    </div>
                </div>
            </transition-group>
        </div>
    `
}