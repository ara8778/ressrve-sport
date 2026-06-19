import { store, handleSlotBooking, closeAllDropdowns } from './store.js';

export default {
    setup() {
        const { toRefs, onMounted, ref } = window.Vue;

        const ratingInput = ref(5);
        const reviewText = ref('');
        const reviewerName = ref('');

        onMounted(() => {
            // اطمینان از مقداردهی ایمن سالن انتخاب شده
            if (!store.selectedVenue || !store.selectedVenue.name) {
                store.selectedVenue = store.popularVenues[0] || store.allVenuesDatabase[0];
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const selectSlot = (slot) => {
            if (slot.status === 'reservable') {
                handleSlotBooking(store.selectedVenue, {
                    date: slot.date + ' (ساعت ' + slot.time + ')',
                    reservable: true
                });
            }
        };

        const bookQuickest = () => {
            // رزرو سریع‌ترین سانس خالی فعال
            const defaultSlot = { date: 'رزرو سریع‌ترین سانس خالی', reservable: true };
            handleSlotBooking(store.selectedVenue, defaultSlot);
        };

        const goBack = () => {
            store.currentView = 'home';
        };

        const submitComment = () => {
            if (!reviewerName.value || !reviewText.value) return;
            
            // شبیه‌سازی ثبت نظر با توست اختصاصی پلتفرم
            const activeToasts = store.toasts || [];
            const id = Date.now();
            const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
            
            const newToast = {
                id,
                title: 'ثبت دیدگاه موفق 💬',
                message: `${reviewerName.value} عزیز، نظر شما با امتیاز ${ratingInput.value} ثبت گردید و پس از تایید نمایش داده می‌شود.`,
                type: 'success',
                time
            };

            store.toasts.push(newToast);
            store.notificationHistory.unshift(newToast);
            
            if (!store.showNotifications) {
                store.unreadNotifications++;
            }

            setTimeout(() => {
                store.toasts = store.toasts.filter(t => t.id !== id);
            }, 5000);

            // ریست فرم
            reviewerName.value = '';
            reviewText.value = '';
            ratingInput.value = 5;
        };

        return { 
            ...toRefs(store), 
            selectSlot, 
            bookQuickest,
            goBack,
            ratingInput,
            reviewText,
            reviewerName,
            submitComment,
            closeAllDropdowns 
        };
    },
    template: `
        <div class="pt-24 lg:pt-32 pb-20 relative z-10 transition-colors duration-500">
            <div class="container mx-auto px-4" v-if="selectedVenue">

                <!-- هدر جزئیات سالن با بازگشت شیک -->
                <div class="glass-panel rounded-3xl p-6 md:p-8 mb-10 border-brand-500/20 animate-fade-up">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="flex items-center gap-5 w-full md:w-auto">
                            <!-- بازگشت شیک -->
                            <button @click="goBack" class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-dark-bg hover:bg-brand-50 dark:hover:bg-brand-500/10 border border-slate-200 dark:border-dark-border hover:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 transition-colors">
                                <svg class="w-5 h-5 rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                            <div class="relative w-24 h-24 flex-shrink-0">
                                <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500 to-blue-600 p-[2px] shadow-glow group-hover:rotate-6 transition-transform duration-500">
                                    <div class="w-full h-full rounded-full bg-slate-50 dark:bg-dark-bg overflow-hidden border-2 border-white dark:border-dark-card">
                                        <img :src="selectedVenue.image" :alt="selectedVenue.name" class="w-full h-full object-cover">
                                    </div>
                                </div>
                                <span class="absolute -bottom-1 -left-1 bg-white/90 dark:bg-dark-bg/90 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-yellow-500 dark:text-yellow-400 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                    ★{{ selectedVenue.rating || '5.0' }}
                                </span>
                            </div>
                            <div class="flex-1">
                                <div class="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-500/20 mb-2">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {{ selectedVenue.timeSlot || 'ساعات فعالیت در جدول سانس‌ها' }}
                                </div>
                                <h1 class="text-3xl font-extrabold bg-gradient-to-l from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent mb-1 transition-colors duration-500">{{ selectedVenue.name }}</h1>
                                <p class="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 truncate transition-colors duration-500">
                                    <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    قم، منطقه ورزشی {{ selectedVenue.city }}، خیابان نمونه، کوچه تست
                                </p>
                            </div>
                        </div>
                        <button @click="bookQuickest" class="w-full md:w-auto bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-glow hover:scale-[1.04] active:scale-95 text-base relative overflow-hidden group/btn shimmer-btn">
                            <span class="status-pulse group-hover/btn:animate-pulse"></span>
                            <span>رزرو سریع اولین سانس خالی</span>
                            <svg class="w-5 h-5 transform group-hover/btn:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- گالری تصاویر جذاب سالن -->
                <div class="glass-panel rounded-3xl p-5 mb-10 grid grid-cols-2 md:grid-cols-4 gap-5 animate-fade-up delay-100 border-brand-500/10">
                    <div v-for="(img, idx) in [selectedVenue.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518605368461-1e9de45688ee?q=80&w=1469&auto=format&fit=crop', 'https://images.unsplash.com/photo-1628751538356-0ea7dceb43a9?q=80&w=1470&auto=format&fit=crop']" :key="idx" 
                         class="group relative h-40 md:h-48 rounded-2xl overflow-hidden p-[1px] bg-slate-100 dark:bg-gradient-to-tr dark:from-brand-500/20 dark:to-blue-600/20 group-hover:from-brand-400 group-hover:to-cyan-400 transition-all duration-500 shadow-inner">
                        <div class="w-full h-full rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-transparent">
                            <img :src="img" :alt="selectedVenue.name + idx" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-[#0a0f1d] via-transparent to-transparent z-10 opacity-70"></div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div class="lg:col-span-2 space-y-8">
                        <div class="glass-panel rounded-3xl p-8 animate-fade-up delay-200 border-brand-500/10">
                            <h2 class="text-2xl font-extrabold text-slate-800 dark:text-white mb-5 flex items-center gap-3 transition-colors duration-500">
                                <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                                درباره مجموعه ورزشی
                            </h2>
                            <p class="text-slate-600 dark:text-slate-400 text-sm leading-loose transition-colors duration-500">
                                سالن ورزشی {{ selectedVenue.name }} با بهره‌گیری از کادری مجرب و امکانات مدرن و به‌روز، فضایی لوکس و مهیج را برای تمامی ورزشکاران فراهم نموده است. این مجموعه افتخار دارد که با امکاناتی نظیر رختکن عمومی، سیستم گرمایش و سرمایش، بوفه و پارکینگ، خدماتی در شأن شما عزیزان ارائه نماید. مفتخریم که امکان رزرو آسان و آنلاین سانس‌ها را بدون پرداخت هیچگونه هزینه اضافی برای تمام ورزشکاران در رزرو اسپورت فراهم نموده‌ایم.
                            </p>
                        </div>

                        <div class="glass-panel rounded-3xl p-8 animate-fade-up delay-300 border-brand-500/10">
                            <h2 class="text-2xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-500">
                                <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                                تگ‌ها و امکانات مجموعه ورزشی
                            </h2>
                            <div class="flex flex-wrap gap-3">
                                <span v-for="tag in ['سالن فوتسال', 'سالن والیبال', 'رختکن', 'سیستم تهویه', 'بوفه', 'پارکینگ']" :key="tag" 
                                      class="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-bold px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-500/20">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- بخش رزرو سانس‌ها در سایدبار راست -->
                    <div class="glass-panel rounded-3xl p-6 lg:p-8 animate-fade-up delay-400 border-brand-500/10">
                        <h2 class="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-500">
                            <span class="w-2.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full inline-block"></span>
                            رزرو سانس‌های فعال
                        </h2>
                        
                        <div class="relative mb-6" @click.stop>
                            <div class="bg-white dark:bg-dark-bg/80 border border-slate-200 dark:border-dark-border text-xs rounded-xl p-3.5 text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:border-emerald-500">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    برنامه هفتگی سانس‌های باز
                                </span>
                            </div>
                        </div>

                        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            <div v-for="(slot, idx) in [
                                { time: '۱۴:۳۰ تا ۱۶:۰۰', date: '۱۴۰۴/۰۹/۰۴', price: selectedVenue.price || '۵۰۰,۰۰۰', status: 'reservable' },
                                { time: '۱۶:۰۰ تا ۱۷:۳۰', date: '۱۴۰۴/۰۹/۰۴', price: selectedVenue.price || '۵۰۰,۰۰۰', status: 'filled' },
                                { time: '۱۷:۳۰ تا ۱۹:۰۰', date: '۱۴۰۴/۰۹/۰۴', price: selectedVenue.price || '۵۰۰,۰۰۰', status: 'reservable' },
                                { time: '۱۹:۰۰ تا ۲۰:۳۰', date: '۱۴۰۴/۰۹/۰۴', price: selectedVenue.price || '۵۰۰,۰۰۰', status: 'past' },
                                { time: '۲۰:۳۰ تا ۲۲:۰۰', date: '۱۴۰۴/۰۹/۰۴', price: selectedVenue.price || '۵۰۰,۰۰۰', status: 'filled' },
                                { time: '۲۲:۰۰ تا ۲۳:۳۰', date: '۱۴۰۴/۰۹/۰۴', price: selectedVenue.price || '۵۰۰,۰۰۰', status: 'reservable' }
                            ]" :key="idx" 
                                 class="glass-card rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between"
                                 :class="{
                                    'hover:border-emerald-500/40 hover:shadow-glow hover:scale-[1.03]': slot.status === 'reservable',
                                    'border-red-200 dark:border-red-900/50': slot.status === 'filled',
                                    'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600': slot.status === 'past'
                                 }">
                                
                                <div>
                                    <div class="flex items-center justify-between gap-3 mb-3">
                                        <div class="flex items-center gap-1.5">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span class="text-sm font-bold text-slate-800 dark:text-white" :class="{'text-slate-400 dark:text-slate-600': slot.status === 'past'}">{{ slot.time }}</span>
                                        </div>
                                        <span class="text-[10px] px-2 py-0.5 rounded-md font-bold" 
                                              :class="{
                                                'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300': slot.status === 'reservable',
                                                'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300': slot.status === 'filled',
                                                'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600': slot.status === 'past'
                                              }">
                                            {{ slot.status === 'reservable' ? 'قابل رزرو' : (slot.status === 'filled' ? 'پر شده' : 'غیرفعال') }}
                                        </span>
                                    </div>

                                    <div class="text-slate-500 dark:text-slate-400 text-xs mb-3 flex items-center justify-between" :class="{'text-slate-400 dark:text-slate-600': slot.status === 'past'}">
                                        <span>قیمت سانس: <span class="font-bold text-base text-brand-600 dark:text-brand-400" :class="{'text-slate-400 dark:text-slate-600': slot.status === 'past'}">{{ slot.price }}</span> تومان</span>
                                        <span v-if="slot.status === 'reservable'" class="status-pulse"></span>
                                    </div>
                                </div>

                                <button v-if="slot.status === 'reservable'" @click="selectSlot(slot)" 
                                        class="w-full bg-emerald-500 hover:bg-emerald-400 text-white dark:text-dark-bg font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 hover:shadow-glow flex items-center justify-center gap-1.5">
                                    <span>انتخاب و ادامه رزرو</span>
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                <button v-else :disabled="true" 
                                        class="w-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                                    <span>غیرقابل رزرو</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- بخش شیک ثبت دیدگاه و نظرات زنده -->
                <div class="mb-10 animate-fade-up delay-500">
                    <h2 class="text-2xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-500">
                        <span class="w-2.5 h-8 bg-gradient-to-b from-brand-400 to-cyan-600 rounded-full inline-block"></span>
                        نظرات و تجربیات کاربران
                    </h2>

                    <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 border-brand-500/10">
                        <h4 class="text-lg font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-500">ثبت نظر جدید و امتیازدهی به مجموعه</h4>
                        
                        <form @submit.prevent="submitComment">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div class="relative group rounded-xl">
                                    <span class="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </span>
                                    <input type="text" v-model="reviewerName" required placeholder="نام و نام خانوادگی" dir="rtl"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300">
                                </div>
                                <div class="md:col-span-2 flex items-center justify-between gap-4 bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-300">
                                    <span class="font-bold text-slate-500 dark:text-slate-400">امتیاز شما به مجموعه:</span>
                                    <div class="flex items-center gap-1 text-yellow-400">
                                        <button v-for="star in 5" :key="star" type="button" @click="ratingInput = star" class="text-xl focus:outline-none transition-transform hover:scale-125">
                                            {{ star <= ratingInput ? '★' : '☆' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="relative group rounded-xl mb-6">
                                <span class="absolute top-4 right-4 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400 transition-colors">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </span>
                                <textarea v-model="reviewText" required placeholder="متن پیام و نظر شما درباره مجموعه ورزشی..." dir="rtl" rows="5"
                                           class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border focus:border-brand-500/50 rounded-xl py-3.5 pr-12 pl-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:shadow-glow-subtle transition-all duration-300"></textarea>
                            </div>
                            <div class="text-left">
                                <button type="submit" class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white dark:text-dark-bg font-extrabold px-10 py-3 rounded-xl transition-all duration-300 shadow-glow hover:scale-[1.04] text-sm">
                                    ثبت نظر و تجربه کاربری 🎉
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="space-y-6">
                        <div v-for="review in [
                            { name: 'امیرحسین رضایی', avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop', text: 'سالن بسیار تمیز و مدرنی بود. از رزرو تا حضور در مجموعه همه‌چیز عالی و بدون دردسر پیش رفت.', date: '۱۴ آذر ۱۴۰۴', answer: 'خوشحالم که تجربه خوبی داشتید. ما همیشه منتظر حضور گرم شما هستیم.' },
                            { name: 'سارا حسینی', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', text: 'امکانات عالی بود، مخصوصاً رختکن‌ها و سیستم تهویه. رزرو آنلاین هم خیلی سریع و خوب کار کرد.', date: '۱۲ آذر ۱۴۰۴', answer: 'از حسن نظر شما کمال تشکر را داریم.' }
                        ]" :key="review.name" 
                             class="glass-card rounded-[2.5rem] p-6 md:p-8 hover:border-brand-500/40 hover:shadow-glow transition-all duration-500">
                            
                            <div class="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-16 h-16 flex-shrink-0 rounded-full border-2 border-brand-500 overflow-hidden shadow-glow">
                                        <img :src="review.avatar" :alt="review.name" class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <h5 class="text-lg font-extrabold text-slate-800 dark:text-white group-hover:text-brand-500 duration-500 transition-colors">{{ review.name }}</h5>
                                        <p class="text-yellow-400 text-base flex items-center gap-0.5">★ ★ ★ ★ ★</p>
                                    </div>
                                </div>
                                <div class="text-sm text-brand-600 dark:text-brand-400 font-bold bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl transition-colors duration-500">
                                    ثبت شده در: {{ review.date }}
                                </div>
                            </div>

                            <p class="text-slate-600 dark:text-slate-400 text-sm leading-loose mb-6 transition-colors duration-500">{{ review.text }}</p>

                            <div class="bg-slate-50 dark:bg-dark-bg/60 border-t border-brand-500/20 rounded-2xl p-6 relative transition-colors duration-500">
                                <div class="w-4 h-4 bg-slate-50 dark:bg-dark-bg/60 absolute -top-2 right-10 rotate-45 border-r border-b border-brand-500/20"></div>
                                <h6 class="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2 transition-colors duration-500">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 status-pulse inline-block"></span>
                                    پاسخ مدیریت مجموعه
                                </h6>
                                <p class="text-slate-500 dark:text-slate-400 text-sm leading-loose transition-colors duration-500">{{ review.answer }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `
}