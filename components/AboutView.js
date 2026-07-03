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
            <div class="absolute right-0 top-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none hidden md:block animate-pulse duration-[5000ms]"></div>
            <div class="absolute left-10 bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none hidden md:block"></div>

            <div class="container mx-auto px-4 lg:px-8 relative z-20 animate-fade-up">
                
                <!-- عنوان اصلی صفحه -->
                <div class="text-center mb-16 relative">
                    <div class="inline-flex items-center justify-center p-3 bg-brand-50 dark:bg-brand-500/10 rounded-2xl mb-6 shadow-glow-subtle anim-icon-r1">
                        <svg class="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">
                        درباره <span class="text-transparent bg-clip-text bg-gradient-to-l from-brand-400 to-cyan-500">رزرو اسپورت</span>
                    </h1>
                    <p class="text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium text-lg leading-relaxed">
                        پلتفرم جامع و مدرن رزرو آنلاین اماکن ورزشی در ایران؛ راهی سریع، امن و مطمئن برای شروع ورزش بدون دغدغه و اتلاف وقت!
                    </p>
                </div>

                <!-- بخش داستان ما و آمارها -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div class="space-y-6">
                        <div class="glass-panel rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                            <div class="absolute -right-20 -top-20 w-48 h-48 bg-brand-500/10 rounded-full blur-[50px] group-hover:bg-brand-500/20 transition-all duration-700"></div>
                            
                            <h2 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3 relative z-10">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-blue-500 flex items-center justify-center text-white shadow-glow">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                داستان ما از کجا شروع شد؟
                            </h2>
                            <p class="text-slate-600 dark:text-slate-300 leading-loose text-justify font-medium relative z-10 text-sm md:text-base">
                                همه چیز از یک دغدغه ساده شروع شد: پیدا کردن یک سالن ورزشی خالی و رزرو سریع آن، همیشه یکی از چالش‌های بزرگ ورزشکاران بوده است. تماس‌های مکرر، مراجعه حضوری و عدم اطمینان از خالی بودن سانس‌ها.
                                <br><br>
                                ما در <b>رزرو اسپورت</b> گرد هم آمدیم تا با استفاده از تکنولوژی‌های روز، این فرآیند را برای همیشه تغییر دهیم. اکنون شما می‌توانید تنها با چند کلیک، نزدیک‌ترین و بهترین مجموعه‌های ورزشی را پیدا کرده، تصاویر آن‌ها را ببینید و با خیال راحت رزرو خود را قطعی کنید.
                            </p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-6 relative">
                        <!-- کارت آمار ۱ -->
                        <div class="glass-panel rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-white/10 text-center transform hover:scale-105 transition-all duration-300 group">
                            <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-blue-600 flex items-center justify-center shadow-glow mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <h4 class="text-4xl font-black text-slate-800 dark:text-white mb-2 dir-ltr">+۱۰,۰۰۰</h4>
                            <p class="text-slate-500 dark:text-slate-400 font-bold">ورزشکار فعال</p>
                        </div>
                        <!-- کارت آمار ۲ -->
                        <div class="glass-panel rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-white/10 text-center transform hover:scale-105 transition-all duration-300 translate-y-8 group">
                            <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-glow-success mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h4 class="text-4xl font-black text-slate-800 dark:text-white mb-2 dir-ltr">+۵۰۰</h4>
                            <p class="text-slate-500 dark:text-slate-400 font-bold">مجموعه ورزشی</p>
                        </div>
                    </div>
                </div>

                <!-- بخش ارزش‌های کلیدی -->
                <div class="text-center mb-12 relative">
                    <h2 class="text-3xl font-black text-slate-800 dark:text-white relative z-10 inline-block">
                        ارزش‌های کلیدی ما
                        <div class="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-cyan-500 opacity-30 rounded-full blur-sm"></div>
                    </h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- ارزش ۱ -->
                    <div class="glass-panel rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-glow-subtle transition-all duration-300 group">
                        <div class="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-500/20">
                            <svg class="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white mb-3">سرعت و سهولت</h3>
                        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">ما کوتاه‌ترین و راحت‌ترین مسیر ممکن از اراده برای ورزش کردن تا حضور در سالن را برای شما طراحی کرده‌ایم.</p>
                    </div>
                    <!-- ارزش ۲ -->
                    <div class="glass-panel rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group">
                        <div class="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white mb-3">اعتماد و امنیت</h3>
                        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">پرداخت‌های کاملاً امن، پشتیبانی فعال و تضمین رزرو قطعی سالن، آرامش خاطر را برای همه کاربران ما به همراه دارد.</p>
                    </div>
                    <!-- ارزش ۳ -->
                    <div class="glass-panel rounded-[2rem] p-8 shadow-lg border border-slate-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group">
                        <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white mb-3">نوآوری مستمر</h3>
                        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">ما همواره در حال توسعه امکانات جدید و هوشمند هستیم تا تجربه مدرن‌تری از ورزش را برای شما خلق کنیم.</p>
                    </div>
                </div>

            </div>
        </div>
    `
}