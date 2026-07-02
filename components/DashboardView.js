import { store, addNotification } from './store.js';

export default {
    setup() {
        const { ref, toRefs, computed, watch } = window.Vue;

        // مدیریت وضعیت تب‌های داشبورد (SPA Routing)
        const activeTab = ref('overview'); // overview | profile | security | venues | purchases | register
        const userVenueStatus = ref('active'); // وضعیت‌ها: 'none' (بدون سالن)، 'pending' (در انتظار تایید)، 'active' (تایید شده)
        
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

        // --- بخش جدید: مدیریت سالن ---
        const showManagementPanel = ref(false);
        const userVenue = ref({
            name: 'مجموعه ورزشی الماس (سالن فوتسال VIP)',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
            address: 'قم، سالاریه، بلوار امین، مجتمع ورزشی الماس، طبقه همکف',
            rating: '۴.۹',
            reviewsCount: '۱۲۸ نظر',
            status: 'فعال'
        });

        // -----------------------------------------------------------------
        // -- لاجیک بازطراحی شده تقویم ماهانه و مدیریت سانس‌های گام‌به‌گام --
        // -----------------------------------------------------------------

        const persianMonths = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        
        const weekdays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

        // متغیرهای وضعیت تقویم ماهانه
        const calendarYear = ref(1405);
        const calendarMonthIndex = ref(3); // تیر ماه به عنوان پیش‌فرض
        const selectedManageDay = ref(null); // روز انتخاب شده جهت نمایش سانس‌ها
        const dayTimeslots = ref([]);

        // محاسبه تعداد روزهای هر ماه در سال ۱۴۰۵
        const getDaysInMonth = (monthIdx) => {
            if (monthIdx < 6) return 31; // نیمه اول سال ۳۱ روزه
            if (monthIdx < 11) return 30; // نیمه دوم سال ۳۰ روزه
            return 29; // اسفند ۱۴۰۵ غیرکبیسه و ۲۹ روزه است
        };

        // تقریب شروع روزهای هفته در سال ۱۴۰۵ (۱ فروردین ۱۴۰۵ مصادف با جمعه است)
        // این تابع اندیس شروع روز در گرید هفتگی (۰ برای شنبه تا ۶ برای جمعه) را بازمی‌گرداند
        const getMonthStartWeekday = (monthIdx) => {
            let totalDays = 0;
            for (let i = 0; i < monthIdx; i++) {
                totalDays += getDaysInMonth(i);
            }
            // اول فروردین جمعه (اندیس ۶) است.
            return (6 + totalDays) % 7;
        };

        // روزهای ماه جاری برای نمایش در گرید
        const currentMonthDays = computed(() => {
            const daysCount = getDaysInMonth(calendarMonthIndex.value);
            const startOffset = getMonthStartWeekday(calendarMonthIndex.value);
            const daysArray = [];

            // خانه‌های خالی ابتدای تقویم برای تراز شدن روزهای هفته
            for (let i = 0; i < startOffset; i++) {
                daysArray.push({ isPlaceholder: true });
            }

            // تولید روزهای واقعی ماه
            for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
                const dayOfWeekIndex = (startOffset + dayNum - 1) % 7;
                daysArray.push({
                    isPlaceholder: false,
                    dayNumber: dayNum,
                    weekdayName: weekdays[dayOfWeekIndex],
                    status: dayOfWeekIndex === 6 ? 'closed' : 'active', // جمعه‌ها تعطیل پیش‌فرض
                    isToday: calendarMonthIndex.value === 3 && dayNum === 12 // شبیه‌سازی ۱۲ تیر به عنوان امروز
                });
            }

            return daysArray;
        });

        // عنوان بالای تقویم (نام ماه و سال)
        const currentMonthLabel = computed(() => {
            return `${persianMonths[calendarMonthIndex.value]} ${calendarYear.value}`;
        });

        const goPrevMonth = () => {
            selectedManageDay.value = null; // ریست وضعیت سانس انتخابی
            if (calendarMonthIndex.value === 0) {
                calendarMonthIndex.value = 11;
                calendarYear.value--;
            } else {
                calendarMonthIndex.value--;
            }
        };

        const goNextMonth = () => {
            selectedManageDay.value = null;
            if (calendarMonthIndex.value === 11) {
                calendarMonthIndex.value = 0;
                calendarYear.value++;
            } else {
                calendarMonthIndex.value++;
            }
        };

        const selectDayForManage = (day) => {
            if (day.isPlaceholder) return;
            selectedManageDay.value = day;
            
            // شبیه‌سازی هوشمند سانس‌های روز انتخابی بر اساس زوج یا فرد بودن تاریخ یا تعطیلی روز
            if (day.status === 'closed') {
                dayTimeslots.value = [
                    { id: 1, time: '۰۸:۰۰ تا ۰۹:۳۰', status: 'closed', reason: 'تعطیل رسمی هفتگی' },
                    { id: 2, time: '۰۹:۳۰ تا ۱۱:۰۰', status: 'closed', reason: 'تعطیل رسمی هفتگی' },
                    { id: 3, time: '۱۱:۰۰ تا ۱۲:۳۰', status: 'closed', reason: 'تعطیل رسمی هفتگی' },
                    { id: 4, time: '۱۳:۰۰ تا ۱۴:۳۰', status: 'closed', reason: 'تعطیل رسمی هفتگی' },
                    { id: 5, time: '۱۴:۳۰ تا ۱۶:۰۰', status: 'closed', reason: 'تعطیل رسمی هفتگی' }
                ];
            } else {
                dayTimeslots.value = [
                    { id: 1, time: '۰۸:۰۰ تا ۰۹:۳۰', status: 'free' },
                    { id: 2, time: '۰۹:۳۰ تا ۱۱:۰۰', status: day.dayNumber % 2 === 0 ? 'booked' : 'free', user: 'علی محمدی' },
                    { id: 3, time: '۱۱:۰۰ تا ۱۲:۳۰', status: day.dayNumber % 3 === 0 ? 'closed' : 'free', reason: 'سرویس ادواری سالن' },
                    { id: 4, time: '۱۳:۰۰ تا ۱۴:۳۰', status: 'free' },
                    { id: 5, time: '۱۴:۳۰ تا ۱۶:۰۰', status: 'free' },
                    { id: 6, time: '۱۶:۰۰ تا ۱۷:۳۰', status: 'booked', user: 'علیرضا تقوی' },
                    { id: 7, time: '۱۷:۳۰ تا ۱۹:۰۰', status: 'free' },
                    { id: 8, time: '۱۹:۰۰ تا ۲۰:۳۰', status: 'free' },
                    { id: 9, time: '۲۰:۳۰ تا ۲۲:۰۰', status: 'free' }
                ];
            }
        };

        // -----------------------------------------------------------------
        // -- لاجیک بازطراحی فرم مسدودسازی با کامپوننت‌های سلکت سفارشی --
        // -----------------------------------------------------------------

        // وضعیت باز و بسته بودن دراپ‌دان‌های سفارشی فرم مسدودسازی
        const activeDropdown = ref(''); // 'day' | 'month' | 'year' | 'time' | 'reason' | ''
        
        const closeForm = ref({
            day: '',
            month: '',
            year: '۱۴۰۵',
            time: '',
            reason: ''
        });

        const closeReasons = ['تعمیرات', 'رزرو تلفنی', 'مسابقه', 'سرویس سالن', 'سایر'];
        const availableSlotsForClose = [
            '۰۸:۰۰ تا ۰۹:۳۰', '۰۹:۳۰ تا ۱۱:۰۰', '۱۱:۰۰ تا ۱۲:۳۰', 
            '۱۳:۰۰ تا ۱۴:۳۰', '۱۴:۳۰ تا ۱۶:۰۰', '۱۶:۰۰ تا ۱۷:۳۰', 
            '۱۷:۳۰ تا ۱۹:۰۰', '۱۹:۰۰ تا ۲۰:۳۰', '۲۰:۳۰ تا ۲۲:۰۰'
        ];

        // مانیتور کردن تغییر ماه جهت به‌روزرسانی روزهای معتبر فرم مسدودسازی
        const closeFormDays = computed(() => {
            if (!closeForm.value.month) return [];
            const monthIdx = persianMonths.indexOf(closeForm.value.month);
            const daysCount = getDaysInMonth(monthIdx);
            return Array.from({ length: daysCount }, (_, i) => String(i + 1));
        });

        const toggleDropdown = (name) => {
            if (activeDropdown.value === name) {
                activeDropdown.value = '';
            } else {
                activeDropdown.value = name;
            }
        };

        const selectDropdownValue = (field, val) => {
            closeForm.value[field] = val;
            activeDropdown.value = '';
            // در صورت تغییر ماه، روز نامعتبر (مثلاً ۳۱ ام در ماه ۳۰ روزه) پاک شود
            if (field === 'month') {
                closeForm.value.day = '';
            }
        };

        const closingAnnouncements = ref([
            { id: 1, text: 'سانس ساعت ۱۴:۰۰ تا ۱۵:۳۰ روز پنج‌شنبه به علت سرویس دوره‌ای سالن بسته است.', date: '۱۴۰۵/۰۴/۰۲' }
        ]);

        const submitCloseSlot = () => {
            const { day, month, year, time, reason } = closeForm.value;
            if (!day || !month || !year || !time || !reason) {
                addNotification('خطا', 'لطفاً تمامی فیلدها را با کلیک روی آنها انتخاب کنید.', 'error');
                return;
            }
            closingAnnouncements.value.push({
                id: Date.now(),
                text: `سانس ${time} در تاریخ ${day} ${month} ${year} به علت "${reason}" توسط مدیریت مسدود شد.`,
                date: 'همین الان'
            });
            addNotification('محدودیت اعمال شد', 'سانس انتخاب شده با موفقیت مسدود گردید.', 'success');
            
            // ریست فرم
            closeForm.value = {
                day: '',
                month: '',
                year: '۱۴۰۵',
                time: '',
                reason: ''
            };
        };

        const removeClosingTime = (id) => {
            closingAnnouncements.value = closingAnnouncements.value.filter(item => item.id !== id);
            addNotification('حذف محدودیت', 'سانس مورد نظر مجدداً بازگشایی شد.', 'success');
        };

        // ----------------------------------------------------

        // درخواست‌های رزرو در انتظار بررسی (بیعانه یا پرداخت کامل) - بدون تغییر
        const bookingRequests = ref([
            { id: 101, userName: 'علیرضا تقوی', date: '۱۴۰۵/۰۴/۰۵', time: '۱۸:۰۰ تا ۱۹:۳۰', paymentType: 'بیعانه', paidAmount: '۲۵۰,۰۰۰', totalPrice: '۷۰۰,۰۰۰', phone: '09123456789' },
            { id: 102, userName: 'مرتضی هاشمی', date: '۱۴۰۵/۰۴/۰۶', time: '۲۰:۰۰ تا ۲۱:۳۰', paymentType: 'پرداخت کامل', paidAmount: '۷۵۰,۰۰۰', totalPrice: '۷۵۰,۰۰۰', phone: '09198765432' }
        ]);

        // تایید یا رد درخواست‌های سانس کاربران - بدون تغییر
        const handleRequestAction = (id, action) => {
            const req = bookingRequests.value.find(r => r.id === id);
            if (req) {
                if (action === 'approved') {
                    addNotification('درخواست تایید شد', `سانس رزرو شده توسط ${req.userName} با موفقیت تایید و قطعی شد.`, 'success');
                } else {
                    addNotification('درخواست رد شد', `درخواست سانس رزرو شده توسط ${req.userName} لغو و وجه استرداد داده می‌شود.`, 'error');
                }
                bookingRequests.value = bookingRequests.value.filter(r => r.id !== id);
            }
        };

        // عملیات خروج از حساب - بدون تغییر
        const handleLogout = () => {
            store.currentView = 'home';
            addNotification('خروج موفقیت‌آمیز', 'شما با موفقیت از سیستم خارج شدید.', 'success');
        };

        // عملیات شارژ کیف پول - بدون تغییر
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

        // تنظیم مبلغ انتخابی برای مودال - بدون تغییر
        const selectAmount = (amount) => {
            selectedAmount.value = amount;
            customAmount.value = '';
        };

        // انتخاب شهر از دراپ داون کاستوم - بدون تغییر
        const selectCity = (city) => {
            selectedCity.value = city;
            isCityDropdownOpen.value = false;
        };

        // بستن دراپ‌داون در صورت کلیک در بیرون - بدون تغییر
        const closeCityDropdown = () => {
            isCityDropdownOpen.value = false;
        };

        // ذخیره تغییرات (شبیه‌سازی) - بدون تغییر
        const saveChanges = (type) => {
            const msgs = {
                'profile': 'اطلاعات کاربری شما با موفقیت بروزرسانی شد.',
                'security': 'رمز عبور شما با موفقیت تغییر کرد.'
            };
            addNotification('عملیات موفق', msgs[type], 'success');
        };

        // اتمام ثبت سالن و بازگشت به داشبورد - بدون تغییر
        const handleRegistrationComplete = () => {
            userVenueStatus.value = 'pending';
            activeTab.value = 'venues';
        };

        return {
            ...toRefs(store),
            activeTab,
            userVenueStatus,
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
            saveChanges,
            handleRegistrationComplete,
            
            // اکسپوز دیتای بازطراحی شده تقویم و پنل مدیریت
            showManagementPanel,
            userVenue,
            calendarYear,
            calendarMonthIndex,
            currentMonthDays,
            currentMonthLabel,
            selectedManageDay,
            dayTimeslots,
            goPrevMonth,
            goNextMonth,
            selectDayForManage,
            
            // فیلدهای فرم جدید مسدودسازی سانس
            activeDropdown,
            closeForm,
            persianMonths,
            closeFormDays,
            closeReasons,
            availableSlotsForClose,
            closingAnnouncements,
            toggleDropdown,
            selectDropdownValue,
            submitCloseSlot,
            removeClosingTime,
            
            // درخواست‌ها
            bookingRequests,
            handleRequestAction
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

                            <!-- TAB: Venues (سالن من - همراه با کارت عرضی و پنل مدیریت هوشمند) -->
                            <div v-else-if="activeTab === 'venues'" key="venues" class="space-y-6">
                                
                                <!-- بخش بالای تب شامل تیتر و دکمه جدید افزودن سالن -->
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-dark-card/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm">
                                    <div>
                                        <h3 class="text-2xl font-black text-slate-800 dark:text-white">مدیریت سالن‌های من</h3>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">سالن ثبت‌شده خود را مدیریت کنید یا سالن جدیدی اضافه نمایید.</p>
                                    </div>
                                    <button @click="activeTab = 'register'" class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-black py-3 px-6 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                                        افزودن سالن
                                    </button>
                                </div>

                                <!-- حالت در انتظار تایید -->
                                <div v-if="userVenueStatus === 'pending'" class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-sm animate-fade-up">
                                    <div class="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6 relative">
                                        <div class="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
                                        <svg class="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h4 class="text-2xl font-black text-amber-800 dark:text-amber-400 mb-2">سالن شما در انتظار تایید است</h4>
                                    <p class="text-slate-600 dark:text-amber-500/80 font-medium max-w-lg mx-auto">
                                        مدارک و اطلاعات سالن شما دریافت شد و هم‌اکنون توسط کارشناسان ما در حال بررسی می‌باشد. نتیجه بررسی به زودی از طریق پیامک به شما اطلاع داده خواهد شد.
                                    </p>
                                </div>

                                <!-- کارت عرضی نمایش مشخصات سالن -->
                                <div v-if="userVenueStatus === 'active'" @click="showManagementPanel = !showManagementPanel" 
                                     class="glass-panel rounded-[2rem] p-6 shadow-xl border border-slate-200 dark:border-white/10 hover:border-brand-500/50 cursor-pointer transition-all duration-300 hover:shadow-glow-subtle flex flex-col md:flex-row items-center gap-6 group relative overflow-hidden">
                                    
                                    <!-- افکت نوری پس‌زمینه کارت -->
                                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all duration-500"></div>

                                    <!-- تصویر سالن -->
                                    <div class="w-full md:w-44 h-32 rounded-2xl overflow-hidden shadow-md shrink-0 relative group-hover:scale-[1.02] transition-transform duration-500">
                                        <img :src="userVenue.image" alt="Venue Image" class="w-full h-full object-cover">
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <span class="absolute bottom-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                            {{ userVenue.status }}
                                        </span>
                                    </div>

                                    <!-- جزئیات متنی سالن -->
                                    <div class="flex-1 w-full text-center md:text-right space-y-2">
                                        <h4 class="text-xl font-black text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">{{ userVenue.name }}</h4>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1">
                                            <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {{ userVenue.address }}
                                        </p>
                                        <div class="flex items-center justify-center md:justify-start gap-4 pt-1">
                                            <span class="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                {{ userVenue.rating }}
                                            </span>
                                            <span class="text-xs text-slate-400 font-medium">{{ userVenue.reviewsCount }}</span>
                                        </div>
                                    </div>

                                    <!-- آیکون وضعیت بازشونده پنل -->
                                    <div class="bg-slate-100 dark:bg-white/5 p-3 rounded-full text-slate-400 group-hover:text-brand-500 transition-colors shrink-0">
                                        <svg class="w-6 h-6 transition-transform duration-300" :class="{'rotate-180': showManagementPanel}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                <!-- پنل مدیریت سالن بازطراحی شده -->
                                <transition name="fade-slide">
                                    <div v-if="showManagementPanel && userVenueStatus === 'active'" class="space-y-6 animate-fade-up">
                                        
                                        <!-- بخش اول: تقویم مدیریت سانس‌های ماهانه با طراحی فوق پرمیوم -->
                                        <div class="glass-panel rounded-[2rem] p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-white/10 space-y-6">
                                            
                                            <!-- هدر تقویم و سوییچر ماه‌ها -->
                                            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                                                <div class="flex items-center gap-2">
                                                    <svg class="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    <h5 class="font-black text-slate-800 dark:text-white text-lg">تقویم مدیریت سانس‌ها</h5>
                                                </div>

                                                <!-- Month/Year Navigator -->
                                                <div class="flex items-center bg-slate-100/50 dark:bg-dark-bg/50 rounded-xl p-1.5 border border-slate-200/60 dark:border-white/5">
                                                    <button @click="goPrevMonth" class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all flex items-center text-slate-500 dark:text-slate-400 hover:text-brand-500 shadow-sm">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                                    </button>
                                                    <span class="px-6 font-bold text-base text-slate-800 dark:text-slate-200 min-w-[150px] text-center">{{ currentMonthLabel }}</span>
                                                    <button @click="goNextMonth" class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all flex items-center text-slate-500 dark:text-slate-400 hover:text-brand-500 shadow-sm">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- گرید اصلی تقویم ماهانه -->
                                            <transition name="fade-slide" mode="out-in">
                                                <div v-if="!selectedManageDay" key="month-view" class="space-y-4">
                                                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        جهت مشاهده، تخصیص وضعیت یا لغو و مسدودسازی سانس‌های هر روز، لطفا روی خانه آن روز در جدول زیر کلیک کنید.
                                                    </p>
                                                    
                                                    <!-- روزهای هفته به عنوان راهنمای ستون‌ها -->
                                                    <div class="grid grid-cols-7 gap-2 text-center border-b border-slate-100 dark:border-white/5 pb-2">
                                                        <span v-for="w in weekdays" :key="w" class="text-xs font-bold text-slate-400 dark:text-slate-500">{{ w.substring(0, 3) }}</span>
                                                    </div>

                                                    <!-- خانه روزهای ماه -->
                                                    <div class="grid grid-cols-7 gap-2.5">
                                                        <div v-for="(day, idx) in currentMonthDays" :key="idx"
                                                             @click="!day.isPlaceholder && selectDayForManage(day)"
                                                             class="aspect-square rounded-2xl p-2 flex flex-col items-center justify-between border transition-all duration-300 relative group"
                                                             :class="[
                                                                 day.isPlaceholder ? 'opacity-0 cursor-default pointer-events-none' : 'cursor-pointer hover:-translate-y-1 hover:shadow-glow-subtle',
                                                                 day.isToday ? 'bg-gradient-to-tr from-brand-500 to-cyan-500 text-white border-transparent ring-4 ring-brand-500/20' : 'bg-slate-50/40 dark:bg-dark-bg/20 border-slate-200 dark:border-white/10 hover:border-brand-500/50',
                                                                 day.status === 'closed' && !day.isToday ? 'border-red-500/20 hover:border-red-500/40' : ''
                                                             ]">
                                                            
                                                             <!-- شماره روز -->
                                                             <span v-if="!day.isPlaceholder" 
                                                                   class="text-base font-black"
                                                                   :class="day.isToday ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
                                                                 {{ day.dayNumber }}
                                                             </span>
                                                             
                                                             <!-- نشانگر وضعیت روز -->
                                                             <div v-if="!day.isPlaceholder" class="flex items-center gap-1">
                                                                 <span class="w-1.5 h-1.5 rounded-full shadow-sm" 
                                                                       :class="day.status === 'closed' ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'">
                                                                 </span>
                                                                 <span class="text-[9px] font-bold hidden sm:inline" 
                                                                       :class="day.isToday ? 'text-white/90' : (day.status === 'closed' ? 'text-red-500' : 'text-emerald-500')">
                                                                     {{ day.status === 'closed' ? 'تعطیل' : 'فعال' }}
                                                                 </span>
                                                             </div>

                                                             <!-- برچسب امروز -->
                                                             <span v-if="day.isToday" class="absolute -top-1.5 -left-1.5 bg-yellow-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">امروز</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- نمای تفصیلی سانس‌های روز انتخاب شده -->
                                                <div v-else key="day-view" class="space-y-4">
                                                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50 dark:bg-brand-500/10 p-4 rounded-2xl border border-brand-500/20">
                                                        <div>
                                                            <h6 class="font-black text-brand-800 dark:text-brand-400 text-sm">
                                                                برنامه زمان‌بندی و وضعیت سانس‌ها
                                                            </h6>
                                                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                سانس‌های روز {{ selectedManageDay.weekdayName }} {{ selectedManageDay.dayNumber }} {{ currentMonthLabel }}
                                                            </p>
                                                        </div>
                                                        <button @click="selectedManageDay = null" class="w-full sm:w-auto text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-white dark:hover:bg-dark-bg px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm border border-brand-500/10 hover:scale-[1.02]">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                                            بازگشت به تقویم ماهانه
                                                        </button>
                                                    </div>

                                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        <div v-for="slot in dayTimeslots" :key="slot.id"
                                                             class="p-4 rounded-2xl border flex flex-col gap-2.5 transition-all relative overflow-hidden group hover:shadow-md"
                                                             :class="{
                                                                 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-500/5': slot.status === 'free',
                                                                 'border-red-200 dark:border-red-500/20 bg-red-50/20 dark:bg-red-500/5': slot.status === 'booked',
                                                                 'border-slate-200 dark:border-slate-600/30 bg-slate-100/50 dark:bg-slate-800/30': slot.status === 'closed'
                                                             }">
                                                             <div class="flex items-center justify-between relative z-10">
                                                                 <span class="font-black text-slate-800 dark:text-white dir-ltr text-right tracking-wider text-sm">{{ slot.time }}</span>
                                                                 <span class="text-[10px] px-2.5 py-1 rounded-lg font-black flex items-center gap-1"
                                                                       :class="{
                                                                           'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400': slot.status === 'free',
                                                                           'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400': slot.status === 'booked',
                                                                           'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300': slot.status === 'closed'
                                                                       }">
                                                                       <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="slot.status === 'free' ? 'bg-emerald-500' : slot.status === 'booked' ? 'bg-red-500' : 'bg-slate-500'"></span>
                                                                       {{ slot.status === 'free' ? 'آزاد' : slot.status === 'booked' ? 'رزرو شده' : 'بسته شده' }}
                                                                 </span>
                                                             </div>
                                                             <div v-if="slot.status === 'booked'" class="text-xs text-red-600/80 dark:text-red-400/80 font-bold mt-0.5 relative z-10 flex items-center gap-1.5">
                                                                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                                رزرو شده توسط: {{ slot.user }}
                                                             </div>
                                                             <div v-if="slot.status === 'closed'" class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5 relative z-10 flex items-center gap-1.5">
                                                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                                                علت مسدودسازی: {{ slot.reason }}
                                                             </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- بخش دوم: فرم جدید و بسیار لوکس مسدودسازی اضطراری سانس با فیلدهای سه‌گانه مجزا -->
                                        <div class="glass-panel rounded-[2rem] p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-white/10 space-y-6">
                                            <div class="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                                                <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                <h5 class="font-black text-slate-800 dark:text-white">بستن موقت و محدودسازی سانس‌ها</h5>
                                            </div>
                                            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                در صورت نیاز به کارهای فنی سالن، رزروهای سنتی تلفنی یا مسابقات خاص، می‌توانید با استفاده از بخش زیر هر کدام از سانس‌ها را غیرفعال کنید.
                                            </p>

                                            <!-- فیلدهای سه‌گانه مجزای انتخاب تاریخ با دراپ‌داون پرمیوم سفارشی -->
                                            <div class="space-y-4">
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">تاریخ مسدودسازی سانس</label>
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    
                                                    <!-- انتخاب سال -->
                                                    <div class="relative">
                                                        <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">سال</span>
                                                        <div @click="toggleDropdown('year')" 
                                                             class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500"
                                                             :class="{'border-brand-500 ring-2 ring-brand-500/20': activeDropdown === 'year'}">
                                                            <span class="font-bold">{{ closeForm.year || 'انتخاب سال...' }}</span>
                                                            <svg class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeDropdown === 'year'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </div>
                                                        <transition name="dropdown">
                                                            <div v-if="activeDropdown === 'year'" class="absolute left-0 right-0 mt-1.5 bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-40 overflow-y-auto">
                                                                <div v-for="y in ['۱۴۰۴', '۱۴۰۵', '۱۴۰۶']" :key="y"
                                                                     @click="selectDropdownValue('year', y)"
                                                                     class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">
                                                                    {{ y }}
                                                                </div>
                                                            </div>
                                                        </transition>
                                                    </div>

                                                    <!-- انتخاب ماه -->
                                                    <div class="relative">
                                                        <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">ماه</span>
                                                        <div @click="toggleDropdown('month')" 
                                                             class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500"
                                                             :class="{'border-brand-500 ring-2 ring-brand-500/20': activeDropdown === 'month'}">
                                                            <span class="font-bold">{{ closeForm.month || 'انتخاب ماه...' }}</span>
                                                            <svg class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeDropdown === 'month'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </div>
                                                        <transition name="dropdown">
                                                            <div v-if="activeDropdown === 'month'" class="absolute left-0 right-0 mt-1.5 bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                                <div v-for="m in persianMonths" :key="m"
                                                                     @click="selectDropdownValue('month', m)"
                                                                     class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">
                                                                    {{ m }}
                                                                </div>
                                                            </div>
                                                        </transition>
                                                    </div>

                                                    <!-- انتخاب روز -->
                                                    <div class="relative">
                                                        <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">روز</span>
                                                        <div @click="closeForm.month ? toggleDropdown('day') : addNotification('هشدار', 'لطفاً ابتدا ماه را انتخاب کنید.', 'info')" 
                                                             class="w-full border text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors"
                                                             :class="[
                                                                 closeForm.month ? 'bg-slate-50/70 dark:bg-dark-bg/60 border-slate-200 dark:border-white/10 cursor-pointer hover:border-brand-500' : 'bg-slate-100/50 dark:bg-dark-bg/20 border-slate-200 dark:border-white/5 cursor-not-allowed opacity-60',
                                                                 activeDropdown === 'day' ? 'border-brand-500 ring-2 ring-brand-500/20' : ''
                                                             ]">
                                                            <span class="font-bold">{{ closeForm.day || 'انتخاب روز...' }}</span>
                                                            <svg class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeDropdown === 'day'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </div>
                                                        <transition name="dropdown">
                                                            <div v-if="activeDropdown === 'day' && closeFormDays.length > 0" class="absolute left-0 right-0 mt-1.5 bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                                <div v-for="d in closeFormDays" :key="d"
                                                                     @click="selectDropdownValue('day', d)"
                                                                     class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">
                                                                    {{ d }}
                                                                </div>
                                                            </div>
                                                        </transition>
                                                    </div>

                                                </div>
                                            </div>

                                            <!-- انتخاب سانس و علت مسدودسازی با منوهای پرمیوم سفارشی -->
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                
                                                <!-- انتخاب سانس -->
                                                <div class="relative">
                                                    <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">انتخاب محدوده سانس</span>
                                                    <div @click="toggleDropdown('time')" 
                                                         class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500"
                                                         :class="{'border-brand-500 ring-2 ring-brand-500/20': activeDropdown === 'time'}">
                                                        <span class="font-bold dir-ltr tracking-wide text-right w-full block">{{ closeForm.time || 'انتخاب سانس زمانی...' }}</span>
                                                        <svg class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeDropdown === 'time'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                    <transition name="dropdown">
                                                        <div v-if="activeDropdown === 'time'" class="absolute left-0 right-0 mt-1.5 bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                            <div v-for="t in availableSlotsForClose" :key="t"
                                                                 @click="selectDropdownValue('time', t)"
                                                                 class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors dir-ltr text-right">
                                                                {{ t }}
                                                            </div>
                                                        </div>
                                                    </transition>
                                                </div>

                                                <!-- علت مسدودسازی -->
                                                <div class="relative">
                                                    <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">علت مسدودسازی</span>
                                                    <div @click="toggleDropdown('reason')" 
                                                         class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500"
                                                         :class="{'border-brand-500 ring-2 ring-brand-500/20': activeDropdown === 'reason'}">
                                                        <span class="font-bold">{{ closeForm.reason || 'انتخاب علت...' }}</span>
                                                        <svg class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeDropdown === 'reason'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                    <transition name="dropdown">
                                                        <div v-if="activeDropdown === 'reason'" class="absolute left-0 right-0 mt-1.5 bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                            <div v-for="r in closeReasons" :key="r"
                                                                 @click="selectDropdownValue('reason', r)"
                                                                 class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">
                                                                {{ r }}
                                                            </div>
                                                        </div>
                                                    </transition>
                                                </div>

                                            </div>

                                            <div class="flex justify-end pt-2">
                                                <button @click="submitCloseSlot" class="w-full sm:w-auto px-8 bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-glow hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                                    ثبت و اعمال مسدودسازی سانس
                                                </button>
                                            </div>
                                        </div>

                                        <!-- لیست محدودیت‌های اعمال شده اضطراری جاری -->
                                        <div v-if="closingAnnouncements.length > 0" class="glass-panel rounded-[2rem] p-6 shadow-lg border border-slate-200 dark:border-white/10 space-y-3">
                                            <h6 class="text-sm font-bold text-slate-700 dark:text-slate-300">سانس‌های مسدود شده فعال جاری:</h6>
                                            <div class="space-y-2.5">
                                                <div v-for="ann in closingAnnouncements" :key="ann.id" class="flex items-center justify-between p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs transition-colors hover:bg-amber-500/10">
                                                    <div class="flex items-center gap-2 text-slate-700 dark:text-amber-300">
                                                        <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                        <span class="font-bold leading-relaxed">{{ ann.text }}</span>
                                                    </div>
                                                    <button @click="removeClosingTime(ann.id)" class="text-red-500 hover:text-red-600 font-bold px-3.5 py-1.5 bg-red-500/10 rounded-lg transition-colors whitespace-nowrap shrink-0">
                                                        حذف و بازگشایی
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- بخش سوم: بررسی درخواست‌های تایید سانس کاربری (پرداخت کامل / بیعانه) - بدون تغییر -->
                                        <div class="glass-panel rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-white/10 space-y-4">
                                            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                                                <div class="flex items-center gap-2">
                                                    <div class="status-pulse"></div>
                                                    <h5 class="font-black text-slate-800 dark:text-white">درخواست‌های رزرواسیون در انتظار تایید شما</h5>
                                                </div>
                                                <span class="text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full font-bold">
                                                    {{ bookingRequests.length }} درخواست جدید
                                                </span>
                                            </div>

                                            <div v-if="bookingRequests.length === 0" class="text-center py-8 text-slate-400 text-sm font-medium">
                                                هیچ درخواست تایید نشده‌ای در حال حاضر وجود ندارد.
                                            </div>

                                            <div v-else class="space-y-3">
                                                <div v-for="req in bookingRequests" :key="req.id" 
                                                     class="bg-slate-50/70 dark:bg-dark-bg/20 border border-slate-100 dark:border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-brand-500/20">
                                                    
                                                    <!-- اطلاعات رزرو کننده و زمان سانس -->
                                                    <div class="flex items-start gap-4">
                                                        <div class="w-12 h-12 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center shrink-0">
                                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                        </div>
                                                        <div class="space-y-1">
                                                            <h6 class="font-bold text-base text-slate-800 dark:text-white">{{ req.userName }}</h6>
                                                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>{{ req.date }}</span>
                                                                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{{ req.time }}</span>
                                                                <span class="text-slate-400 font-normal dir-ltr">{{ req.phone }}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- مبالغ مالی، بیعانه و وضعیت پرداخت همراه با دکمه‌های تایید/رد -->
                                                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-4 border-t border-slate-100 dark:border-white/5 md:border-0 pt-4 md:pt-0">
                                                        <div class="text-right sm:pl-4 sm:border-l border-slate-200 dark:border-white/5 space-y-1">
                                                            <div class="text-xs text-slate-400 font-medium">کل مبلغ: <span class="text-slate-700 dark:text-slate-200 font-bold text-sm">{{ req.totalPrice }} تومان</span></div>
                                                            <div class="flex items-center gap-1.5 justify-end">
                                                                <span :class="req.paymentType === 'پرداخت کامل' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'" 
                                                                      class="px-2 py-0.5 rounded text-[10px] font-bold">
                                                                    {{ req.paymentType }}
                                                                </span>
                                                                <span class="text-brand-600 dark:text-brand-400 font-black text-sm">{{ req.paidAmount }} <span class="text-[10px] font-normal text-slate-400">واریز شده</span></span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div class="flex items-center gap-2 shrink-0">
                                                            <button @click="handleRequestAction(req.id, 'rejected')" class="flex-1 sm:flex-none bg-red-50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white font-bold px-4 py-2 rounded-xl text-xs transition-all">
                                                                رد درخواست
                                                            </button>
                                                            <button @click="handleRequestAction(req.id, 'approved')" class="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10">
                                                                تایید سانس
                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </transition>

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
                            
                            <!-- TAB: Register (فرم ثبت سالن) -->
                            <div v-else-if="activeTab === 'register'" key="register" class="animate-fade-up">
                                <register-venue @completed="handleRegistrationComplete"></register-venue>
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
                            <p class="text-sm text-slate-500 dark:text-slate-400">مبلغ مورد نظر خود را برای شارژ کیف پول خود انتخاب کنید.</p>
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