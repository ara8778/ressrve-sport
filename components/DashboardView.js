import { store } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return {
            ...toRefs(store)
        };
    },
    template: `
        <div class="relative pt-32 pb-24 lg:pt-40 lg:pb-32 min-h-screen z-10">
            <!-- Background decorative elements -->
            <div class="absolute right-0 top-40 w-72 h-72 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none hidden md:block"></div>
            <div class="absolute left-0 bottom-40 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none hidden md:block"></div>

            <div class="container mx-auto px-4 lg:px-8 relative z-20">
                <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    <!-- Sidebar / Profile -->
                    <aside class="w-full lg:w-1/3 xl:w-1/4 animate-fade-up">
                        <div class="bg-white/90 dark:bg-dark-card/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-xl dark:shadow-2xl overflow-hidden sticky top-28">
                            <!-- User Profile Summary -->
                            <div class="p-8 flex flex-col items-center border-b border-slate-100 dark:border-white/5 relative">
                                <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-500/20 to-transparent"></div>
                                <div class="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-brand-400 to-blue-600 shadow-glow mb-4 relative z-10">
                                    <div class="w-full h-full rounded-full border-4 border-white dark:border-dark-bg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                </div>
                                <h2 class="text-xl font-black text-slate-800 dark:text-white mb-1">{{ user.name }}</h2>
                                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium dir-ltr" style="direction: ltr;">{{ user.phone }}</p>
                            </div>

                            <!-- Navigation Menu -->
                            <nav class="p-4 flex flex-col gap-2">
                                <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold transition-all border border-brand-500/20">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    نمایه کاربری
                                </a>
                                <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400 font-semibold transition-all">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    ویرایش اطلاعات
                                </a>
                                <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400 font-semibold transition-all">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    تغییر رمز عبور
                                </a>
                                <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400 font-semibold transition-all">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    سالن من
                                </a>
                                <div class="h-px bg-slate-100 dark:bg-white/5 my-2"></div>
                                <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold transition-all group">
                                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    خروج از حساب
                                </a>
                            </nav>
                        </div>
                    </aside>

                    <!-- Main Content -->
                    <main class="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6 lg:gap-8 animate-fade-up delay-100">
                        
                        <!-- Promo Banner -->
                        <div class="relative bg-gradient-to-r from-brand-500 to-blue-500 rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-glow flex flex-col md:flex-row items-center justify-between gap-6">
                            <!-- bg pattern -->
                            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] opacity-50"></div>
                            <div class="absolute -left-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                            <div class="absolute right-0 bottom-0 w-32 h-32 bg-brand-300/30 rounded-full blur-xl"></div>
                            
                            <div class="relative z-10 text-center md:text-right">
                                <h3 class="text-xl md:text-2xl font-black text-white mb-2" style="text-shadow: 0 2px 10px rgba(0,0,0,0.1);">مدیریت یک مجموعه ورزشی را بر عهده دارید؟</h3>
                                <p class="text-brand-50 font-medium">پیشنهادات ویژه و پنل اختصاصی مدیریت برای شما داریم!</p>
                            </div>
                            <button class="relative z-10 shrink-0 bg-white text-brand-600 hover:text-brand-500 font-black px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
                                اطلاعات بیشتر
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            </button>
                        </div>

                        <!-- Dashboard Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Card 1: Purchases -->
                            <div class="bg-white/90 dark:bg-dark-card/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center relative overflow-hidden">
                                <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                    <div class="absolute inset-0 bg-brand-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <svg class="w-10 h-10 text-brand-500 dark:text-brand-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                </div>
                                <h4 class="text-2xl font-black text-slate-800 dark:text-white mb-2 relative z-10">{{ user.purchases }} خرید</h4>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 relative z-10 text-center">تاریخچه رزروها و سانس‌های خریداری شده شما</p>
                                <button class="w-full bg-brand-50 hover:bg-brand-500 dark:bg-brand-500/10 dark:hover:bg-brand-500 text-brand-600 dark:text-brand-400 hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10">
                                    مشاهده جزئیات
                                </button>
                            </div>

                            <!-- Card 2: Credit -->
                            <div class="bg-white/90 dark:bg-dark-card/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center relative overflow-hidden">
                                <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                    <div class="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <svg class="w-10 h-10 text-blue-500 dark:text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                </div>
                                <h4 class="text-2xl font-black text-slate-800 dark:text-white mb-2 relative z-10">اعتبار: {{ user.credit }} تومان</h4>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 relative z-10 text-center">موجودی کیف پول شما برای رزرو سریع‌تر</p>
                                <button class="w-full bg-blue-50 hover:bg-blue-500 dark:bg-blue-500/10 dark:hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10">
                                    شارژ حساب
                                </button>
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    `
}