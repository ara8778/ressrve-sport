import { store, toggleDropdown, selectOption, navigateToResults, openQuickBook, handleSlotBooking } from './store.js';

export default {
    setup() {
        const { toRefs, computed } = window.Vue;

        const goToDetail = (venue) => {
            store.selectedVenue = venue;
            store.currentView = 'venue-detail';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const goToProSearch = (sportName) => {
            if (sportName) {
                store.initialSport = sportName;
            }
            store.currentView = 'pro-search';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const sportCategories = [
            { id: 1, name: 'فوتبال', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'from-emerald-400 to-green-500', shadow: 'shadow-[0_4px_15px_rgba(16,185,129,0.3)]' },
            { id: 2, name: 'فوتسال', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'from-brand-400 to-cyan-500', shadow: 'shadow-[0_4px_15px_rgba(6,182,212,0.3)]' },
            { id: 3, name: 'والیبال', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-orange-400 to-red-500', shadow: 'shadow-[0_4px_15px_rgba(249,115,22,0.3)]' },
            { id: 4, name: 'بسکتبال', icon: 'M12 14l9-5-9-5-9 5 9 5z', color: 'from-amber-400 to-orange-500', shadow: 'shadow-[0_4px_15px_rgba(245,158,11,0.3)]' },
            { id: 5, name: 'هندبال', icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-[0_4px_15px_rgba(59,130,246,0.3)]' },
            { id: 6, name: 'تنیس', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', color: 'from-lime-400 to-green-500', shadow: 'shadow-[0_4px_15px_rgba(132,204,22,0.3)]' },
            { id: 7, name: 'پینگ پنگ', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', color: 'from-rose-400 to-pink-500', shadow: 'shadow-[0_4px_15px_rgba(244,63,94,0.3)]' },
            { id: 8, name: 'سایر رشته‌ها', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'from-slate-400 to-slate-500', shadow: 'shadow-[0_4px_15px_rgba(148,163,184,0.3)]' }
        ];

        const latestVenues = computed(() => {
            return [...store.popularVenues].reverse();
        });

        return { 
            ...toRefs(store), 
            toggleDropdown, 
            selectOption, 
            navigateToResults, 
            openQuickBook, 
            handleSlotBooking,
            goToDetail,
            goToProSearch,
            sportCategories,
            latestVenues
        };
    },
    template: `
        <div class="relative">
            <div class="absolute right-4 md:right-16 top-40 z-10 opacity-35 md:opacity-50 pointer-events-none hidden sm:block">
                <div class="anim-icon-l1 mb-20">
                    <svg class="w-10 h-10 text-brand-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M8 21a9 9 0 1118 0 9 9 0 01-18 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M3 12h18" />
                    </svg>
                </div>
                <div class="anim-icon-l2 mb-20 mr-12">
                    <svg class="w-8 h-8 text-cyan-500 dark:text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v3.375m9 0h-9M9 6h6m-6 3h6m-7.5-6H18" />
                    </svg>
                </div>
                <div class="anim-icon-l3 mb-20 ml-6">
                    <svg class="w-9 h-9 text-blue-500 dark:text-blue-400 drop-shadow-[0_0_10px_rgba(30,144,255,0.4)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 6.5h11M4 9h16M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11z" />
                    </svg>
                </div>
                <div class="anim-icon-l4">
                    <svg class="w-7 h-7 text-brand-600 dark:text-brand-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                </div>
            </div>

            <div class="absolute left-4 md:left-16 top-40 z-10 opacity-35 md:opacity-50 pointer-events-none hidden sm:block">
                <div class="anim-icon-r1 mb-20 ml-12">
                    <svg class="w-10 h-10 text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M6.2 6.2c2.4 2.4 2.4 6.4 0 8.8M17.8 6.2c-2.4 2.4-2.4 6.4 0 8.8" />
                    </svg>
                </div>
                <div class="anim-icon-r2 mb-20">
                    <svg class="w-8 h-8 text-blue-500 dark:text-blue-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zM12 2v2M9 2h6" />
                    </svg>
                </div>
                <div class="anim-icon-r3 mb-20 ml-6">
                    <svg class="w-9 h-9 text-brand-500 dark:text-brand-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15a4 4 0 100-8 4 4 0 000 8z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v4M9 21h6M4 8h3v3c0 1 1 2 2 2h2m9-7h-3v3c0 1-1 2-2 2h-2" />
                    </svg>
                </div>
                <div class="anim-icon-r4">
                    <svg class="w-8 h-8 text-cyan-600 dark:text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 0112.728 0m0 0a9 9 0 01-12.728 12.728m12.728-12.728L5.636 18.364m12.728 0a9 9 0 01-12.728 0m0 0a9 9 0 010-12.728m0 12.728L18.364 5.636" />
                    </svg>
                </div>
            </div>

            <div class="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden z-20">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtdjRoLTR2NGgtdjRoNHY0aDR2LTRoNHYtNGgtNHptMC0zaDR2LTRoLTR2NHptLTQgMHY0aC00di00aDR6bS00IDRoNHY0aC00di00em0wLTR2LTRoNHY0aC00em0tNCAwdjRoLTR2LTRoNHptMC00aDR2LTRoLTR2NHptNCAwaDR2LTRoLTR2NHptMC00djRoLTR2LTRoNHptLTQgMHY0aC00di00aDR6bTAtNGg0di00aC00djR6bTQgMGg0di00aC00djR6bTAtNHY0aC00di00aDR6bS00IDB2NGgtNHYtNGg0eiIgZmlsbD0iIzFBMjUyOSIgZmlsbC1vcGFjaXR5PSIwLjMiLz48L2c+PC9zdmc+')] opacity-10 dark:opacity-40 pointer-events-none transition-opacity duration-500"></div>

                <div class="container mx-auto px-4 relative z-20 text-center">
                    <div class="inline-block mb-4 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-sm font-medium animate-fade-up transition-colors duration-500">
                        ✨ سریع‌ترین راه رزرو سالن ورزشی
                    </div>
                    <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 mb-6 tracking-tight animate-fade-up delay-100 transition-colors duration-500">
                        زمین بازیت رو <br class="md:hidden"/>
                        <span class="text-brand-500 dark:text-brand-400">حرفه‌ای</span> انتخاب کن!
                    </h1>
                    <p class="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-up delay-200 leading-relaxed transition-colors duration-500">
                        جستجو، مقایسه و رزرو آنلاین بهترین اماکن ورزشی در سراسر شهر. بدون نیاز به تماس، فقط با چند کلیک سانس خودت رو قطعی کن.
                    </p>

                    <div class="max-w-5xl mx-auto bg-white/90 dark:bg-dark-card/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-4 md:p-5 rounded-[2rem] shadow-xl dark:shadow-2xl animate-fade-up delay-300 relative z-30 transition-colors duration-500">
                        <div class="flex flex-col md:flex-row gap-3 relative z-30">
                            
                            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                
                                <div class="relative" @click.stop>
                                    <div @click="toggleDropdown('city')" 
                                         class="bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 hover:border-brand-500 hover:shadow-glow-subtle transition-all duration-300 group cursor-pointer flex items-center justify-between">
                                        <div class="flex-1 text-right">
                                            <span class="block text-[10px] text-slate-500 font-bold mb-0.5">شهر یا منطقه</span>
                                            <span class="text-base font-extrabold text-slate-800 dark:text-white block transition-colors duration-500">{{ filters.city }}</span>
                                        </div>
                                        <svg class="w-5 h-5 text-brand-500 dark:text-brand-400 mr-2 flex-shrink-0 transition-transform duration-300" :class="{'rotate-180': activeDropdown === 'city'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                    <transition name="dropdown">
                                        <div v-if="activeDropdown === 'city'" class="absolute left-0 right-0 mt-2.5 rounded-2xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 overflow-hidden">
                                            <div v-for="option in options.city" :key="option" 
                                                 @click="selectOption('city', option)" 
                                                 class="px-5 py-3 text-sm font-semibold text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors duration-200 flex items-center justify-between">
                                                <span>{{ option }}</span>
                                                <svg v-if="filters.city === option" class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        </div>
                                    </transition>
                                </div>

                                <div class="relative" @click.stop>
                                    <div @click="toggleDropdown('type')" 
                                         class="bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 hover:border-brand-500 hover:shadow-glow-subtle transition-all duration-300 group cursor-pointer flex items-center justify-between">
                                        <div class="flex-1 text-right">
                                            <span class="block text-[10px] text-slate-500 font-bold mb-0.5">نوع مکان ورزشی</span>
                                            <span class="text-base font-extrabold text-slate-800 dark:text-white block transition-colors duration-500">{{ filters.type }}</span>
                                        </div>
                                        <svg class="w-5 h-5 text-brand-500 dark:text-brand-400 mr-2 flex-shrink-0 transition-transform duration-300" :class="{'rotate-180': activeDropdown === 'type'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                    <transition name="dropdown">
                                        <div v-if="activeDropdown === 'type'" class="absolute left-0 right-0 mt-2.5 rounded-2xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 overflow-hidden">
                                            <div v-for="option in options.type" :key="option" 
                                                 @click="selectOption('type', option)" 
                                                 class="px-5 py-3 text-sm font-semibold text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors duration-200 flex items-center justify-between">
                                                <span>{{ option }}</span>
                                                <svg v-if="filters.type === option" class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        </div>
                                    </transition>
                                </div>

                                <div class="relative" @click.stop>
                                    <div @click="toggleDropdown('day')" 
                                         class="bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 hover:border-brand-500 hover:shadow-glow-subtle transition-all duration-300 group cursor-pointer flex items-center justify-between">
                                        <div class="flex-1 text-right">
                                            <span class="block text-[10px] text-slate-500 font-bold mb-0.5">روز هفته</span>
                                            <span class="text-base font-extrabold text-slate-800 dark:text-white block transition-colors duration-500">{{ filters.day }}</span>
                                        </div>
                                        <svg class="w-5 h-5 text-brand-500 dark:text-brand-400 mr-2 flex-shrink-0 transition-transform duration-300" :class="{'rotate-180': activeDropdown === 'day'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                    <transition name="dropdown">
                                        <div v-if="activeDropdown === 'day'" class="absolute left-0 right-0 mt-2.5 rounded-2xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 max-h-56 overflow-y-auto">
                                            <div v-for="option in options.day" :key="option" 
                                                 @click="selectOption('day', option)" 
                                                 class="px-5 py-3 text-sm font-semibold text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors duration-200 flex items-center justify-between">
                                                <span>{{ option }}</span>
                                                <svg v-if="filters.day === option" class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        </div>
                                    </transition>
                                </div>

                                <div class="relative" @click.stop>
                                    <div @click="toggleDropdown('time')" 
                                         class="bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 hover:border-brand-500 hover:shadow-glow-subtle transition-all duration-300 group cursor-pointer flex items-center justify-between">
                                        <div class="flex-1 text-right">
                                            <span class="block text-[10px] text-slate-500 font-bold mb-0.5">بازه زمانی</span>
                                            <span class="text-base font-extrabold text-slate-800 dark:text-white block transition-colors duration-500">{{ filters.time }}</span>
                                        </div>
                                        <svg class="w-5 h-5 text-brand-500 dark:text-brand-400 mr-2 flex-shrink-0 transition-transform duration-300" :class="{'rotate-180': activeDropdown === 'time'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                    <transition name="dropdown">
                                        <div v-if="activeDropdown === 'time'" class="absolute left-0 right-0 mt-2.5 rounded-2xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 overflow-hidden">
                                            <div v-for="option in options.time" :key="option" 
                                                 @click="selectOption('time', option)" 
                                                 class="px-5 py-3 text-sm font-semibold text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors duration-200 flex items-center justify-between">
                                                <span>{{ option }}</span>
                                                <svg v-if="filters.time === option" class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>

                            <button @click="navigateToResults" class="md:w-40 bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white dark:text-dark-bg font-black rounded-2xl px-6 py-4 flex items-center justify-center gap-2 transition-all duration-300 shadow-glow hover:scale-[1.04] active:scale-95 text-base">
                                <span>جستجو کن</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main class="container mx-auto px-4 pb-32 relative z-10 -mt-6">
                
                <!-- بخش جدید: دسته‌بندی بر اساس رشته ورزشی -->
                <div class="mb-16 animate-fade-up">
                    <div class="flex items-end justify-between mb-8">
                        <div>
                            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-2 flex items-center gap-3 transition-colors duration-500">
                                <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                                دسته‌بندی بر اساس رشته ورزشی
                            </h2>
                            <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base pr-5 transition-colors duration-500">مستقیم به سراغ رشته ورزشی مورد علاقه‌تان بروید</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-5">
                        <button v-for="sport in sportCategories" :key="sport.id" 
                                @click="goToProSearch(sport.name === 'سایر رشته‌ها' ? '' : sport.name)"
                                class="group bg-white/70 dark:bg-dark-card/70 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-brand-500/50 hover:bg-white dark:hover:bg-dark-card hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.15)]">
                            <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3', sport.color, sport.shadow]">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sport.icon"></path></svg>
                            </div>
                            <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">{{ sport.name }}</span>
                        </button>
                    </div>
                </div>

                <!-- بخش جدید: اسلایدر جدیدترین مجموعه‌ها -->
                <div class="mb-16 animate-fade-up">
                    <div class="flex items-end justify-between mb-8">
                        <div>
                            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-2 flex items-center gap-3 transition-colors duration-500">
                                <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                                جدیدترین مجموعه‌های ثبت شده
                            </h2>
                            <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base pr-5 transition-colors duration-500">تازه‌ترین سالن‌های ورزشی اضافه شده به سامانه</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-6 overflow-x-auto pb-8 pt-4 custom-scrollbar snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                        <div v-for="(venue, index) in latestVenues" :key="'latest-'+index" 
                             class="w-[85vw] sm:w-[320px] lg:w-[350px] flex-shrink-0 snap-center group relative bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#0a0f1d] rounded-[2rem] p-5 border border-slate-200 dark:border-white/5 hover:border-brand-500/50 transition-all duration-500 hover:-translate-y-3 shadow-lg dark:shadow-none hover:shadow-[0_22px_45px_-12px_rgba(6,182,212,0.3)] flex flex-col justify-between overflow-hidden">
                            
                            <div class="absolute -right-12 -top-12 w-32 h-32 bg-brand-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div>
                                <div class="relative h-44 rounded-2xl overflow-hidden mb-6 p-[2px] bg-slate-100 dark:bg-gradient-to-tr dark:from-brand-500/20 dark:to-blue-600/20 group-hover:from-brand-400 group-hover:to-cyan-400 transition-all duration-500 shadow-inner">
                                    <div class="w-full h-full rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-transparent">
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-[#0a0f1d] via-transparent to-transparent z-10 opacity-70"></div>
                                        <img :src="venue.image" :alt="venue.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                        
                                        <div class="absolute top-3 right-3 z-20 flex gap-1.5">
                                            <span class="bg-white/95 dark:bg-dark-bg/95 backdrop-blur text-[11px] font-black px-3 py-1.5 rounded-full text-brand-600 dark:text-brand-300 border border-slate-200 dark:border-white/10 flex items-center gap-1 shadow-md">
                                                <svg class="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                                {{ venue.rating }}
                                            </span>
                                        </div>

                                        <div class="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur px-2.5 py-1 rounded-lg">
                                            <span class="status-pulse"></span>
                                            <span class="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">آماده رزرو مستقیم</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="px-1">
                                    <h3 class="text-lg font-black text-slate-800 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors mb-4 line-clamp-1">
                                        {{ venue.name }}
                                    </h3>
                                    
                                    <div class="grid grid-cols-2 gap-3 mb-6">
                                        <div class="bg-slate-50 dark:bg-dark-bg/40 border border-slate-100 dark:border-white/5 rounded-xl p-2.5 flex items-center gap-2 transition-colors duration-500">
                                            <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 dark:text-brand-400 flex-shrink-0">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            </div>
                                            <div class="overflow-hidden">
                                                <span class="block text-[9px] text-slate-500">موقعیت</span>
                                                <span class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{{ venue.city }}</span>
                                            </div>
                                        </div>

                                        <div class="bg-slate-50 dark:bg-dark-bg/40 border border-slate-100 dark:border-white/5 rounded-xl p-2.5 flex items-center gap-2 transition-colors duration-500">
                                            <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 dark:text-brand-400 flex-shrink-0">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                            </div>
                                            <div class="overflow-hidden">
                                                <span class="block text-[9px] text-slate-500">پذیرش</span>
                                                <span class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{{ venue.gender }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4 border-t border-slate-200 dark:border-dark-border/60 flex items-center justify-between px-1 transition-colors duration-500">
                                <div>
                                    <span class="block text-[9px] text-slate-500 mb-0.5">قیمت هر سانس</span>
                                    <div class="text-brand-600 dark:text-brand-400 font-extrabold text-lg">
                                        {{ venue.price }} <span class="text-[10px] font-normal text-slate-400">تومان</span>
                                    </div>
                                </div>
                                <button @click="goToDetail(venue)" class="group/btn flex items-center gap-2 bg-brand-500 hover:bg-gradient-to-r hover:from-brand-400 hover:to-cyan-400 text-white dark:text-dark-bg font-black px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-glow hover:scale-[1.05]">
                                    <span class="text-xs">رزرو فوری</span>
                                    <svg class="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- بخش اماکن ورزشی محبوب (حفظ شده از قبل) -->
                <div class="mb-16 animate-fade-up">
                    <div class="flex items-end justify-between mb-8">
                        <div>
                            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-2 flex items-center gap-3 transition-colors duration-500">
                                <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                                اماکن ورزشی محبوب قم
                            </h2>
                            <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base pr-5 transition-colors duration-500">برخی از بهترین سالن‌های ورزشی ثبت شده با امکان رزرو مستقیم</p>
                        </div>
                        <a href="#" @click.prevent="currentView = 'pro-search'" class="hidden sm:flex items-center gap-1.5 text-brand-500 dark:text-brand-400 hover:text-brand-400 dark:hover:text-brand-300 font-bold transition-all group">
                            مشاهده همه اماکن
                            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div v-for="(venue, index) in popularVenues" :key="index" 
                             class="group relative bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#0a0f1d] rounded-[2rem] p-5 border border-slate-200 dark:border-white/5 hover:border-brand-500/50 transition-all duration-500 hover:-translate-y-3 shadow-lg dark:shadow-none hover:shadow-[0_22px_45px_-12px_rgba(6,182,212,0.3)] flex flex-col justify-between overflow-hidden">
                            
                            <div class="absolute -right-12 -top-12 w-32 h-32 bg-brand-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div>
                                <div class="relative h-44 rounded-2xl overflow-hidden mb-6 p-[2px] bg-slate-100 dark:bg-gradient-to-tr dark:from-brand-500/20 dark:to-blue-600/20 group-hover:from-brand-400 group-hover:to-cyan-400 transition-all duration-500 shadow-inner">
                                    <div class="w-full h-full rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-transparent">
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-[#0a0f1d] via-transparent to-transparent z-10 opacity-70"></div>
                                        <img :src="venue.image" :alt="venue.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                        
                                        <div class="absolute top-3 right-3 z-20 flex gap-1.5">
                                            <span class="bg-white/95 dark:bg-dark-bg/95 backdrop-blur text-[11px] font-black px-3 py-1.5 rounded-full text-brand-600 dark:text-brand-300 border border-slate-200 dark:border-white/10 flex items-center gap-1 shadow-md">
                                                <svg class="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                                {{ venue.rating }}
                                            </span>
                                        </div>

                                        <div class="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur px-2.5 py-1 rounded-lg">
                                            <span class="status-pulse"></span>
                                            <span class="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">آماده رزرو مستقیم</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="px-1">
                                    <h3 class="text-lg font-black text-slate-800 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors mb-4 line-clamp-1">
                                        {{ venue.name }}
                                    </h3>
                                    
                                    <div class="grid grid-cols-2 gap-3 mb-6">
                                        <div class="bg-slate-50 dark:bg-dark-bg/40 border border-slate-100 dark:border-white/5 rounded-xl p-2.5 flex items-center gap-2 transition-colors duration-500">
                                            <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 dark:text-brand-400 flex-shrink-0">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            </div>
                                            <div class="overflow-hidden">
                                                <span class="block text-[9px] text-slate-500">موقعیت</span>
                                                <span class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{{ venue.city }}</span>
                                            </div>
                                        </div>

                                        <div class="bg-slate-50 dark:bg-dark-bg/40 border border-slate-100 dark:border-white/5 rounded-xl p-2.5 flex items-center gap-2 transition-colors duration-500">
                                            <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 dark:text-brand-400 flex-shrink-0">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                            </div>
                                            <div class="overflow-hidden">
                                                <span class="block text-[9px] text-slate-500">پذیرش</span>
                                                <span class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{{ venue.gender }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4 border-t border-slate-200 dark:border-dark-border/60 flex items-center justify-between px-1 transition-colors duration-500">
                                <div>
                                    <span class="block text-[9px] text-slate-500 mb-0.5">قیمت هر سانس</span>
                                    <div class="text-brand-600 dark:text-brand-400 font-extrabold text-lg">
                                        {{ venue.price }} <span class="text-[10px] font-normal text-slate-400">تومان</span>
                                    </div>
                                </div>
                                <button @click="goToDetail(venue)" class="group/btn flex items-center gap-2 bg-brand-500 hover:bg-gradient-to-r hover:from-brand-400 hover:to-cyan-400 text-white dark:text-dark-bg font-black px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-glow hover:scale-[1.05]">
                                    <span class="text-xs">رزرو فوری</span>
                                    <svg class="w-4 h-4 transform group-hover/btn:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- بخش جدید: چرا رزرو اسپورت؟ -->
                <div class="mb-16 animate-fade-up">
                    <div class="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 border-brand-500/20">
                        <div class="absolute -left-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
                        <div class="absolute right-1/2 bottom-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]"></div>
                        
                        <div class="lg:w-1/2 relative z-10">
                            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-500">
                                <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                                چرا رزرو اسپورت؟
                            </h2>
                            <div class="space-y-6 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed text-justify">
                                <p>
                                    پیدا کردن سانس خالی و هماهنگی با سالن‌های ورزشی همیشه یکی از دغدغه‌های اصلی ورزشکاران بوده است. رزرو اسپورت با هدف ایجاد یک پل ارتباطی سریع و هوشمند بین ورزشکاران و مجموعه‌های ورزشی طراحی شده است.
                                </p>
                                <p>
                                    دیگر نیازی به تماس‌های تلفنی مکرر یا مراجعه حضوری برای اطلاع از سانس‌های خالی نیست. شما می‌توانید به صورت کاملا آنلاین، سانس‌های موجود در سالن‌های مختلف را مشاهده، مقایسه و تنها با چند کلیک، سانس دلخواه خود را رزرو و پرداخت کنید.
                                </p>
                                <p>
                                    ما در رزرو اسپورت تلاش می‌کنیم با ارائه اطلاعات دقیق، تصاویر باکیفیت از مجموعه‌ها و نمایش نظرات کاربران، تجربه‌ای مطمئن، سریع و لذت‌بخش را برای شما رقم بزنیم تا زمان بیشتری را صرف ورزش و زمان کمتری را صرف هماهنگی کنید!
                                </p>
                            </div>
                        </div>
                        
                        <div class="lg:w-1/2 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="bg-white/60 dark:bg-dark-card/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-600 flex items-center justify-center text-white mb-4 shadow-glow-subtle">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h4 class="font-bold text-slate-800 dark:text-white mb-2">صرفه‌جویی در زمان</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400">رزرو سریع در کمتر از یک دقیقه بدون نیاز به تماس تلفنی</p>
                            </div>
                            
                            <div class="bg-white/60 dark:bg-dark-card/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300 mt-0 sm:mt-8">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white mb-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h4 class="font-bold text-slate-800 dark:text-white mb-2">تضمین سانس</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400">قطعی شدن آنی رزرو پس از پرداخت موفق در درگاه امن</p>
                            </div>
                            
                            <div class="bg-white/60 dark:bg-dark-card/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white mb-4 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                </div>
                                <h4 class="font-bold text-slate-800 dark:text-white mb-2">مقایسه هوشمند</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400">مشاهده امکانات، قیمت و موقعیت ده‌ها سالن در یک نگاه</p>
                            </div>
                            
                            <div class="bg-white/60 dark:bg-dark-card/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300 mt-0 sm:mt-8">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white mb-4 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                                </div>
                                <h4 class="font-bold text-slate-800 dark:text-white mb-2">نظرات واقعی</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400">امکان ثبت و مشاهده نظرات ورزشکاران پس از استفاده</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <div class="container mx-auto px-4 pb-20 relative z-10">
                <div class="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-brand-500/20">
                    <div class="absolute right-0 top-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]"></div>
                    <div class="relative z-10 max-w-2xl text-center md:text-right">
                        <h3 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-500">مدیریت مجموعه ورزشی با شماست؟</h3>
                        <p class="text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-500">سالن یا زمین ورزشی خود را در رزرو اسپورت ثبت کنید و تقویم رزروهای خود را به صورت کاملا آنلاین و هوشمند مدیریت کنید. افزایش درآمد و کاهش دردسرهای هماهنگی.</p>
                        <button class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white dark:text-dark-bg font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-glow hover:scale-[1.04]">
                            ثبت رایگان مجموعه ورزشی
                        </button>
                    </div>
                    <div class="relative z-10 hidden md:block">
                        <div class="w-48 h-48 rounded-full border-4 border-dashed border-brand-500/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                            <div class="w-32 h-32 rounded-full bg-brand-50 dark:bg-brand-500/20 backdrop-blur flex items-center justify-center border border-brand-500/50">
                                <svg class="w-12 h-12 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <component :is="'style'">
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            </component>
        </div>
    `
}