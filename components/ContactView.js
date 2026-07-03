import { store } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return { 
            ...toRefs(store) 
        };
    },
    template: `
        <div class="relative pt-32 pb-24 lg:pt-40 lg:pb-32 min-h-screen z-10 font-sans">
            <!-- افکت‌های نوری پس‌زمینه -->
            <div class="absolute left-0 top-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none hidden md:block animate-pulse duration-[5000ms]"></div>
            <div class="absolute right-10 bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none hidden md:block"></div>

            <div class="container mx-auto px-4 lg:px-8 relative z-20 animate-fade-up">
                
                <div class="text-center mb-16 relative">
                    <div class="inline-flex items-center justify-center p-3 bg-brand-50 dark:bg-brand-500/10 rounded-2xl mb-4 shadow-glow-subtle anim-icon-l1">
                        <svg class="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">تماس با <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-500">رزرو اسپورت</span></h1>
                    <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg">ما همیشه آماده شنیدن صدای شما هستیم. نظرات، پیشنهادات و سوالات خود را با ما در میان بگذارید.</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    <!-- اطلاعات تماس -->
                    <div class="lg:col-span-1 space-y-6">
                        <!-- کارت آدرس -->
                        <div class="glass-panel rounded-[2rem] p-6 shadow-lg border border-slate-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300 group">
                            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-blue-600 flex items-center justify-center shadow-glow mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">دفتر مرکزی</h3>
                            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">قم، سالاریه، بلوار امین، مجتمع تجاری ورزشی الماس، طبقه سوم، واحد ۳۰۲</p>
                        </div>

                        <!-- کارت تلفن -->
                        <div class="glass-panel rounded-[2rem] p-6 shadow-lg border border-slate-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300 group">
                            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-glow-success mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </div>
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">شماره تماس</h3>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mb-1 dir-ltr text-right font-bold">025 - 32689439</p>
                            <p class="text-slate-500 dark:text-slate-400 text-sm dir-ltr text-right font-bold">0912 345 6789</p>
                        </div>

                        <!-- کارت شبکه‌های اجتماعی -->
                        <div class="glass-panel rounded-[2rem] p-6 shadow-lg border border-slate-200 dark:border-white/10 text-center flex flex-col items-center">
                            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">ما را دنبال کنید</h3>
                            <div class="flex gap-4">
                                <a href="#" class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-brand-500 hover:border-brand-500 transition-all hover:scale-110 social-btn-hover">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                                <a href="#" class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-pink-500 hover:border-pink-500 transition-all hover:scale-110 social-btn-hover">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- فرم تماس با استایل پنل شیشه‌ای -->
                    <div class="lg:col-span-2">
                        <div class="glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
                            <!-- افکت پس‌زمینه فرم -->
                            <div class="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-[60px]"></div>
                            
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-8 relative z-10">ارسال پیام مستقیم</h2>
                            
                            <form @submit.prevent class="space-y-6 relative z-10">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام و نام خانوادگی</label>
                                        <input type="text" class="w-full bg-slate-50/50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-slate-400" placeholder="مثال: علی محمدی">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره تماس</label>
                                        <input type="tel" class="w-full bg-slate-50/50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-left dir-ltr placeholder:text-slate-400" placeholder="0912 345 6789">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">موضوع پیام</label>
                                    <input type="text" class="w-full bg-slate-50/50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-slate-400" placeholder="موضوع پیام خود را بنویسید...">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">متن پیام شما</label>
                                    <textarea rows="5" class="w-full bg-slate-50/50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none placeholder:text-slate-400" placeholder="پیام خود را اینجا بنویسید..."></textarea>
                                </div>
                                <div class="pt-2">
                                    <button class="w-full sm:w-auto bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold px-10 py-4 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                                        ارسال پیام
                                        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}