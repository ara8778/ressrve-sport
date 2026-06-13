import { store, addNotification } from './store.js';

export default {
    setup() {
        const { ref, toRefs } = window.Vue;
        
        const isLogin = ref(true);
        const showPassword = ref(false);
        const rememberMe = ref(true);
        const acceptRules = ref(false);

        const handleAuth = () => {
            const msg = isLogin.value ? 'شما با موفقیت وارد حساب خود شدید!' : 'حساب کاربری جدید شما با موفقیت ساخته شد!';
            addNotification(
                isLogin.value ? 'ورود موفقیت‌آمیز 🔑' : 'عضویت با موفقیت 🎉',
                msg
            );
            
            setTimeout(() => {
                store.currentView = 'home';
            }, 800);
        };

        return { 
            ...toRefs(store), 
            isLogin, 
            showPassword, 
            rememberMe, 
            acceptRules, 
            handleAuth 
        };
    },
    template: `
        <div class="pt-24 md:pt-32 pb-16 md:pb-24 relative z-10 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden sm:overflow-visible">
            
            <div class="absolute inset-0 bg-grid-pattern opacity-40 z-0 pointer-events-none"></div>
            <div class="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div class="w-full max-w-md px-4 relative z-10">
                
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-glow-subtle mb-3 group hover:rotate-6 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-500 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-black bg-gradient-to-r from-slate-800 via-slate-600 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">خوش آمدید به رزرو اسپورت</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">پلتفرم مدرن و لوکس رزرو اماکن ورزشی</p>
                </div>

                <div class="bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-500">
                    
                    <div class="relative flex p-1 bg-slate-50 dark:bg-dark-bg/95 border border-slate-200 dark:border-dark-border rounded-2xl mb-8 select-none transition-colors duration-500">
                        <div class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-l from-brand-500 to-cyan-400 rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                             :class="isLogin ? 'right-1' : 'left-1'"></div>
                        
                        <button @click="isLogin = true" class="w-1/2 py-2.5 text-xs font-black relative z-10 transition-colors duration-300 rounded-xl"
                                :class="isLogin ? 'text-white dark:text-dark-bg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                            ورود به حساب
                        </button>
                        <button @click="isLogin = false" class="w-1/2 py-2.5 text-xs font-black relative z-10 transition-colors duration-300 rounded-xl"
                                :class="!isLogin ? 'text-white dark:text-dark-bg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                            ثبت‌نام جدید
                        </button>
                    </div>

                    <div class="relative">
                        <transition name="fade-slide" mode="out-in">
                            
                            <form v-if="isLogin" key="login" @submit.prevent="handleAuth" class="space-y-4">
                                
                                <div class="relative group rounded-xl transition-all duration-300">
                                    <span class="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors duration-300">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </span>
                                    <input type="tel" required placeholder="شماره موبایل" dir="rtl"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300">
                                </div>

                                <div class="relative group rounded-xl transition-all duration-300">
                                    <span class="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors duration-300">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input :type="showPassword ? 'text' : 'password'" required placeholder="رمز عبور" dir="rtl"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300">
                                    <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 left-4 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                                        <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>

                                <div class="flex items-center justify-between text-xs pt-2">
                                    <div @click="rememberMe = !rememberMe" class="flex items-center gap-2 cursor-pointer select-none group">
                                        <div class="w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300"
                                             :class="rememberMe ? 'bg-brand-500 border-brand-500 shadow-glow-subtle' : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-dark-border group-hover:border-brand-500/50'">
                                            <svg v-if="rememberMe" class="w-3.5 h-3.5 text-white dark:text-dark-bg stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span class="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">مرا به خاطر بسپار</span>
                                    </div>
                                    <a href="#" class="text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 font-bold transition-colors">فراموشی رمز عبور؟</a>
                                </div>

                                <button type="submit" class="w-full relative overflow-hidden bg-gradient-to-r from-brand-500 to-cyan-400 hover:from-brand-600 hover:to-cyan-500 text-white dark:text-dark-bg font-extrabold py-3.5 rounded-xl text-sm tracking-wide shadow-glow shadow-brand-500/10 active:scale-[0.99] transition-all duration-300 shimmer-btn">
                                    ورود هوشمند به حساب کاربری
                                </button>
                            </form>

                            <form v-else key="signup" @submit.prevent="handleAuth" class="space-y-4">
                                
                                <div class="relative group rounded-xl transition-all duration-300">
                                    <span class="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors duration-300">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </span>
                                    <input type="text" required placeholder="نام و نام خانوادگی" dir="rtl"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300">
                                </div>

                                <div class="relative group rounded-xl transition-all duration-300">
                                    <span class="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors duration-300">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </span>
                                    <input type="tel" required placeholder="شماره همراه" dir="rtl"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300">
                                </div>

                                <div class="relative group rounded-xl transition-all duration-300">
                                    <span class="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors duration-300">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input :type="showPassword ? 'text' : 'password'" required placeholder="رمز عبور دلخواه" dir="rtl"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300">
                                </div>

                                <div class="flex items-center gap-2 text-xs pt-2">
                                    <div @click="acceptRules = !acceptRules" class="flex items-center gap-2 cursor-pointer select-none group">
                                        <div class="w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 flex-shrink-0"
                                             :class="acceptRules ? 'bg-brand-500 border-brand-500 shadow-glow-subtle' : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-dark-border group-hover:border-brand-500/50'">
                                            <svg v-if="acceptRules" class="w-3.5 h-3.5 text-white dark:text-dark-bg stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span class="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                            تمامی <a href="#" class="text-brand-500 dark:text-brand-400 font-bold hover:underline">قوانین و حریم خصوصی</a> رزرو اسپورت را می‌پذیرم.
                                        </span>
                                    </div>
                                </div>

                                <button type="submit" class="w-full relative overflow-hidden bg-gradient-to-r from-brand-500 to-cyan-400 hover:from-brand-600 hover:to-cyan-500 text-white dark:text-dark-bg font-extrabold py-3.5 rounded-xl text-sm tracking-wide shadow-glow shadow-brand-500/10 active:scale-[0.99] transition-all duration-300 shimmer-btn">
                                    ثبت‌نام و عضویت سریع
                                </button>
                            </form>

                        </transition>
                    </div>

                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-white/5"></div></div>
                        <div class="relative flex justify-center text-[10px]"><span class="bg-white dark:bg-[#0b1120] px-3 text-slate-500 font-bold transition-colors duration-500">یا ورود سریع با</span></div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                        <button type="button" class="social-btn-hover flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all duration-300 active:scale-[0.98]">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.65 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                            گوگل اکانت
                        </button>
                        <button type="button" class="social-btn-hover flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all duration-300 active:scale-[0.98]">
                            <svg class="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                            </svg>
                            اپل آیدی
                        </button>
                    </div>

                </div>

                <div class="text-center mt-6">
                    <button @click="currentView = 'home'" class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 font-bold transition-colors group">
                        <svg class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        بازگشت به صفحه اصلی پلتفرم
                    </button>
                </div>

            </div>
        </div>
    `
}