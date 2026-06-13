import { store, toggleDropdown, selectOption, applyFilters, resetFilters, handleSlotBooking, openQuickBook } from './store.js';

export default {
    setup() {
        const { toRefs } = window.Vue;
        return { 
            ...toRefs(store), 
            toggleDropdown, 
            selectOption, 
            applyFilters, 
            resetFilters, 
            handleSlotBooking, 
            openQuickBook 
        };
    },
    template: `
        <div class="pt-24 lg:pt-32 pb-20 relative z-10">
            <div class="container mx-auto px-4">
                
                <div class="glass-panel rounded-2xl p-4 mb-8 border-brand-500/20 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-30">
                    <div class="flex items-center gap-3 w-full lg:w-auto">
                        <button @click="currentView = 'home'" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-dark-bg hover:bg-brand-50 dark:hover:bg-brand-500/10 border border-slate-200 dark:border-dark-border hover:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 transition-colors">
                            <svg class="w-5 h-5 rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                        <div>
                            <h3 class="text-base font-bold text-slate-800 dark:text-white">نتایج جستجوی اماکن</h3>
                            <p class="text-[10px] text-slate-500 dark:text-slate-400">یافت شده بر اساس فیلترهای شما</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 w-full lg:w-auto flex-1 max-w-4xl relative z-40">
                        
                        <div class="relative" @click.stop>
                            <div @click="toggleDropdown('city')" class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-xs rounded-xl p-3 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:border-brand-500">
                                <span>{{ filters.city }}</span>
                                <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            <transition name="dropdown">
                                <div v-if="activeDropdown === 'city'" class="absolute left-0 right-0 mt-1.5 rounded-xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 overflow-hidden">
                                    <div v-for="option in options.city" :key="option" @click="selectOption('city', option); applyFilters();" class="px-4 py-2.5 text-xs text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors">{{ option }}</div>
                                </div>
                            </transition>
                        </div>

                        <div class="relative" @click.stop>
                            <div @click="toggleDropdown('type')" class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-xs rounded-xl p-3 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:border-brand-500">
                                <span>{{ filters.type }}</span>
                                <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            <transition name="dropdown">
                                <div v-if="activeDropdown === 'type'" class="absolute left-0 right-0 mt-1.5 rounded-xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 overflow-hidden">
                                    <div v-for="option in options.type" :key="option" @click="selectOption('type', option); applyFilters();" class="px-4 py-2.5 text-xs text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors">{{ option }}</div>
                                </div>
                            </transition>
                        </div>

                        <div class="relative" @click.stop>
                            <div @click="toggleDropdown('day')" class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-xs rounded-xl p-3 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:border-brand-500">
                                <span>{{ filters.day }}</span>
                                <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            <transition name="dropdown">
                                <div v-if="activeDropdown === 'day'" class="absolute left-0 right-0 mt-1.5 rounded-xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 max-h-48 overflow-y-auto">
                                    <div v-for="option in options.day" :key="option" @click="selectOption('day', option); applyFilters();" class="px-4 py-2.5 text-xs text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors">{{ option }}</div>
                                </div>
                            </transition>
                        </div>

                        <div class="relative" @click.stop>
                            <div @click="toggleDropdown('time')" class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-xs rounded-xl p-3 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:border-brand-500">
                                <span>{{ filters.time }}</span>
                                <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            <transition name="dropdown">
                                <div v-if="activeDropdown === 'time'" class="absolute left-0 right-0 mt-1.5 rounded-xl border border-slate-200 dark:border-white/10 glass-panel shadow-2xl z-50 overflow-hidden">
                                    <div v-for="option in options.time" :key="option" @click="selectOption('time', option); applyFilters();" class="px-4 py-2.5 text-xs text-right text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg cursor-pointer transition-colors">{{ option }}</div>
                                </div>
                            </transition>
                        </div>

                    </div>
                </div>

                <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-slate-500 dark:text-slate-400">فیلترهای فعال:</span>
                        <span class="text-[10px] bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full">{{ filters.city }}</span>
                        <span class="text-[10px] bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full">{{ filters.type }}</span>
                        <span class="text-[10px] bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full">{{ filters.day }}</span>
                        <span class="text-[10px] bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full">{{ filters.time }}</span>
                    </div>
                    <div class="text-xs text-brand-600 dark:text-brand-400 font-bold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-4 py-2 rounded-xl transition-colors duration-500">
                        تعداد نتایج: {{ filteredVenues.length }} سالن ورزشی
                    </div>
                </div>

                <div v-if="filteredVenues.length === 0" class="glass-panel rounded-3xl p-16 text-center border-brand-500/10 my-12">
                    <div class="w-16 h-16 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-500 dark:text-brand-400 shadow-glow">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-2">موردی پیدا نشد!</h4>
                    <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-loose">متأسفانه برای فیلترهای انتخاب شده سالن ورزشی فعالی یافت نشد. لطفاً روز هفته یا نوع سالن ورزشی خود را تغییر دهید.</p>
                    <button @click="resetFilters" class="mt-6 bg-brand-500 hover:bg-brand-400 text-white dark:text-dark-bg font-bold px-6 py-2.5 rounded-xl transition-all duration-300">بازنشانی فیلترها</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div v-for="(venue, index) in filteredVenues" :key="index"
                         class="group glass-card rounded-[2.5rem] p-6 hover:border-brand-500/40 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.25)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between">
                        
                        <div>
                            <div class="flex items-center justify-between gap-4 mb-6">
                                <div class="space-y-1.5 flex-1">
                                    <div class="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-500/20">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {{ venue.timeSlot }}
                                    </div>
                                    <h3 class="text-xl font-extrabold text-slate-800 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors leading-snug">{{ venue.name }}</h3>
                                    <div class="text-slate-500 dark:text-slate-300 text-sm">
                                        شروع قیمت: <span class="text-brand-600 dark:text-brand-400 font-bold text-base">{{ venue.price }}</span> <span class="text-xs text-slate-400 dark:text-slate-500">تومان</span>
                                    </div>
                                </div>

                                <div class="relative w-20 h-20 flex-shrink-0">
                                    <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500 to-blue-600 p-[2px] shadow-glow group-hover:rotate-6 transition-transform duration-500">
                                        <div class="w-full h-full rounded-full bg-slate-50 dark:bg-dark-bg overflow-hidden border-2 border-white dark:border-dark-card">
                                            <img :src="venue.image" :alt="venue.name" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                    <span class="absolute -bottom-1 -left-1 bg-white/90 dark:bg-dark-bg/90 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-yellow-500 dark:text-yellow-400 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                        ★{{ venue.rating }}
                                    </span>
                                </div>
                            </div>

                            <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 mb-6 transition-colors duration-500">
                                <div class="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                                    <span>سانس‌های رزرو سریع:</span>
                                    <span class="text-[10px] text-slate-400 dark:text-slate-500">جهت رزرو مستقیم کلیک کنید</span>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="handleSlotBooking(venue, venue.slots[0])" 
                                            :disabled="!venue.slots[0].reservable"
                                            class="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-300 relative overflow-hidden group/slot"
                                            :class="venue.slots[0].reservable ? 'bg-brand-50 dark:bg-brand-500/5 hover:bg-brand-100 dark:hover:bg-brand-500/20 border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 hover:scale-[1.03]' : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'">
                                        <span class="text-xs font-semibold mb-1" :class="venue.slots[0].reservable ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'">{{ venue.slots[0].date }}</span>
                                        <span class="text-[10px] px-2 py-0.5 rounded-md font-bold" 
                                              :class="venue.slots[0].reservable ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'">
                                            {{ venue.slots[0].reservable ? 'قابل رزرو' : 'غیرقابل رزرو' }}
                                        </span>
                                    </button>

                                    <button @click="handleSlotBooking(venue, venue.slots[1])" 
                                            :disabled="!venue.slots[1].reservable"
                                            class="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-300 relative overflow-hidden group/slot"
                                            :class="venue.slots[1].reservable ? 'bg-brand-50 dark:bg-brand-500/5 hover:bg-brand-100 dark:hover:bg-brand-500/20 border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 hover:scale-[1.03]' : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'">
                                        <span class="text-xs font-semibold mb-1" :class="venue.slots[1].reservable ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'">{{ venue.slots[1].date }}</span>
                                        <span class="text-[10px] px-2 py-0.5 rounded-md font-bold" 
                                              :class="venue.slots[1].reservable ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'">
                                            {{ venue.slots[1].reservable ? 'قابل رزرو' : 'غیرقابل رزرو' }}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button @click="openQuickBook(venue)" class="w-full bg-white dark:bg-dark-bg/80 hover:bg-brand-500 hover:text-white dark:hover:text-dark-bg border border-slate-200 dark:border-dark-border hover:border-brand-500 py-3 rounded-2xl text-slate-700 dark:text-slate-300 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-glow">
                            <span>مشاهده بیشتر و رزرو سانس‌های دیگر ...</span>
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `
}