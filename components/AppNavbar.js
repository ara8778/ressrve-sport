import { store, toggleTheme, toggleNotifications } from './store.js';

export default {
    setup() {
        const { ref, toRefs, onMounted, onUnmounted } = window.Vue;
        const scrolled = ref(false);

        const handleScroll = () => {
            scrolled.value = window.scrollY > 50;
        };

        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        return { 
            ...toRefs(store), 
            toggleTheme, 
            toggleNotifications, 
            scrolled 
        };
    },
    template: `
        <nav class="fixed w-full z-50 glass-panel border-b border-slate-200 dark:border-dark-border transition-all duration-300" :class="{'py-2': scrolled, 'py-4': !scrolled}">
            <div class="container mx-auto px-4 lg:px-8">
                <div class="flex justify-between items-center">
                    
                    <div class="flex items-center gap-4">
                        <button @click.stop="isMobileMenuOpen = true" class="lg:hidden text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>

                        <div @click="currentView = 'home'" class="flex items-center gap-2 cursor-pointer group">
                            <div class="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-blue-600 items-center justify-center shadow-glow group-hover:rotate-12 transition-transform duration-300">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">رزرو اسپورت</span>
                        </div>
                    </div>

                    <div class="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <a href="#" @click.prevent="currentView = 'dashboard'" class="nav-link hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-700">مجموعه ورزشی دارید؟</a>
                        <a href="#" @click.prevent="currentView = 'about'" class="nav-link hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-700" :class="{'text-brand-500 dark:text-brand-400 font-bold nav-link-active': currentView === 'about'}">درباره ما</a>
                        <!-- لینک داینامیک سوالات متداول در بخش دسکتاپ -->
                        <a href="#" @click.prevent="currentView = 'faq'" class="nav-link hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-700" :class="{'text-brand-500 dark:text-brand-400 font-bold nav-link-active': currentView === 'faq'}">سوالات متداول</a>
                        <a href="#" @click.prevent="currentView = 'contact'" class="nav-link hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-700" :class="{'text-brand-500 dark:text-brand-400 font-bold nav-link-active': currentView === 'contact'}">تماس با ما</a>
                    </div>

                    <div class="flex items-center gap-3 sm:gap-4">
                        
                        <button @click.stop="toggleTheme" class="text-slate-500 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 duration-500 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                            <svg v-if="!isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </button>

                        <div class="relative hidden sm:block" @click.stop>
                            <button @click="toggleNotifications" class="text-slate-500 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 duration-700 transition-colors relative p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5 nudge-left-5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg"></span>
                            </button>

                            <transition name="dropdown">
                                <div v-if="showNotifications" class="absolute left-0 mt-3 w-80 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                                    <div class="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-dark-bg/50">
                                        <h4 class="font-bold text-slate-800 dark:text-white text-sm">اعلان‌های شما</h4>
                                        <span class="text-xs text-brand-500 bg-brand-500/10 px-2 py-1 rounded-md">{{ notificationHistory.length }} مورد</span>
                                    </div>
                                    <div class="max-h-80 overflow-y-auto">
                                        <div v-if="notificationHistory.length === 0" class="p-6 text-center text-slate-500 text-sm">
                                            هیچ اعلانی برای نمایش وجود ندارد.
                                        </div>
                                        <div v-else class="divide-y divide-slate-100 dark:divide-white/5">
                                            <div v-for="notif in notificationHistory" :key="notif.id" class="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" :class="{'bg-brand-50 dark:bg-brand-500/5': !notif.read}">
                                                <div class="flex items-start gap-3">
                                                    <div class="w-8 h-8 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <svg v-if="notif.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <h5 class="text-sm font-bold text-slate-800 dark:text-white mb-1">{{ notif.title }}</h5>
                                                        <p class="text-xs text-slate-500 leading-relaxed">{{ notif.message }}</p>
                                                        <span class="text-[10px] text-slate-400 mt-2 block">{{ notif.time }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <div class="h-6 w-px bg-slate-300 dark:bg-dark-border hidden sm:block"></div>
                        
                        <button @click="currentView = 'dashboard'" class="flex items-center gap-2 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-500 hover:text-white text-brand-600 dark:text-brand-400 border border-brand-500/20 px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-300 font-bold group text-sm sm:text-base shadow-sm">
                            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            <span class="hidden sm:inline">داشبورد</span>
                        </button>

                        <button @click="currentView = 'auth'" class="flex items-center gap-2 bg-white dark:bg-dark-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-dark-border hover:border-brand-500 dark:hover:border-brand-500 px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-300 font-medium group text-sm sm:text-base">
                            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                            <span class="hidden sm:inline">ورود / ثبت‌نام</span>
                            <span class="sm:hidden">ورود</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <transition name="fade-slide">
            <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[60] lg:hidden" @click="isMobileMenuOpen = false">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                <transition name="drawer-slide">
                    <div v-if="isMobileMenuOpen" @click.stop class="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-dark-card border-l border-slate-200 dark:border-dark-border shadow-2xl flex flex-col">
                        <div class="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <span class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-l from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">منوی سایت</span>
                            <button @click="isMobileMenuOpen = false" class="text-slate-500 hover:text-brand-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 p-1.5 rounded-lg transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                            <a href="#" @click.prevent="currentView = 'home'; isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-500 transition-colors">صفحه اصلی</a>
                            <a href="#" @click.prevent="currentView = 'dashboard'; isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-500 transition-colors">مجموعه ورزشی دارید؟</a>
                            <a href="#" @click.prevent="currentView = 'about'; isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-500 transition-colors">درباره ما</a>
                            <!-- لینک داینامیک سوالات متداول در بخش موبایل -->
                            <a href="#" @click.prevent="currentView = 'faq'; isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-500 transition-colors">سوالات متداول</a>
                            <a href="#" @click.prevent="currentView = 'contact'; isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-500 transition-colors">تماس با ما</a>
                            
                            <div class="my-4 border-t border-slate-100 dark:border-white/5"></div>
                            
                            <button @click="toggleNotifications" class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-500 transition-colors">
                                <span class="flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                    اعلان‌ها
                                </span>
                                <span v-if="unreadNotifications > 0" class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{{ unreadNotifications }}</span>
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    `
}