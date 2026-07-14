import { store } from './store.js';

export default {
    setup() {
        const { toRefs, computed } = window.Vue;

        const errorDetails = computed(() => {
            const code = store.errorData.code;
            switch(code) {
                case 401:
                    return { 
                        title: 'کارت زرد!', 
                        msg: 'ورود بدون بلیط مجاز نیست! برای دسترسی به این بخش ابتدا باید وارد حساب کاربری خودت بشی.', 
                        iconColor: 'text-amber-400 dark:text-amber-300',
                        bgGlow: 'bg-amber-500/20',
                        // آیکون کارت زرد و قفل امنیتی
                        svg: `<svg class="w-14 h-14 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="5" y="3" width="14" height="18" rx="3" />
                                <path d="M12 8c-1.1 0-2 .9-2 2v2H9v4h6v-4h-1v-2c0-1.1-.9-2-2-2zm1 4h-2v-2c0-.55.45-1 1-1s1 .45 1 1v2z" fill="#1e293b" />
                              </svg>`
                    };
                case 403:
                    return { 
                        title: 'کارت قرمز!', 
                        msg: 'شما اخراج شدید! دسترسی به این بخش از استادیوم برای شما مجاز نیست و باید به رختکن برگردید.', 
                        iconColor: 'text-rose-500',
                        bgGlow: 'bg-rose-500/20',
                        // آیکون کارت قرمز و علامت ورود ممنوع
                        svg: `<svg class="w-14 h-14 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="5" y="3" width="14" height="18" rx="3" />
                                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm1.5 6.5l-1-1-1 1-1-1 1-1-1-1 1-1 1 1 1-1 1 1-1 1 1 1-1 1z" fill="white" />
                              </svg>`
                    };
                case 404:
                    return { 
                        title: 'آفساید!', 
                        msg: 'داور سوت زده! صفحه‌ای که دنبالش بودی رو پیدا نکردیم. احتمالا آدرس رو اشتباه زدی یا صفحه حذف شده.', 
                        iconColor: 'text-cyan-400 dark:text-cyan-300',
                        bgGlow: 'bg-cyan-500/20',
                        // آیکون سوت داور
                        svg: `<svg class="w-14 h-14 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h-4a2 2 0 00-2 2v3a3 3 0 003 3h5a3 3 0 003-3v-3a2 2 0 00-2-2zM8 12H4a1 1 0 01-1-1V9a1 1 0 011-1h6a1 1 0 011 1v1M18 10h2a1 1 0 011 1v1a1 1 0 01-1 1h-2" />
                                <circle cx="14" cy="14" r="1.5" fill="currentColor" />
                              </svg>`
                    };
                case 429:
                    return { 
                        title: 'ترافیک جلوی گیت!', 
                        msg: 'سرور داره نفس‌نفس می‌زنه! تعداد درخواست‌هات خیلی بالا رفته. چند لحظه نفس تازه کن و دوباره تلاش کن.', 
                        iconColor: 'text-violet-500 dark:text-violet-400',
                        bgGlow: 'bg-violet-500/20',
                        // آیکون گیت شلوغ / زمان‌سنج سرعت بالا
                        svg: `<svg class="w-14 h-14 text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="13" r="8" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5V2M9 2h6M12 9v4l3 3" />
                              </svg>`
                    };
                case 500:
                    return { 
                        title: 'مصدومیت در زمین!', 
                        msg: 'سرورهای ما دچار مصدومیت جزئی شدن. تیم پزشکی (پشتیبانی فنی) داره روی مشکل کار می‌کنه.', 
                        iconColor: 'text-emerald-500 dark:text-emerald-400',
                        bgGlow: 'bg-emerald-500/20',
                        // آیکون کیف کمک‌های اولیه / صلیب پزشکی
                        svg: `<svg class="w-14 h-14 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-3-3v6M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              </svg>`
                    };
                default:
                    return { 
                        title: 'توقف بازی!', 
                        msg: 'یه اتفاق عجیب تو زمین افتاده. لطفا چند لحظه دیگه دوباره تلاش کن تا بازی از سر گرفته بشه.', 
                        iconColor: 'text-slate-500',
                        bgGlow: 'bg-slate-500/20',
                        svg: `<svg class="w-14 h-14 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>`
                    };
            }
        });

        const goHome = () => {
            store.currentView = 'home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        return { ...toRefs(store), errorDetails, goHome };
    },
    template: `
        <div class="relative min-h-[75vh] flex items-center justify-center py-20 overflow-hidden">
            <!-- پس زمینه های نوری متغیر متناسب با هر خطا -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] transition-colors duration-1000 opacity-40 dark:opacity-20 pointer-events-none" :class="errorDetails.bgGlow"></div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-2xl mx-auto glass-panel rounded-[3rem] p-8 md:p-16 text-center shadow-2xl border-t border-white/40 dark:border-white/10 animate-fade-up">
                    
                    <!-- هاب مرکزی آیکون و لودینگ اختصاصی -->
                    <div class="relative inline-block mb-10">
                        <!-- رینگ دایره چرخشی نقطه چین پشتی -->
                        <div class="w-36 h-36 md:w-44 md:h-44 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-md rounded-full border-4 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center animate-[spin_20s_linear_infinite] shadow-lg relative z-10"></div>
                        
                        <!-- آیکون اختصاصی ارور و تصویر لودینگ شما به صورت همپوشانی شیک -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <!-- تصویر لودینگ شما به صورت هولوگرامی پالس زننده در پشت آیکون -->
                            <img src="image_7db5a4.png" alt="Loading" class="w-14 h-14 md:w-16 md:h-16 opacity-30 absolute animate-pulse pointer-events-none" />
                            
                            <!-- آیکون وکتوری ۱۰۰٪ مطمئن که از کد خوانده میشود -->
                            <div class="relative z-30 transform scale-110 md:scale-125 transition-all duration-300 hover:rotate-12" v-html="errorDetails.svg"></div>
                        </div>
                        
                        <!-- شماره ارور شناور بالا سمت راست -->
                        <div class="absolute -right-4 -top-4 w-16 h-16 rounded-2xl bg-white dark:bg-dark-card shadow-xl border border-slate-100 dark:border-white/10 flex items-center justify-center transform rotate-12 animate-bounce z-30" :class="errorDetails.iconColor">
                            <span class="text-2xl font-black">{{ errorData.code }}</span>
                        </div>
                    </div>

                    <h1 class="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4 tracking-tight" :class="errorDetails.iconColor">
                        {{ errorDetails.title }}
                    </h1>
                    
                    <p class="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg mx-auto font-medium">
                        {{ errorDetails.msg }}
                    </p>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button @click="goHome" class="w-full sm:w-auto bg-gradient-to-r from-brand-400 to-cyan-600 hover:from-brand-500 hover:to-cyan-700 text-white font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-glow hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            بازگشت به زمین اصلی
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}