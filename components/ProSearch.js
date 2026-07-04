import { store } from './store.js';

export default {
    setup() {
        const { toRefs, computed, reactive, ref, watch } = window.Vue;
        
        // خواندن اتوماتیک رشته ورزشی پاس داده شده از صفحه اصلی
        let initialSports = [];
        if (store.initialSport) {
            initialSports.push(store.initialSport);
            setTimeout(() => { store.initialSport = null; }, 100);
        }

        // استیت‌های اختصاصی برای فرم جستجوی پیشرفته با رنج قیمت دوطرفه
        const proFilters = reactive({
            priceMin: 200000,
            priceMax: 3000000,
            venueName: '',
            city: 'همه شهرها',
            venueType: 'همه اماکن',
            sports: initialSports,
            gender: 'تفاوتی ندارد',
            sort: 'پیشنهاد ما'
        });

        // وضعیت باز یا بسته بودن دراپ‌داون‌های لوکس سفارشی
        const dropdownCityOpen = ref(false);
        const dropdownTypeOpen = ref(false);

        const sportOptions = [
            { id: 1, name: 'فوتبال', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 2, name: 'والیبال', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 3, name: 'بسکتبال', icon: 'M12 14l9-5-9-5-9 5 9 5z' },
            { id: 4, name: 'هندبال', icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11' },
            { id: 5, name: 'تنیس', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
            { id: 6, name: 'پینگ پنگ', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
            { id: 7, name: 'فوتسال', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
        ];

        const minPercent = computed(() => {
            return ((proFilters.priceMin - 200000) / (3000000 - 200000)) * 100;
        });

        const maxPercent = computed(() => {
            return ((proFilters.priceMax - 200000) / (3000000 - 200000)) * 100;
        });

        const handleMinPrice = (e) => {
            const val = parseInt(e.target.value);
            if (val >= proFilters.priceMax - 100000) {
                proFilters.priceMin = proFilters.priceMax - 100000;
            } else {
                proFilters.priceMin = val;
            }
        };

        const handleMaxPrice = (e) => {
            const val = parseInt(e.target.value);
            if (val <= proFilters.priceMin + 100000) {
                proFilters.priceMax = proFilters.priceMin + 100000;
            } else {
                proFilters.priceMax = val;
            }
        };

        const filteredAndSortedVenues = computed(() => {
            let list = [...store.allVenuesDatabase];

            // ۱. فیلتر بر اساس نام مجموعه
            if (proFilters.venueName.trim()) {
                const searchName = proFilters.venueName.toLowerCase();
                list = list.filter(v => v.name.toLowerCase().includes(searchName));
            }

            // ۲. فیلتر بر اساس شهر انتخاب شده
            if (proFilters.city !== 'همه شهرها') {
                list = list.filter(v => v.city === proFilters.city);
            }

            // ۳. فیلتر بر اساس نوع کاربری مکان
            if (proFilters.venueType !== 'همه اماکن') {
                list = list.filter(v => v.type === proFilters.venueType);
            }

            // ۴. فیلتر بر اساس جنسیت پذیرش
            if (proFilters.gender !== 'تفاوتی ندارد') {
                list = list.filter(v => v.gender === proFilters.gender || v.gender === 'آقایان و بانوان');
            }

            // ۵. فیلتر بر اساس تگ‌های ورزشی انتخاب شده
            if (proFilters.sports.length > 0) {
                list = list.filter(v => {
                    return proFilters.sports.some(sport => {
                        if (sport === 'فوتبال' && (v.type.includes('فوتبال') || v.type.includes('چمن'))) return true;
                        if (sport === 'فوتسال' && v.type.includes('فوتسال')) return true;
                        if (sport === 'والیبال' && v.type.includes('والیبال')) return true;
                        return v.type.includes(sport);
                    });
                });
            }

            // ۶. فیلتر بازه قیمت دوطرفه (محاسبه عددی قیمت‌های رشته‌ای)
            list = list.filter(v => {
                const priceNum = parseInt(v.price.replace(/,/g, '')) || 0;
                return priceNum >= proFilters.priceMin && priceNum <= proFilters.priceMax;
            });

            // ۷. اعمال مرتب‌سازی بر اساس انتخاب کاربر
            if (proFilters.sort === 'ارزان‌ترین') {
                list.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
                    const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
                    return priceA - priceB;
                });
            } else if (proFilters.sort === 'جدیدترین') {
                list.reverse(); // شبیه‌ساز لود جدیدترین‌ها
            } else {
                // سورت بر اساس امتیاز (پیشنهاد ما)
                list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            }

            return list;
        });

        const isLoading = ref(true);
        const currentPage = ref(1);
        const itemsPerPage = 5; // تعداد کارت در هر صفحه

        // محاسبه تعداد کل صفحات
        const totalPages = computed(() => Math.ceil(filteredAndSortedVenues.value.length / itemsPerPage));

        // برش لیست برای نمایش در صفحه فعلی
        const paginatedVenues = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return filteredAndSortedVenues.value.slice(start, end);
        });

        // تابع اجرای لودینگ با زمان‌بندی
        const triggerLoading = () => {
            isLoading.value = true;
            setTimeout(() => {
                isLoading.value = false;
            }, 800); // 800 میلی‌ثانیه انیمیشن لودینگ
        };

        // لودینگ اولیه
        setTimeout(() => { isLoading.value = false; }, 800);

        // اعمال لودینگ در صورت تغییر هر یک از فیلترها و بازگشت به صفحه اول
        watch(proFilters, () => {
            currentPage.value = 1;
            triggerLoading();
        }, { deep: true });

        // تابع تغییر صفحه
        const goToPage = (page) => {
            if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
                currentPage.value = page;
                triggerLoading();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const toggleSport = (sportName) => {
            const index = proFilters.sports.indexOf(sportName);
            if (index === -1) {
                proFilters.sports.push(sportName);
            } else {
                proFilters.sports.splice(index, 1);
            }
        };

        const formatPrice = (price) => {
            return Number(price).toLocaleString();
        };

        const resetAllFilters = () => {
            proFilters.priceMin = 200000;
            proFilters.priceMax = 3000000;
            proFilters.venueName = '';
            proFilters.city = 'همه شهرها';
            proFilters.venueType = 'همه اماکن';
            proFilters.sports = [];
            proFilters.gender = 'تفاوتی ندارد';
            proFilters.sort = 'پیشنهاد ما';
        };

        const goToDetail = (venue) => {
            store.selectedVenue = venue;
            store.currentView = 'venue-detail';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const goBack = () => {
            store.currentView = 'home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        return { 
            ...toRefs(store), 
            proFilters,
            sportOptions,
            dropdownCityOpen,
            dropdownTypeOpen,
            minPercent,
            maxPercent,
            filteredAndSortedVenues,
            isLoading,
            currentPage,
            totalPages,
            paginatedVenues,
            goToPage,
            handleMinPrice,
            handleMaxPrice,
            toggleSport,
            formatPrice,
            resetAllFilters,
            goToDetail,
            goBack
        };
    },
    template: `
        <div class="pt-24 lg:pt-32 pb-20 relative z-10 min-h-screen">
            <!-- افکت‌های نوری پس‌زمینه هوشمند متمایل به عمق میدان لوکس -->
            <div class="absolute top-20 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>
            <div class="absolute bottom-40 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>

            <div class="container mx-auto px-4 lg:px-8">
                
                <!-- هدر شیشه‌ای فوق مدرن و متحرک -->
                <div class="glass-panel backdrop-blur-2xl rounded-3xl p-4 md:p-6 mb-8 border border-white/40 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] animate-fade-up">
                    <div class="flex items-center gap-4 w-full md:w-auto">
                        <button @click="goBack" class="w-12 h-12 rounded-2xl bg-white/80 dark:bg-dark-card/80 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 flex items-center justify-center transition-all duration-300 shadow-sm group">
                            <svg class="w-6 h-6 rotate-180 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                                جستجوی <span class="text-transparent bg-clip-text bg-gradient-to-l from-brand-400 to-cyan-600">پرو</span>
                                <svg class="w-5 h-5 text-brand-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">موتور جستجوی پیشرفته و فیلترینگ چندبعدی</p>
                        </div>
                    </div>
                    
                    <!-- مرتب سازی زنده و شیک -->
                    <div class="flex items-center gap-2 bg-slate-100/60 dark:bg-dark-bg/60 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5 w-full md:w-auto overflow-x-auto justify-between md:justify-start">
                        <button v-for="sort in ['پیشنهاد ما', 'ارزان‌ترین', 'جدیدترین']" 
                                @click="proFilters.sort = sort"
                                :class="proFilters.sort === sort ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-md font-extrabold scale-102' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                                class="px-4 py-2 rounded-xl text-xs md:text-sm transition-all duration-300 whitespace-nowrap">
                            {{ sort }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    
                    <!-- سایدبار پارامترهای فیلتر (ثابت در دسکتاپ و بهینه در موبایل) -->
                    <aside class="col-span-1 lg:col-span-4 lg:sticky top-32 h-max z-20">
                        <div class="bg-white/75 dark:bg-dark-card/65 backdrop-blur-3xl rounded-[2rem] p-5 md:p-6 border border-white/50 dark:border-white/5 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.04)] relative">
                            
                            <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-600 flex items-center justify-center text-white shadow-glow-subtle">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                    </div>
                                    <h3 class="font-extrabold text-slate-800 dark:text-white text-base">تنظیمات جستجو</h3>
                                </div>
                                <button @click="resetAllFilters" class="text-xs font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
                                    پاک کردن همه
                                </button>
                            </div>

                            <!-- ۱. فیلتر نام مجموعه -->
                            <div class="mb-6">
                                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">نام مجموعه ورزشی</label>
                                <div class="relative">
                                    <input type="text" v-model="proFilters.venueName" class="w-full bg-slate-50/50 dark:bg-dark-bg/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all pr-10 placeholder:text-slate-400 font-medium" placeholder="نام سالن یا مجموعه...">
                                    <svg class="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                            </div>

                            <!-- ۲. فیلتر سوئیچ جنسیت -->
                            <div class="mb-6">
                                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2.5">دسته‌بندی پذیرش</label>
                                <div class="flex bg-slate-100 dark:bg-dark-bg p-1 rounded-xl border border-slate-200/50 dark:border-white/5 relative">
                                    <!-- پس‌زمینه متحرک سوئیچ -->
                                    <div class="absolute inset-y-1 w-1/3 bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-all duration-300 ease-out" 
                                         :style="{ right: proFilters.gender === 'آقایان' ? '33.33%' : proFilters.gender === 'بانوان' ? '66.66%' : '4px' }"></div>
                                    
                                    <button v-for="g in ['تفاوتی ندارد', 'آقایان', 'بانوان']" @click="proFilters.gender = g" class="flex-1 relative z-10 py-2.5 rounded-lg text-xs font-black transition-colors duration-300 flex items-center justify-center gap-1.5" :class="proFilters.gender === g ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
                                        {{ g }}
                                    </button>
                                </div>
                            </div>

                            <!-- ۳. رشته‌های ورزشی مورد نظر -->
                            <div class="mb-6">
                                <label class="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
                                    رشته‌های ورزشی
                                    <span v-if="proFilters.sports.length > 0" class="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full">{{ proFilters.sports.length }} انتخاب</span>
                                </label>
                                <div class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pl-1 custom-scrollbar">
                                    <button v-for="sport in sportOptions" :key="sport.id" 
                                            @click="toggleSport(sport.name)"
                                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border"
                                            :class="proFilters.sports.includes(sport.name) ? 'bg-brand-500 text-white border-brand-400 shadow-glow-subtle' : 'bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800'">
                                        <svg class="w-3.5 h-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sport.icon" /></svg>
                                        {{ sport.name }}
                                    </button>
                                </div>
                            </div>

                            <!-- ۴. رنج قیمت (بازه دوطرفه پایدار چپ به راست) -->
                            <div class="mb-6">
                                <div class="flex items-center justify-between mb-2">
                                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300">محدوده قیمت انتخابی</label>
                                    <div class="text-[10px] font-black text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-200 dark:border-brand-500/20">
                                        {{ formatPrice(proFilters.priceMin) }} تا {{ formatPrice(proFilters.priceMax) }} تومان
                                    </div>
                                </div>
                                <div class="relative pt-4 pb-2">
                                    <!-- کانتینر اسلایدر دو طرفه با ساختار LTR برای کنترل دقیق قیمت -->
                                    <div class="dual-range-container relative h-2 bg-slate-200 dark:bg-slate-700 rounded-lg" dir="ltr">
                                        <!-- خط رنگی بازه انتخاب شده -->
                                        <div class="absolute h-full bg-brand-500 rounded-lg" 
                                             :style="{ left: minPercent + '%', right: (100 - maxPercent) + '%' }"></div>
                                        
                                        <!-- هندل حداقل قیمت -->
                                        <input type="range" :value="proFilters.priceMin" min="200000" max="3000000" step="100000" 
                                               @input="handleMinPrice" 
                                               class="absolute w-full h-2 top-0 left-0 bg-transparent appearance-none outline-none cursor-pointer">
                                        
                                        <!-- هندل حداکثر قیمت -->
                                        <input type="range" :value="proFilters.priceMax" min="200000" max="3000000" step="100000" 
                                               @input="handleMaxPrice" 
                                               class="absolute w-full h-2 top-0 left-0 bg-transparent appearance-none outline-none cursor-pointer">
                                    </div>
                                    <div class="flex justify-between text-[9px] text-slate-400 mt-2 font-medium">
                                        <span>3,000,000 تومان</span>
                                        <span>200,000 تومان</span>
                                    </div>
                                </div>
                            </div>

                            <!-- ۵. شهرستان و نوع کاربری (دراپ‌داون سفارشی لوکس) -->
                            <div class="grid grid-cols-2 gap-3 relative z-40">
                                <!-- دراپ داون شهر -->
                                <div class="relative">
                                    <label class="block text-[10px] font-bold text-slate-500 mb-1.5">شهرستان</label>
                                    <div @click.stop="dropdownCityOpen = !dropdownCityOpen; dropdownTypeOpen = false;" 
                                         class="bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-700 dark:text-white flex items-center justify-between cursor-pointer hover:border-brand-500 transition-colors">
                                        <span class="truncate">{{ proFilters.city }}</span>
                                        <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300" :class="{'rotate-180': dropdownCityOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                    <!-- لیست کشویی شیشه ای شهر -->
                                    <transition name="dropdown">
                                        <div v-if="dropdownCityOpen" class="absolute right-0 left-0 mt-1.5 rounded-xl glass-panel shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden z-50">
                                            <div @click="proFilters.city = 'همه شهرها'; dropdownCityOpen = false" 
                                                 class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white cursor-pointer transition-colors">همه شهرها</div>
                                            <div v-for="city in options.city" :key="city" 
                                                 @click="proFilters.city = city; dropdownCityOpen = false" 
                                                 class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white cursor-pointer transition-colors">{{ city }}</div>
                                        </div>
                                    </transition>
                                </div>

                                <!-- دراپ داون نوع مکان -->
                                <div class="relative">
                                    <label class="block text-[10px] font-bold text-slate-500 mb-1.5">نوع کاربری</label>
                                    <div @click.stop="dropdownTypeOpen = !dropdownTypeOpen; dropdownCityOpen = false;" 
                                         class="bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-700 dark:text-white flex items-center justify-between cursor-pointer hover:border-brand-500 transition-colors">
                                        <span class="truncate">{{ proFilters.venueType }}</span>
                                        <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300" :class="{'rotate-180': dropdownTypeOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                    <!-- لیست کشویی شیشه ای نوع مکان -->
                                    <transition name="dropdown">
                                        <div v-if="dropdownTypeOpen" class="absolute right-0 left-0 mt-1.5 rounded-xl glass-panel shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden z-50">
                                            <div @click="proFilters.venueType = 'همه اماکن'; dropdownTypeOpen = false" 
                                                 class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white cursor-pointer transition-colors">همه اماکن</div>
                                            <div v-for="type in options.type" :key="type" 
                                                 @click="proFilters.venueType = type; dropdownTypeOpen = false" 
                                                 class="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white cursor-pointer transition-colors">{{ type }}</div>
                                        </div>
                                    </transition>
                                </div>
                            </div>
                            
                        </div>
                    </aside>

                    <!-- لیست نتایج پویای فیلتر شده -->
                    <div class="col-span-1 lg:col-span-8 flex flex-col gap-4 pb-20">
                        
                        <!-- انیمیشن لودینگ شیک و مدرن -->
                        <div v-if="isLoading" class="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center min-h-[400px] border-brand-500/10">
                            <div class="relative w-24 h-24 mb-6">
                                <div class="absolute inset-0 rounded-full border-t-4 border-brand-500 animate-spin-slow opacity-80"></div>
                                <div class="absolute inset-3 rounded-full border-r-4 border-brand-400 animate-[spin_3s_linear_infinite_reverse] opacity-80"></div>
                                <div class="absolute inset-6 rounded-full border-b-4 border-cyan-300 animate-[spin_2s_linear_infinite] opacity-80"></div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <svg class="w-8 h-8 text-brand-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                            </div>
                            <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2 animate-pulse">در حال پردازش نتایج...</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400">لطفاً چند لحظه منتظر بمانید</p>
                        </div>

                        <!-- حالت عدم وجود نتیجه فیلتر -->
                        <div v-else-if="filteredAndSortedVenues.length === 0" class="glass-panel rounded-3xl p-12 text-center border-brand-500/10 animate-scale-up">
                            <div class="w-16 h-16 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-500 shadow-glow">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2">موردی یافت نشد!</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">لطفاً فیلترهای خود را تغییر دهید تا نتایج بهتری پیدا کنید.</p>
                        </div>

                        <!-- لیست کارت‌های ورزشی لوکس با انیمیشن ورود نرم از پایین (Staggered) -->
                        <div v-else v-for="(venue, index) in paginatedVenues" :key="venue.name + index" 
                             class="card-reveal-anim group bg-white dark:bg-dark-card border border-slate-150 dark:border-white/5 rounded-[2rem] p-3 hover:border-brand-500/30 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.12)] transition-all duration-500 flex flex-col sm:flex-row gap-5 overflow-hidden relative"
                             :style="{ animationDelay: (index * 120) + 'ms' }">
                            
                            <!-- تصویر بهینه شده با افکت زوم و تگ قیمت -->
                            <div class="w-full sm:w-64 lg:w-72 h-48 sm:h-auto rounded-[1.5rem] overflow-hidden relative flex-shrink-0 bg-slate-100 dark:bg-dark-bg">
                                <img :src="venue.image" :alt="venue.name" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>
                                
                                <div class="absolute top-3 right-3">
                                    <span class="bg-black/45 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm">
                                        ★ {{ venue.rating }}
                                    </span>
                                </div>
                                <div class="absolute bottom-3 right-3">
                                    <span class="bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md">
                                        {{ venue.price }} تومان <span class="text-[10px] font-normal text-slate-300">/ سانس</span>
                                    </span>
                                </div>
                            </div>

                            <!-- اطلاعات مرکزی و فنی سالن -->
                            <div class="flex-1 py-2 px-2 sm:px-0 flex flex-col justify-between relative z-10">
                                <div class="text-right">
                                    <h3 class="text-lg font-black text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors duration-300 mb-2">{{ venue.name }}</h3>
                                    
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                                        <svg class="w-3.5 h-3.5 text-brand-500/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {{ venue.city }} - دسترسی عالی و موقعیت مجهز
                                    </p>

                                    <!-- ویژگی‌ها و تگ‌های نوع مکان -->
                                    <div class="flex flex-wrap gap-1.5 mb-4">
                                        <span class="bg-slate-50 dark:bg-dark-bg/40 border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                                            {{ venue.type }}
                                        </span>
                                        <span class="bg-slate-50 dark:bg-dark-bg/40 border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
                                            <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                            ویژه {{ venue.gender }}
                                        </span>
                                    </div>
                                </div>

                                <!-- بخش فوتر کارت ورزشی و رزرو مستقیم -->
                                <div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                                    <!-- شبیه‌ساز کاربران رزرو شده -->
                                    <div class="flex -space-x-1.5 space-x-reverse items-center">
                                        <div class="w-7 h-7 rounded-full border border-white dark:border-dark-card bg-brand-100 flex items-center justify-center text-[9px] font-bold text-brand-600">+۵</div>
                                        <div class="w-7 h-7 rounded-full border border-white dark:border-dark-card bg-slate-200 overflow-hidden">
                                            <img src="https://i.pravatar.cc/100?img=33" class="w-full h-full object-cover">
                                        </div>
                                        <div class="w-7 h-7 rounded-full border border-white dark:border-dark-card bg-slate-200 overflow-hidden">
                                            <img src="https://i.pravatar.cc/100?img=47" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    
                                    <button @click="goToDetail(venue)" class="bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-500 text-brand-600 dark:text-brand-400 hover:text-white dark:hover:text-dark-bg px-5 py-2 rounded-xl font-extrabold text-xs transition-all duration-300 flex items-center gap-1.5">
                                        مشاهده و رزرو
                                        <svg class="w-3.5 h-3.5 transform group-hover:translate-x-[-2px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- صفحه‌بندی (Pagination) خفن و مدرن -->
                        <div v-if="!isLoading && totalPages > 1" class="flex items-center justify-center mt-8 gap-2 animate-fade-up" style="animation-delay: 400ms;">
                            <!-- دکمه قبلی -->
                            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" 
                                    class="w-10 h-10 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm">
                                <svg class="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            
                            <!-- شماره صفحات شیشه‌ای -->
                            <div class="flex items-center gap-1.5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                                <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                                        :class="currentPage === page ? 'bg-brand-500 text-white font-black shadow-glow-subtle scale-105' : 'text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800'"
                                        class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all duration-300">
                                    {{ page }}
                                </button>
                            </div>

                            <!-- دکمه بعدی -->
                            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" 
                                    class="w-10 h-10 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        </div>

                    </div>

                </div>
            </div>
            
            <component :is="'style'">
                .animate-spin-slow { animation: spin 4s linear infinite; }
                
                /* استایل تخصصی دابل رنج اسلایدر قیمت با کنترل دوطرفه پایدار */
                .dual-range-container {
                    position: relative;
                }
                .dual-range-container input[type=range] {
                    -webkit-appearance: none;
                    appearance: none;
                    position: absolute;
                    width: 100%;
                    background: transparent;
                    pointer-events: none;
                }
                .dual-range-container input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #06b6d4;
                    cursor: pointer;
                    pointer-events: auto;
                    border: 3px solid white;
                    box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
                }
                .dark .dual-range-container input[type=range]::-webkit-slider-thumb {
                    border: 3px solid #0c1222;
                }
                .dual-range-container input[type=range]::-moz-range-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #06b6d4;
                    cursor: pointer;
                    pointer-events: auto;
                    border: 3px solid white;
                    box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
                }
                .dark .dual-range-container input[type=range]::-moz-range-thumb {
                    border: 3px solid #0c1222;
                }
                
                /* اسکرول بار داخلی لوکس برای تگ‌های ورزشی */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.5);
                }

                @keyframes fadeUpAnim {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .card-reveal-anim {
                    animation: fadeUpAnim 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                @keyframes scaleUpAnim {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-scale-up {
                    animation: scaleUpAnim 0.4s ease-out forwards;
                }
            </component>
        </div>
    `
};