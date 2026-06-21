import { store, addNotification } from './store.js';

export default {
    setup() {
        const { ref, toRefs } = window.Vue;

        // مدیریت وضعیت تب‌های داشبورد (SPA Routing)
        const activeTab = ref('overview'); // overview | profile | security | venues | purchases

        // مدیریت مودال شارژ حساب
        const showChargeModal = ref(false);
        const predefinedAmounts = ['۵۰,۰۰۰', '۱۰۰,۰۰۰', '۲۰۰,۰۰۰', '۵۰۰,۰۰۰'];
        const selectedAmount = ref('');
        const customAmount = ref('');

        // متغیرهای مربوط به کاستوم سلکت (انتخاب شهر)
        const isCityDropdownOpen = ref(false);
        const selectedCity = ref('قم');
        const cities = ['قم', 'تهران', 'کرج', 'اصفهان', 'مشهد', 'شیراز'];

        // دیتای تستی برای تاریخچه خرید
        const purchaseHistory = ref([
            { id: 1, venueName: 'سالن ورزشی کاظمی', date: '۱۴۰۳/۰۹/۱۵', time: '۱۵:۰۰ تا ۱۶:۳۰', price: '۶۰۰,۰۰۰', status: 'موفق' },
            { id: 2, venueName: 'مجموعه ورزشی هدایتی', date: '۱۴۰۳/۰۸/۲۲', time: '۱۹:۰۰ تا ۲۰:۳۰', price: '۴۵۰,۰۰۰', status: 'موفق' },
            { id: 3, venueName: 'سالن فوتسال شهید اکبری', date: '۱۴۰۳/۰۷/۱۰', time: '۱۴:۳۰ تا ۱۶:۰۰', price: '۴۰۰,۰۰۰', status: 'موفق' }
        ]);

        // عملیات خروج از حساب
        const handleLogout = () => {
            store.currentView = 'home';
            addNotification('خروج موفقیت‌آمیز', 'شما با موفقیت از سیستم خارج شدید.', 'success');
        };

        // عملیات شارژ کیف پول
        const handleChargeWallet = () => {
            const finalAmount = customAmount.value || selectedAmount.value;
            if (!finalAmount) {
                addNotification('خطا', 'لطفاً مبلغ شارژ را مشخص کنید.', 'error');
                return;
            }
            addNotification('شارژ موفق', `مبلغ ${finalAmount} تومان با موفقیت به حساب شما واریز شد.`, 'success');
            showChargeModal.value = false;
            selectedAmount.value = '';
            customAmount.value = '';
        };

        // تنظیم مبلغ انتخابی برای مودال
        const selectAmount = (amount) => {
            selectedAmount.value = amount;
            customAmount.value = '';
        };

        // انتخاب شهر از دراپ داون کاستوم
        const selectCity = (city) => {
            selectedCity.value = city;
            isCityDropdownOpen.value = false;
        };

        // بستن دراپ‌داون در صورت کلیک در بیرون
        const closeCityDropdown = () => {
            isCityDropdownOpen.value = false;
        };

        // ذخیره تغییرات (شبیه‌سازی)
        const saveChanges = (type) => {
            const msgs = {
                'profile': 'اطلاعات کاربری شما با موفقیت بروزرسانی شد.',
                'security': 'رمز عبور شما با موفقیت تغییر کرد.'
            };
            addNotification('عملیات موفق', msgs[type], 'success');
        };

        return {
            ...toRefs(store),
            activeTab,
            showChargeModal,
            predefinedAmounts,
            selectedAmount,
            customAmount,
            isCityDropdownOpen,
            selectedCity,
            cities,
            purchaseHistory,
            handleLogout,
            handleChargeWallet,
            selectAmount,
            selectCity,
            closeCityDropdown,
            saveChanges
        };
    },
    template: `
        <div class="relative pt-32 pb-24 lg:pt-40 lg:pb-32 min-h-screen z-10 font-sans">
            <!-- Background decorative elements for luxury feel -->
            <div class="absolute right-0 top-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none hidden md:block animate-pulse duration-[5000ms]"></div>
            <div class="absolute left-10 bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none hidden md:block"></div>

            <div class="container mx-auto px-4 lg:px-8 relative z-20">
                <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    <!-- Sidebar Navigation (Fixed Layout) -->
                    <aside class="w-full lg:w-1/3 xl:w-1/4 shrink-0 animate-fade-up">
                        <div class="glass-panel backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden lg:sticky lg:top-28 transition-all duration-500">
                            
                            <!-- User Profile Summary -->
                            <div class="p-8 flex flex-col items-center border-b border-slate-100 dark:border-white/5 relative group">
                                <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-500/15 to-transparent transition-opacity duration-500 group-hover:opacity-100 opacity-70"></div>
                                <div class="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-brand-400 to-blue-600 shadow-glow mb-5 relative z-10 group-hover:scale-105 transition-transform duration-500">
                                    <div class="w-full h-full rounded-full border-4 border-white dark:border-dark-bg overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                        <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                </div>
                                <h2 class="text-xl font-black text-slate-800 dark:text-white mb-1.5">{{ user.name }}</h2>
                                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium dir-ltr" style="direction: ltr;">{{ user.phone }}</p>
                                <span class="mt-3 px-3 py-1 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold border border-brand-500/20">کاربر عادی</span>
                            </div>

                            <!-- Navigation Menu -->
                            <nav class="p-3 flex flex-col gap-1.5">
                                <button @click="activeTab = 'overview'" 
                                   :class="{'bg-brand-500 text-white shadow-glow': activeTab === 'overview', 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400': activeTab !== 'overview'}"
                                   class="flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all duration-300 w-full text-right group relative overflow-hidden">
                                    <div v-if="activeTab === 'overview'" class="absolute inset-0 bg-gradient-to-r from-brand-400 to-cyan-500 opacity-100 z-0"></div>
                                    <svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                    <span class="relative z-10">داشبورد من</span>
                                </button>
                                
                                <button @click="activeTab = 'profile'" 
                                   :class="{'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20': activeTab === 'profile', 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400 border border-transparent': activeTab !== 'profile'}"
                                   class="flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all duration-300 w-full text-right group">
                                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    ویرایش اطلاعات
                                </button>

                                <button @click="activeTab = 'security'" 
                                   :class="{'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20': activeTab === 'security', 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400 border border-transparent': activeTab !== 'security'}"
                                   class="flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all duration-300 w-full text-right group">
                                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    تغییر رمز عبور
                                </button>

                                <button @click="activeTab = 'venues'" 
                                   :class="{'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20': activeTab === 'venues', 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400 border border-transparent': activeTab !== 'venues'}"
                                   class="flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all duration-300 w-full text-right group">
                                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    سالن من
                                </button>

                                <div class="h-px bg-slate-100 dark:bg-white/5 my-2"></div>
                                
                                <button @click="handleLogout" class="flex items-center gap-3 px-5 py-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-all w-full text-right group border border-transparent">
                                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    خروج از حساب
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <!-- Main Dynamic Content Area (SPA Router equivalent) -->
                    <main class="w-full lg:w-2/3 xl:w-3/4 animate-fade-up delay-100 relative min-h-[500px]">
                        <transition name="fade-slide" mode="out-in">
                            
                            <!-- TAB: Overview (داشبورد من) -->
                            <div v-if="activeTab === 'overview'" key="overview" class="space-y-6">
                                
                                <!-- بنر بازطراحی شده بسیار لوکس -->
                                <div class="relative bg-slate-900 dark:bg-[#0a0f1d] rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-glow flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50 dark:border-brand-500/20 group">
                                    <!-- پترن نقطه‌ای پس‌زمینه -->
                                    <div class="absolute inset-0 opacity-[0.15]" style="background-image: radial-gradient(#94a3b8 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
                                    
                                    <!-- افکت‌های نوری (Glow) متحرک -->
                                    <div class="absolute -right-20 -top-20 w-72 h-72 bg-brand-500/20 rounded-full blur-[80px] group-hover:bg-brand-500/30 transition-all duration-700"></div>
                                    <div class="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-600/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-all duration-700"></div>
                                    
                                    <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-6">
                                        <!-- آیکون شناور -->
                                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-blue-600 flex items-center justify-center shadow-glow shrink-0 animate-[bounce_4s_infinite]">
                                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                                        </div>
                                        
                                        <div>
                                            <h3 class="text-xl md:text-[1.6rem] font-black text-white mb-3 tracking-tight">
                                                روز بخیر، {{ user.name.split(' ')[0] }}! <span class="text-brand-400">آماده یک بازی هیجان‌انگیز هستی؟</span>
                                            </h3>
                                            <p class="text-slate-300 font-medium text-sm md:text-base leading-relaxed max-w-2xl">
                                                از اینجا می‌تونی خریدهات رو با جزئیات پیگیری کنی، موجودی کیفت رو افزایش بدی یا اطلاعاتت رو مدیریت کنی.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Purchases Card -->
                                    <div @click="activeTab = 'purchases'" class="glass-panel cursor-pointer rounded-[2rem] p-8 shadow-lg hover:shadow-xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 dark:border-white/10">
                                        <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                            <div class="absolute inset-0 bg-brand-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <svg class="w-10 h-10 text-brand-500 dark:text-brand-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                        </div>
                                        <h4 class="text-2xl font-black text-slate-800 dark:text-white mb-2 relative z-10">{{ user.purchases || purchaseHistory.length }} خرید موفق</h4>
                                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10 text-center">مشاهده تاریخچه سانس‌های رزرو شده</p>
                                        <button class="w-full bg-brand-50 hover:bg-brand-500 dark:bg-brand-500/10 dark:hover:bg-brand-500 text-brand-600 dark:text-brand-400 hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10 group-hover:shadow-glow-subtle">
                                            مشاهده لیست خریدها
                                        </button>
                                    </div>

                                    <!-- Credit Card -->
                                    <div class="glass-panel rounded-[2rem] p-8 shadow-lg hover:shadow-xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 dark:border-white/10">
                                        <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                            <div class="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <svg class="w-10 h-10 text-blue-500 dark:text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <h4 class="text-2xl font-black text-slate-800 dark:text-white mb-2 relative z-10">اعتبار: {{ user.credit }} تومان</h4>
                                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10 text-center">موجودی کیف پول برای رزرو سریع‌تر</p>
                                        <button @click="showChargeModal = true" class="w-full bg-blue-50 hover:bg-blue-500 dark:bg-blue-500/10 dark:hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 relative z-10 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                            شارژ فوری حساب
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- TAB: Profile (ویرایش اطلاعات با کاستوم سلکت) -->
                            <div v-else-if="activeTab === 'profile'" key="profile" class="glass-panel rounded-[2rem] p-8 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10">
                                <div class="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                                    <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </div>
                                    <h3 class="text-2xl font-black text-slate-800 dark:text-white">ویرایش اطلاعات کاربری</h3>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام و نام خانوادگی</label>
                                        <input type="text" :value="user.name" class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" placeholder="نام خود را وارد کنید">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره موبایل (غیرقابل تغییر)</label>
                                        <input type="text" :value="user.phone" disabled class="w-full bg-slate-100 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-500 rounded-xl px-4 py-3.5 opacity-70 cursor-not-allowed text-left dir-ltr">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ایمیل (اختیاری)</label>
                                        <input type="email" class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-left dir-ltr" placeholder="example@email.com">
                                    </div>
                                    
                                    <!-- کاستوم سلکت باکس بسیار زیبا برای شهر -->
                                    <div class="relative" @blur="closeCityDropdown" tabindex="0">
                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شهر محل سکونت</label>
                                        <div @click="isCityDropdownOpen = !isCityDropdownOpen" 
                                             class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all duration-300"
                                             :class="{'border-brand-500 ring-1 ring-brand-500': isCityDropdownOpen}">
                                            <span class="font-bold">{{ selectedCity }}</span>
                                            <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': isCityDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                        
                                        <transition name="dropdown">
                                            <div v-if="isCityDropdownOpen" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                <div v-for="city in cities" :key="city" 
                                                     @click.stop="selectCity(city)" 
                                                     class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center justify-between group">
                                                    {{ city }}
                                                    <svg v-if="selectedCity === city" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                    <span v-else class="w-2 h-2 rounded-full bg-transparent group-hover:bg-brand-500/30 transition-colors"></span>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>

                                </div>
                                    <div class="mt-8 flex flex-col sm:flex-row sm:justify-end">
                                        <button @click="saveChanges('profile')" class="w-full sm:w-auto bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                            ذخیره تغییرات
                                        </button>
                                    </div>
                            </div>

                            <!-- TAB: Security (بازطراحی بخش تغییر رمز عبور) -->
                            <div v-else-if="activeTab === 'security'" key="security" class="glass-panel rounded-[2rem] p-8 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 overflow-hidden relative">
                                <div class="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6 relative z-10">
                                    <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <h3 class="text-2xl font-black text-slate-800 dark:text-white">تغییر رمز عبور</h3>
                                </div>
                                
                                <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center relative z-10">
                                    <!-- گرافیک سپر امنیتی (سمت راست در حالت راست‌چین) -->
                                    <div class="hidden lg:flex lg:col-span-2 flex-col items-center justify-center relative">
                                        <div class="absolute inset-0 bg-brand-500/20 rounded-full blur-[60px] animate-pulse"></div>
                                        <svg class="w-48 h-48 text-brand-500/80 dark:text-brand-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>

                                    <!-- فرم تغییر رمز (سمت چپ در حالت راست‌چین) -->
                                    <div class="lg:col-span-3 space-y-6 bg-slate-50/50 dark:bg-dark-bg/30 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <div>
                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رمز عبور فعلی</label>
                                            <input type="password" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-left dir-ltr shadow-sm" placeholder="••••••••">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رمز عبور جدید</label>
                                            <input type="password" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-left dir-ltr shadow-sm" placeholder="••••••••">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تکرار رمز عبور جدید</label>
                                            <input type="password" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-left dir-ltr shadow-sm" placeholder="••••••••">
                                        </div>
                                            <div class="pt-4 flex flex-col sm:flex-row sm:justify-end">
                                                <button @click="saveChanges('security')" class="w-full sm:w-auto bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    بروزرسانی رمز عبور
                                                </button>
                                            </div>
                                    </div>
                                </div>
                            </div>

                            <!-- TAB: Venues (سالن من - طرح خالی) -->
                            <div v-else-if="activeTab === 'venues'" key="venues" class="glass-panel rounded-[2rem] p-8 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center min-h-[400px] text-center">
                                <div class="w-40 h-40 mb-6 relative">
                                    <div class="absolute inset-0 bg-brand-500/20 rounded-full blur-2xl animate-pulse"></div>
                                    <!-- گرافیک جذاب و مدرن برای خالی بودن لیست -->
                                    <svg class="w-full h-full text-slate-300 dark:text-slate-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-3">شما هنوز سالنی ثبت نکرده‌اید!</h3>
                                <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md">اگر مدیریت یک مجموعه ورزشی را بر عهده دارید، با ثبت آن در رزرو اسپورت، سیستم مدیریت آنلاین خود را راه‌اندازی کنید.</p>
                                <button class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    ثبت سالن جدید
                                </button>
                            </div>

                            <!-- TAB: Purchases (تاریخچه خرید) -->
                            <div v-else-if="activeTab === 'purchases'" key="purchases" class="glass-panel rounded-[2rem] p-8 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10">
                                <div class="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                        </div>
                                        <h3 class="text-2xl font-black text-slate-800 dark:text-white">تاریخچه خریدهای شما</h3>
                                    </div>
                                    <button @click="activeTab = 'overview'" class="text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                                        بازگشت
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    </button>
                                </div>
                                
                                <div class="space-y-4">
                                    <!-- List items -->
                                    <div v-for="item in purchaseHistory" :key="item.id" class="bg-slate-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-white/5 rounded-2xl p-5 hover:border-brand-500/30 hover:shadow-glow-subtle transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                        <div class="flex items-center gap-4">
                                            <div class="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">{{ item.venueName }}</h4>
                                                <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ item.date }}</span>
                                                    <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                    <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ item.time }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between md:flex-col md:items-end gap-2 border-t border-slate-100 dark:border-white/5 md:border-0 pt-3 md:pt-0">
                                            <div class="text-brand-600 dark:text-brand-400 font-black text-lg">{{ item.price }} <span class="text-xs font-normal text-slate-500">تومان</span></div>
                                            <span class="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-md text-xs font-bold">{{ item.status }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </main>
                </div>
            </div>

            <!-- Modal: Charge Wallet -->
            <transition name="fade-slide">
                <div v-if="showChargeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showChargeModal = false"></div>
                    
                    <!-- Modal Content -->
                    <div class="relative glass-panel bg-white/95 dark:bg-dark-card/95 w-full max-w-md rounded-3xl shadow-2xl p-6 lg:p-8 border border-slate-200 dark:border-white/10 animate-fade-up">
                        <button @click="showChargeModal = false" class="absolute top-4 left-4 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-white/5 p-2 rounded-full transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <div class="text-center mb-8">
                            <div class="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-2">افزایش موجودی</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400">مبلغ مورد نظر خود را برای شارژ کیف پول انتخاب کنید.</p>
                        </div>

                        <!-- Quick select amounts -->
                        <div class="grid grid-cols-2 gap-3 mb-6">
                            <button v-for="amount in predefinedAmounts" :key="amount"
                                @click="selectAmount(amount)"
                                :class="{'bg-blue-500 text-white shadow-glow': selectedAmount === amount, 'bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 hover:border-blue-500': selectedAmount !== amount}"
                                class="py-3 rounded-xl font-bold transition-all duration-300">
                                {{ amount }} <span class="text-[10px] opacity-80 font-normal">تومان</span>
                            </button>
                        </div>

                        <div class="relative mb-8">
                            <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <span class="text-slate-400 font-bold">تومان</span>
                            </div>
                            <input v-model="customAmount" @focus="selectedAmount = ''" type="text" placeholder="مبلغ دلخواه..." class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 pr-14 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-left dir-ltr font-bold text-lg">
                        </div>

                        <button @click="handleChargeWallet" class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black py-4 rounded-xl shadow-glow transition-all hover:scale-[1.02] active:scale-95 text-lg">
                            پرداخت و شارژ
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    `
}