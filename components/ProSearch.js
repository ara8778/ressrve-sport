import { store } from './store.js';

export default {
    setup() {
        const { toRefs, computed } = window.Vue;
        
        // استیت‌های اختصاصی برای فرم جستجوی پیشرفته
        const proFilters = window.Vue.reactive({
            priceRange: 1500000,
            venueName: '',
            city: 'همه شهرها',
            venueType: 'همه اماکن',
            sports: [],
            gender: 'تفاوتی ندارد',
            sort: 'پیشنهاد ما'
        });

        const sportOptions = [
            { id: 1, name: 'فوتبال', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 2, name: 'والیبال', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 3, name: 'بسکتبال', icon: 'M12 14l9-5-9-5-9 5 9 5z' },
            { id: 4, name: 'هندبال', icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11' },
            { id: 5, name: 'تنیس', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
            { id: 6, name: 'پینگ پنگ', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
            { id: 7, name: 'فوتسال', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
        ];

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
            toggleSport,
            formatPrice,
            goToDetail,
            goBack
        };
    },
    template: `
        <div class="pt-24 lg:pt-32 pb-20 relative z-10 min-h-screen">
            <!-- افکت‌های نوری پس‌زمینه لوکس -->
            <div class="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>
            <div class="absolute bottom-40 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>

            <div class="container mx-auto px-4 lg:px-8">
                
                <!-- هدر شیشه‌ای و شناور -->
                <div class="glass-panel backdrop-blur-2xl rounded-3xl p-4 md:p-6 mb-10 border border-white/40 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-30 shadow-[0_8px_32px_rgba(0,0,0,0.08)] animate-fade-up">
                    <div class="flex items-center gap-5">
                        <button @click="goBack" class="w-12 h-12 rounded-2xl bg-white/80 dark:bg-dark-card/80 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 flex items-center justify-center transition-all duration-300 shadow-sm group">
                            <svg class="w-6 h-6 rotate-180 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                        <div>
                            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                                جستجوی <span class="text-transparent bg-clip-text bg-gradient-to-l from-brand-400 to-cyan-600">پرو</span>
                                <svg class="w-6 h-6 text-brand-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </h2>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">تجربه پیدا کردن بهترین سالن‌های ورزشی با فیلترهای هوشمند</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 bg-slate-100/50 dark:bg-dark-bg/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                        <button v-for="sort in ['پیشنهاد ما', 'ارزان‌ترین', 'جدیدترین']" 
                                @click="proFilters.sort = sort"
                                :class="proFilters.sort === sort ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                                class="px-4 py-2 rounded-xl text-sm transition-all duration-300">
                            {{ sort }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    
                    <!-- 🎛️ سایدبار فیلترها (لوکس و یکپارچه) -->
                    <aside class="col-span-1 lg:col-span-4 lg:sticky top-32 h-max animate-fade-up" style="animation-delay: 100ms;">
                        <div class="bg-white/60 dark:bg-dark-card/40 backdrop-blur-3xl rounded-[2.5rem] p-7 border border-white/50 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                            <!-- افکت گوشه سایدبار -->
                            <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 blur-[30px] rounded-full pointer-events-none"></div>

                            <div class="flex items-center gap-3 mb-8">
                                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-cyan-600 flex items-center justify-center text-white shadow-glow-subtle">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                </div>
                                <h3 class="font-extrabold text-slate-800 dark:text-white text-xl">پارامترهای جستجو</h3>
                            </div>

                            <!-- 1. جستجوی نام -->
                            <div class="mb-8 group">
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 transition-colors group-focus-within:text-brand-500">نام مجموعه</label>
                                <div class="relative">
                                    <input type="text" v-model="proFilters.venueName" class="w-full bg-slate-50/50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all pr-12 placeholder:text-slate-400 font-medium" placeholder="مثلاً: سالن حیدریان...">
                                    <svg class="w-5 h-5 absolute right-4 top-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                            </div>

                            <!-- 2. کنترل جنسیت (Segmented) -->
                            <div class="mb-8">
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">دسته بندی پذیرش</label>
                                <div class="flex bg-slate-100 dark:bg-dark-bg p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 relative">
                                    <!-- پس‌زمینه متحرک -->
                                    <div class="absolute inset-y-1.5 w-1/3 bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-all duration-300 ease-out" 
                                         :style="{ right: proFilters.gender === 'آقایان' ? '33.33%' : proFilters.gender === 'بانوان' ? '66.66%' : '4px' }"></div>
                                    
                                    <button v-for="g in ['تفاوتی ندارد', 'آقایان', 'بانوان']" @click="proFilters.gender = g" class="flex-1 relative z-10 py-3 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2" :class="proFilters.gender === g ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
                                        <svg v-if="g === 'آقایان'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        <svg v-if="g === 'بانوان'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4a4 4 0 100 8 4 4 0 000-8zM2 20h20a2 2 0 002-2v-2a6 6 0 00-6-6H6a6 6 0 00-6 6v2a2 2 0 002 2z" /></svg>
                                        {{ g }}
                                    </button>
                                </div>
                            </div>

                            <!-- 3. رشته‌های ورزشی (Pills متحرک) -->
                            <div class="mb-8">
                                <label class="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                                    رشته‌های ورزشی مورد نظر
                                    <span v-if="proFilters.sports.length > 0" class="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full animate-fade">{{ proFilters.sports.length }} انتخاب</span>
                                </label>
                                <div class="flex flex-wrap gap-2.5">
                                    <button v-for="sport in sportOptions" :key="sport.id" 
                                            @click="toggleSport(sport.name)"
                                            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-transparent"
                                            :class="proFilters.sports.includes(sport.name) ? 'bg-brand-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.4)] scale-105 border-brand-400' : 'bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'">
                                        <svg class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sport.icon" /></svg>
                                        {{ sport.name }}
                                    </button>
                                </div>
                            </div>

                            <!-- 4. رنج قیمت (اسلایدر لوکس) -->
                            <div class="mb-8">
                                <div class="flex items-center justify-between mb-4">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">حداکثر بودجه شما</label>
                                    <div class="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-lg text-xs font-bold border border-brand-200 dark:border-brand-500/20">
                                        تا {{ formatPrice(proFilters.priceRange) }} تومان
                                    </div>
                                </div>
                                <div class="relative pt-2">
                                    <!-- استایل سفارشی برای اینپوت رنج -->
                                    <input type="range" v-model="proFilters.priceRange" min="200000" max="3000000" step="100000" 
                                           class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer outline-none shadow-inner accent-brand-500 transition-all hover:accent-brand-400">
                                </div>
                            </div>

                            <!-- 5. شهر و نوع (دراپ‌داون‌های مدرن) -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="relative group">
                                    <label class="block text-xs font-bold text-slate-500 mb-2">شهرستان</label>
                                    <div class="relative">
                                        <select v-model="proFilters.city" class="w-full appearance-none bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all cursor-pointer">
                                            <option>همه شهرها</option>
                                            <option v-for="city in options.city" :key="city">{{ city }}</option>
                                        </select>
                                        <svg class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                <div class="relative group">
                                    <label class="block text-xs font-bold text-slate-500 mb-2">نوع کاربری</label>
                                    <div class="relative">
                                        <select v-model="proFilters.venueType" class="w-full appearance-none bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all cursor-pointer">
                                            <option>همه اماکن</option>
                                            <option v-for="type in options.type" :key="type">{{ type }}</option>
                                        </select>
                                        <svg class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- دکمه اعمال (فقط بصری) -->
                            <button class="w-full mt-8 bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-black rounded-2xl py-4 flex items-center justify-center gap-2 transition-all duration-300 shadow-glow hover:scale-[1.02] active:scale-95">
                                بروزرسانی نتایج
                                <svg class="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    </aside>

                    <!-- 🏆 لیست نتایج (کارت‌های مدرن و عریض) -->
                    <div class="col-span-1 lg:col-span-8 flex flex-col gap-6 pb-20">
                        
                        <div v-for="(venue, index) in allVenuesDatabase" :key="index" 
                             class="group bg-white dark:bg-dark-card border border-slate-100 dark:border-white/5 rounded-[2rem] p-3 hover:border-brand-500/30 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.15)] transition-all duration-500 flex flex-col sm:flex-row gap-5 animate-fade-up overflow-hidden relative"
                             :style="{ animationDelay: (150 + index * 100) + 'ms' }">
                            
                            <!-- هاور افکت پس زمینه -->
                            <div class="absolute inset-0 bg-gradient-to-r from-brand-50/0 via-brand-50/50 to-brand-50/0 dark:from-brand-500/0 dark:via-brand-500/5 dark:to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-full group-hover:translate-x-[-100%]"></div>

                            <!-- تصویر -->
                            <div class="w-full sm:w-64 lg:w-72 h-56 sm:h-auto rounded-[1.5rem] overflow-hidden relative flex-shrink-0">
                                <img :src="venue.image" :alt="venue.name" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                                
                                <!-- تگ‌های روی تصویر -->
                                <div class="absolute top-3 right-3 flex gap-2">
                                    <span class="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
                                        <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        {{ venue.rating }}
                                    </span>
                                </div>
                                <div class="absolute bottom-3 right-3">
                                    <span class="bg-black/40 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-xl text-sm font-bold">
                                        {{ venue.price }} تومان <span class="text-[10px] font-normal text-slate-300">/ جلسه</span>
                                    </span>
                                </div>
                            </div>

                            <!-- اطلاعات کارت -->
                            <div class="flex-1 py-3 px-2 sm:px-0 flex flex-col justify-between relative z-10">
                                <div>
                                    <div class="flex items-start justify-between mb-2">
                                        <h3 class="text-xl font-black text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors duration-300">{{ venue.name }}</h3>
                                    </div>
                                    
                                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                                        <svg class="w-4 h-4 text-brand-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {{ venue.city }} - دسترسی عالی به مترو و خطوط اتوبوس
                                    </p>

                                    <!-- مشخصات فنی (ویژگی‌ها) -->
                                    <div class="flex flex-wrap gap-2 mb-6">
                                        <span class="bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                            <div class="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                                            {{ venue.type }}
                                        </span>
                                        <span class="bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                            <div class="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                            ویژه {{ venue.gender }}
                                        </span>
                                    </div>
                                </div>

                                <!-- بخش اکشن کارت -->
                                <div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 sm:pr-4">
                                    <div class="flex -space-x-2 space-x-reverse">
                                        <div class="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-600">+۱۲</div>
                                        <div class="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-slate-200">
                                            <img src="https://i.pravatar.cc/100?img=33" class="w-full h-full rounded-full object-cover">
                                        </div>
                                        <div class="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-slate-200">
                                            <img src="https://i.pravatar.cc/100?img=47" class="w-full h-full rounded-full object-cover">
                                        </div>
                                    </div>
                                    
                                    <button @click="goToDetail(venue)" class="bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-500 text-brand-600 dark:text-brand-400 hover:text-white dark:hover:text-dark-bg px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 flex items-center gap-2 group/btn">
                                        رزرو آنلاین
                                        <svg class="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            
            <!-- استایل سفارشی برای اسکرولبار داخلی و انیمیشن‌ها -->
            <component :is="'style'">
                .animate-spin-slow { animation: spin 3s linear infinite; }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #06b6d4;
                    cursor: pointer;
                    margin-top: -6px;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
                    border: 3px solid white;
                }
                .dark input[type=range]::-webkit-slider-thumb {
                    border: 3px solid #0c1222;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    cursor: pointer;
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .dark input[type=range]::-webkit-slider-runnable-track {
                    background: #334155;
                }
            </component>
        </div>
    `
};