import { store } from './store.js';

export default {
    setup() {
        const { ref, computed, toRefs } = window.Vue;
        const activeFaq = ref(null);
        const searchQuery = ref('');

        // لیست سوالات خفن و کاربردی
        const faqs = ref([
            { id: 1, category: 'رزرو', question: 'چگونه می‌توانم یک مجموعه ورزشی رزرو کنم؟', answer: 'برای رزرو کافیست در صفحه اصلی نام مجموعه یا شهر خود را جستجو کنید، ساعت سانس مورد نظر را انتخاب کرده و پس از پرداخت، رزرو شما قطعی می‌شود.' },
            { id: 2, category: 'مالی', question: 'آیا امکان لغو رزرو و بازگشت وجه وجود دارد؟', answer: 'بله، در صورتی که حداقل ۲۴ ساعت قبل از شروع سانس رزرو خود را لغو کنید، تمام وجه به کیف پول شما در داشبورد کاربری بازگردانده می‌شود.' },
            { id: 3, category: 'حساب کاربری', question: 'چطور می‌توانم مجموعه ورزشی خودم را ثبت کنم؟', answer: 'با مراجعه به صفحه "مجموعه ورزشی دارید؟" و تکمیل فرم ثبت‌نام، کارشناسان ما در کمتر از ۱۲ ساعت با شما تماس گرفته و مجموعه شما را فعال می‌کنند.' },
            { id: 4, category: 'پشتیبانی', question: 'در صورت بروز مشکل در محل برگزاری چه کار کنم؟', answer: 'تیم پشتیبانی ما به صورت ۲۴ ساعته در ۷ روز هفته از طریق چت آنلاین و شماره تماس درج شده در سایت پاسخگوی شما عزیزان است.' },
            { id: 5, category: 'مالی', question: 'آیا برای رزرو هزینه‌ی اضافی یا کارمزد پرداخت می‌کنم؟', answer: 'خیر! رزرو اسپورت هیچگونه هزینه اضافی یا کارمزدی از ورزشکاران دریافت نمی‌کند و شما دقیقا همان مبلغ اصلی سانس را می‌پردازید.' }
        ]);

        const filteredFaqs = computed(() => {
            if (!searchQuery.value) return faqs.value;
            return faqs.value.filter(faq => 
                faq.question.includes(searchQuery.value) || 
                faq.answer.includes(searchQuery.value)
            );
        });

        const toggleFaq = (id) => {
            activeFaq.value = activeFaq.value === id ? null : id;
        };

        return { 
            ...toRefs(store), 
            searchQuery, 
            filteredFaqs, 
            activeFaq, 
            toggleFaq 
        };
    },
    template: `
        <div class="pt-28 pb-16 min-h-screen">
            <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
                <!-- هدر صفحه -->
                <div class="text-center mb-12">
                    <h1 class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-brand-600 to-brand-400 dark:from-brand-400 dark:to-blue-500 mb-4 transition-all duration-500">سوالات متداول</h1>
                    <p class="text-slate-500 dark:text-slate-400 text-lg transition-colors duration-500">چگونه می‌توانیم به شما کمک کنیم؟</p>
                </div>

                <!-- باکس جستجو -->
                <div class="relative mb-12 group">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg class="w-6 h-6 text-slate-400 group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        class="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl py-4 pr-12 pl-4 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 shadow-sm"
                        placeholder="سوال خود را جستجو کنید..."
                    >
                </div>

                <!-- لیست سوالات -->
                <div class="space-y-4">
                    <div v-if="filteredFaqs.length === 0" class="text-center py-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border">
                        متاسفانه نتیجه‌ای یافت نشد. لطفا کلمه دیگری را جستجو کنید.
                    </div>

                    <div 
                        v-for="faq in filteredFaqs" 
                        :key="faq.id" 
                        class="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
                        :class="{'border-brand-500/50 dark:border-brand-400/50 shadow-sm': activeFaq === faq.id}"
                    >
                        <button 
                            @click="toggleFaq(faq.id)" 
                            class="w-full px-6 py-5 flex items-center justify-between text-right focus:outline-none"
                        >
                            <span class="font-bold text-slate-700 dark:text-slate-200 transition-colors" :class="{'text-brand-500 dark:text-brand-400': activeFaq === faq.id}">
                                {{ faq.question }}
                            </span>
                            <div 
                                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 transition-all duration-300"
                                :class="{'bg-brand-50 dark:bg-brand-500/10 text-brand-500 dark:text-brand-400 rotate-180': activeFaq === faq.id}"
                            >
                                <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </button>
                        
                        <div 
                            class="px-6 overflow-hidden transition-all duration-500 ease-in-out"
                            :class="activeFaq === faq.id ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'"
                        >
                            <p class="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base border-t border-slate-100 dark:border-white/5 pt-4">
                                {{ faq.answer }}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- بخش ارتباط با پشتیبانی -->
                <div class="mt-12 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-3xl p-8 text-center border border-brand-100 dark:border-brand-500/10 transition-colors duration-500">
                    <div class="w-16 h-16 mx-auto bg-white dark:bg-dark-card rounded-2xl shadow-sm flex items-center justify-center mb-4 text-brand-500">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">جواب سوالتون رو پیدا نکردید؟</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-6">تیم پشتیبانی ما همیشه آماده پاسخگویی به شماست.</p>
                    <button @click="currentView = 'contact'" class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-glow hover:-translate-y-1">
                        تماس با پشتیبانی
                    </button>
                </div>
            </div>
        </div>
    `
}