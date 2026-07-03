import { store } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return { 
            ...toRefs(store) 
        };
    },
    template: `
        <footer class="bg-slate-100 dark:bg-[#03060d] border-t border-slate-200 dark:border-dark-border pt-16 pb-8 mt-auto relative z-10 transition-colors duration-500">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-right">
                    
                    <div class="lg:col-span-2">
                        <div class="flex items-center justify-center md:justify-start gap-2 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                                <svg class="w-5 h-5 text-white dark:text-dark-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                            </div>
                            <span class="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-500">رزرو اسپورت چیست؟</span>
                        </div>
                        <p class="text-slate-500 dark:text-slate-400 text-sm leading-loose max-w-md mx-auto md:mx-0 transition-colors duration-500">
                            رزرو اسپورت راهکاری سریع و آنلاین برای رزرو و اجاره اماکن ورزشی تفریحی در سطح کشور می‌باشد. ما مفتخریم که امکان رزرو آسان و بدون پرداخت هیچگونه هزینه اضافی برای تمام ورزشکاران را فراهم نموده‌ایم.
                        </p>
                    </div>

                    <div>
                        <h4 class="text-slate-800 dark:text-white font-bold mb-6 transition-colors duration-500">اطلاعات</h4>
                        <ul class="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <!-- لینک درباره ما متصل شد -->
                            <li><a href="#" @click.prevent="currentView = 'about'" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">درباره ما</a></li>
                            <li><a href="#" @click.prevent="currentView = 'dashboard'" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">داشبورد کاربری</a></li>
                            <li><a href="#" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">قوانین و مقررات</a></li>
                            <li><a href="#" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">حریم خصوصی</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-slate-800 dark:text-white font-bold mb-6 transition-colors duration-500">کاربران</h4>
                        <ul class="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="#" @click.prevent="currentView = 'dashboard'" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">ثبت مکان ورزشی</a></li>
                            <li><a href="#" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">سوالات متداول</a></li>
                            <!-- لینک تماس با ما متصل شد -->
                            <li><a href="#" @click.prevent="currentView = 'contact'" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">تماس با ما</a></li>
                            <li><a href="#" class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">فرایند خرید</a></li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-slate-200 dark:border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p class="text-slate-500 text-sm">
                        © تمامی حقوق برای <span class="text-slate-700 dark:text-slate-300 font-bold">رزرو اسپورت</span> محفوظ است.
                    </p>
                    <div class="flex items-center gap-6 text-sm">
                        <span class="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            پشتیبانی: <span class="text-slate-700 dark:text-slate-300 font-bold" dir="ltr">025-32689439</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    `
}