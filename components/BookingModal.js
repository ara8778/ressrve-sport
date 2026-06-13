import { store, closeBookingModal, confirmBooking } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return { 
            ...toRefs(store), 
            closeBookingModal, 
            confirmBooking 
        };
    },
    template: `
        <div v-if="bookingModal.show" class="fixed inset-0 z-[70] flex items-center justify-center p-4" @click.stop>
            <div class="absolute inset-0 bg-slate-900/60 dark:bg-dark-bg/85 backdrop-blur-md" @click="closeBookingModal"></div>
            
            <div class="relative w-full max-w-lg glass-panel border border-brand-500/30 rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-fade-up">
                <div class="absolute -top-12 -left-12 w-48 h-48 bg-brand-500/15 rounded-full blur-[60px]"></div>
                
                <div class="relative z-10">
                    <button @click="closeBookingModal" class="absolute top-0 left-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <div class="text-center mb-6">
                        <div class="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center mx-auto mb-3 shadow-glow">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800 dark:text-white mt-4">تأییدیه رزرو سانس</h3>
                        <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">پیش‌فاکتور رزرو شما به شرح زیر می‌باشد:</p>
                    </div>

                    <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-5 mb-6 space-y-4 transition-colors duration-500">
                        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/5">
                            <span class="text-slate-500 dark:text-slate-400 text-sm">نام مجموعه ورزشی</span>
                            <span class="text-slate-800 dark:text-white font-bold text-sm">{{ bookingModal.venue.name }}</span>
                        </div>
                        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/5" v-if="bookingModal.slot">
                            <span class="text-slate-500 dark:text-slate-400 text-sm">تاریخ رزرو</span>
                            <span class="text-brand-600 dark:text-brand-400 font-bold text-sm" dir="ltr">{{ bookingModal.slot.date }}</span>
                        </div>
                        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/5">
                            <span class="text-slate-500 dark:text-slate-400 text-sm">بازه زمانی سانس</span>
                            <span class="text-slate-800 dark:text-white font-semibold text-sm">{{ bookingModal.venue.timeSlot || '14:30 تا 15:00' }}</span>
                        </div>
                        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/5">
                            <span class="text-slate-500 dark:text-slate-400 text-sm">سرویس‌ها</span>
                            <span class="text-slate-700 dark:text-slate-200 text-xs">رختکن عمومی، سیستم گرمایش و سرمایش</span>
                        </div>
                        <div class="flex justify-between items-center pt-2">
                            <span class="text-slate-700 dark:text-slate-300 font-bold text-sm">مبلغ نهایی پرداخت</span>
                            <div class="text-lg text-emerald-600 dark:text-emerald-400 font-extrabold">
                                {{ bookingModal.venue.price }} <span class="text-xs font-normal text-slate-500 dark:text-slate-400">تومان</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 mb-6">
                        <div>
                            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">نام و نام خانوادگی رزرو کننده</label>
                            <input type="text" placeholder="نام خود را وارد کنید..." class="w-full bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">شماره همراه جهت ارسال پیامک کد رزرو</label>
                            <input type="text" placeholder="۰۹۱۲۳۴۵۶۷۸۹" class="w-full bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 transition-colors text-left" dir="ltr">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <button @click="closeBookingModal" class="bg-slate-100 dark:bg-dark-bg hover:bg-slate-200 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl transition-all duration-300">
                            انصراف
                        </button>
                        <button @click="confirmBooking" class="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white dark:text-dark-bg font-extrabold py-3.5 rounded-2xl transition-all duration-300 shadow-glow flex items-center justify-center gap-2">
                            <span>پرداخت و ثبت نهایی</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}