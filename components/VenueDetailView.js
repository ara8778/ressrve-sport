import { store, handleSlotBooking } from './store.js';

export default {
    setup() {
        const { toRefs, onMounted, ref, computed } = window.Vue;

        // وضعیت گالری تصاویر تعاملی
        const activeImageIndex = ref(0);
        const galleryImages = ref([]);

        // سیستم امتیازدهی و نظرات
        const ratingInput = ref(5);
        const ratingHover = ref(0);
        const reviewText = ref('');
        const reviewerName = ref('');
        const reviewerPhone = ref('');

        // فیلتر سانس‌ها (صبح، عصر، شب) برای دسترسی راحت‌تر
        const selectedTimeFilter = ref('all'); // 'all' | 'morning' | 'afternoon' | 'evening' | 'none'
        const activeFilterBtn = ref('all');
        const isLoadingFilter = ref(false); // وضعیت لودینگ نرم هنگام سورتینگ
        let filterTimeout = null;

        const changeFilter = (filter) => {
            if (activeFilterBtn.value === filter) return;
            
            clearTimeout(filterTimeout);
            activeFilterBtn.value = filter;
            selectedTimeFilter.value = 'none'; // خالی کردن جدول برای پخش انیمیشن خروج نرم
            isLoadingFilter.value = true;      // نمایش لودر لوکس
            
            filterTimeout = setTimeout(() => {
                isLoadingFilter.value = false;
                
                // تاخیر ریز برای رندر بهتر انیمیشن ورود بعد از مخفی شدن لودر
                setTimeout(() => {
                    selectedTimeFilter.value = filter; // پر کردن مجدد جدول با انیمیشن آبشاری
                }, 50);
            }, 400); // 400 میلی‌ثانیه مکث برای نمایش لودینگ باکلاس
        };

        // روز انتخاب شده در نسخه موبایل برای تبدیل جدول بزرگ به تب‌های سوایپ‌شونده مینی‌مال
        const activeMobileDayIdx = ref(0);

        // وضعیت لایک نظرات - تغییر به ذخیره نوع اکشن هر کاربر ('like' یا 'dislike')
        const commentLikes = ref({});

        // وضعیت پاسخ به کامنت‌ها
        const replyingToId = ref(null);
        const replyContent = ref('');
        
        // ردیف فعال در جدول سانس‌ها برای افکت بصری هنگام کلیک
        const activeMatrixRowId = ref(null);

        onMounted(() => {
            if (!store.selectedVenue || !store.selectedVenue.name) {
                store.selectedVenue = store.popularVenues[0] || store.allVenuesDatabase[0];
            }
            
            // پر کردن گالری تصاویر به صورت داینامیک و هوشمند بر اساس نوع سالن
            galleryImages.value = [
                store.selectedVenue.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518605368461-1e9de45688ee?q=80&w=1469&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1628751538356-0ea7dceb43a9?q=80&w=1470&auto=format&fit=crop'
            ];
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const changeMainImage = (index) => {
            activeImageIndex.value = index;
        };

        const goBack = () => {
            store.currentView = 'home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // تابع کمکی برای نمایش نوتیفیکیشن با قابلیت ناپدید شدن خودکار پس از ۵ ثانیه
        const showAutoToast = (toastData) => {
            const id = Date.now();
            store.toasts.push({ id, ...toastData });
            
            // حذف خودکار از استیت پس از ۵ ثانیه
            setTimeout(() => {
                const index = store.toasts.findIndex(t => t.id === id);
                if (index > -1) {
                    store.toasts.splice(index, 1);
                }
            }, 5000);
        };

        const weekDays = ref([
            { name: 'شنبه', date: '09/01' },
            { name: 'یکشنبه', date: '09/02' },
            { name: 'دوشنبه', date: '09/03' },
            { name: 'سه‌شنبه', date: '09/04' },
            { name: 'چهارشنبه', date: '09/05' },
            { name: 'پنج‌شنبه', date: '09/06' },
            { name: 'جمعه', date: '09/07' }
        ]);

        const timeRows = ref([
            { id: 1, range: '08:00 تا 09:30', period: 'morning' },
            { id: 2, range: '09:30 تا 11:00', period: 'morning' },
            { id: 3, range: '11:00 تا 12:30', period: 'morning' },
            { id: 4, range: '12:30 تا 14:00', period: 'morning' },
            { id: 5, range: '14:00 تا 15:30', period: 'afternoon' },
            { id: 6, range: '15:30 تا 17:00', period: 'afternoon' },
            { id: 7, range: '17:00 تا 18:30', period: 'afternoon' },
            { id: 8, range: '18:30 تا 20:00', period: 'evening' },
            { id: 9, range: '20:00 تا 21:30', period: 'evening' },
            { id: 10, range: '21:30 تا 23:00', period: 'evening' }
        ]);

        const getSlotStatus = (dayIdx, rowIdx) => {
            const val = (dayIdx * 3 + rowIdx * 7) % 5;
            if (val === 0) return { label: 'پر شده', class: 'bg-rose-500/10 text-rose-500 border-rose-500/20 cursor-not-allowed', code: 'booked', reservable: false };
            if (val === 1) return { label: 'غیرفعال', class: 'bg-slate-200 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-transparent cursor-not-allowed', code: 'disabled', reservable: false };
            if (val === 2) return { label: 'رزرو ویژه', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20 cursor-not-allowed', code: 'reserved', reservable: false };
            return { label: 'قابل رزرو', class: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:border-emerald-500 hover:shadow-glow-success cursor-pointer transform hover:scale-[1.03]', code: 'available', reservable: true };
        };

        const filteredTimeRows = computed(() => {
            if (selectedTimeFilter.value === 'none') return [];
            if (selectedTimeFilter.value === 'all') return timeRows.value;
            return timeRows.value.filter(row => row.period === selectedTimeFilter.value);
        });

        // کلیک روی ردیف بازه زمانی برای فعال کردن افکت
        const activateTimeRow = (rowId) => {
            activeMatrixRowId.value = rowId;
            setTimeout(() => { activeMatrixRowId.value = null; }, 1000); // بازگشت پس از 1 ثانیه
        };

        const selectMatrixSlot = (dayName, dateStr, timeRange, slotStatus) => {
            if (!slotStatus.reservable) {
                showAutoToast({
                    title: 'سانس غیرقابل انتخاب ⚠️',
                    message: `متاسفانه سانس ساعت ${timeRange} در روز ${dayName} پر شده یا در این لحظه غیرفعال است.`,
                    type: 'error',
                    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                });
                return;
            }

            handleSlotBooking(store.selectedVenue, {
                date: `${dayName} (${dateStr}) - سانس ساعت ${timeRange}`,
                reservable: true
            });
        };

        const bookQuickest = () => {
            handleSlotBooking(store.selectedVenue, {
                date: 'اولین سانس فعال و خالی این هفته',
                reservable: true
            });
        };

        const commentsList = ref([
            {
                id: 101,
                author: 'ابوالفضل دانش',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
                rating: 5,
                date: '۱۸ آذر ۱۴۰۴',
                content: 'کیفیت کفپوش سالن و نورپردازی واقعاً در سطح استانداردی قرار داره. فقط رختکن‌ها اگر کمد دیواری بیشتری داشت خیلی عالی می‌شد. در کل ممنون از پلتفرم خوبتون که رزرو آنلاین رو فراهم کرد.',
                likes: 12,
                dislikes: 1,
                replies: [
                    {
                        id: 201,
                        author: 'پشتیبانی مجموعه (جوادالائمه)',
                        isManagement: true,
                        avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=150',
                        date: '۱۹ آذر ۱۴۰۴',
                        content: 'سلام جناب دانش عزیز. ممنون از بازخورد ارزشمندتون. برنامه نوسازی رختکن‌ها در دست اقدامه و تا ماه آینده کمدهای جدید نصب خواهند شد. امیدواریم در بازی‌های بعدی رضایت کامل شما رو جلب کنیم.'
                    },
                    {
                        id: 301,
                        author: 'مدیریت کل رزرو اسپورت',
                        isSuperAdmin: true,
                        avatar: 'https://placehold.co/100x100/06b6d4/ffffff?text=RS',
                        date: '۲۰ آذر ۱۴۰۴',
                        content: 'سلام کاربر گرامی. خوشحالیم که از خدمات رزرواسیون رضایت دارید. به زودی سیستم تخفیفات دوره‌ای و سانس‌های لحظه آخری هم به این سالن اضافه خواهد شد.'
                    }
                ]
            },
            {
                id: 102,
                author: 'مریم حسینی',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
                rating: 4,
                date: '۱۵ آذر ۱۴۰۴',
                content: 'سانس‌های بانوان این مجموعه بسیار منظم برگزار میشه و امنیت و حریم خصوصی به خوبی رعایت شده. تهویه سالن هم حین ورزش مداوم کار میکنه و عالیه.',
                likes: 8,
                dislikes: 0,
                replies: []
            }
        ]);

        const submitComment = () => {
            if (!reviewerName.value || !reviewText.value) {
                showAutoToast({
                    title: 'خطای اعتبارسنجی ❌',
                    message: 'لطفاً نام و متن نظر خود را به صورت کامل وارد کنید.',
                    type: 'error',
                    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                });
                return;
            }

            const id = Date.now();
            const dateStr = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
            
            const newComment = {
                id,
                author: reviewerName.value,
                avatar: `https://placehold.co/100x100/06b6d4/ffffff?text=${reviewerName.value.substring(0,2)}`,
                rating: ratingInput.value,
                date: dateStr,
                content: reviewText.value,
                likes: 0,
                dislikes: 0,
                replies: []
            };

            commentsList.value.unshift(newComment);

            showAutoToast({
                title: 'دیدگاه شما ثبت شد 💬',
                message: `${reviewerName.value} عزیز، نظر شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.`,
                type: 'success',
                time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
            });

            reviewerName.value = '';
            reviewerPhone.value = '';
            reviewText.value = '';
            ratingInput.value = 5;
        };

        // منطق جدید لایک و دیس‌لایک حرفه‌ای (جلوگیری از ثبت همزمان و قابلیت بازپس‌گیری رای)
        const toggleLike = (commentId, type) => {
            const comment = commentsList.value.find(c => c.id === commentId);
            if (!comment) return;

            const currentAction = commentLikes.value[commentId];

            if (currentAction === type) {
                // اگر روی همان دکمه قبلی کلیک شد (بازپس‌گیری رای)
                if (type === 'like') comment.likes--;
                else comment.dislikes--;
                commentLikes.value[commentId] = null;
            } else {
                // اگر رای جدید است یا رای تغییر کرده
                if (currentAction === 'like') comment.likes--;
                if (currentAction === 'dislike') comment.dislikes--;

                if (type === 'like') comment.likes++;
                else comment.dislikes++;
                commentLikes.value[commentId] = type;
            }
        };

        // مدیریت باز و بسته شدن فرم پاسخ سریع
        const openReplyForm = (commentId) => {
            if (replyingToId.value === commentId) {
                replyingToId.value = null; // بستن تب
            } else {
                replyingToId.value = commentId; // باز کردن تب
                replyContent.value = '';
            }
        };

        const submitReply = (commentId) => {
            if (!replyContent.value.trim()) return;
            
            const comment = commentsList.value.find(c => c.id === commentId);
            if (comment) {
                const dateStr = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
                comment.replies.push({
                    id: Date.now(),
                    author: 'کاربر مهمان',
                    isManagement: false,
                    avatar: 'https://placehold.co/100x100/06b6d4/ffffff?text=ک',
                    date: dateStr,
                    content: replyContent.value
                });
                
                showAutoToast({
                    title: 'پاسخ ثبت شد ✔️',
                    message: 'پاسخ شما با موفقیت به این دیدگاه اضافه شد.',
                    type: 'success',
                    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                });

                replyingToId.value = null;
                replyContent.value = '';
            }
        };

        const specsList = ref([
            { title: 'کفپوش سالن', value: 'پارکت چوبی کانادایی ضد لغزش', icon: '🏆' },
            { title: 'سیستم تهویه', value: 'هواساز سرمایشی/گرمایشی مجهز به فیلتر هپا', icon: '💨' },
            { title: 'ظرفیت سالن', value: 'دارای جایگاه تماشاگران با ظرفیت ۱۵۰ نفر', icon: '👥' },
            { title: 'امکانات جانبی', value: 'رختکن وی‌آی‌پی، دوش آب گرم، بوفه اختصاصی، پارکینگ مجهز', icon: '🚗' }
        ]);

        return {
            ...toRefs(store),
            activeImageIndex,
            galleryImages,
            ratingInput,
            ratingHover,
            reviewText,
            reviewerName,
            reviewerPhone,
            selectedTimeFilter,
            activeFilterBtn,
            isLoadingFilter,
            changeFilter,
            activeMobileDayIdx,
            weekDays,
            timeRows,
            getSlotStatus,
            filteredTimeRows,
            activeMatrixRowId,
            activateTimeRow,
            changeMainImage,
            goBack,
            selectMatrixSlot,
            bookQuickest,
            commentsList,
            submitComment,
            toggleLike,
            commentLikes,
            replyingToId,
            replyContent,
            openReplyForm,
            submitReply,
            specsList
        };
    },
    template: `
        <div class="pt-24 lg:pt-32 pb-20 relative z-10 transition-colors duration-500 overflow-hidden">
            <!-- استایل‌های داخلی برای انیمیشن‌های لیست و لودر اختصاصی -->
            <style>
                .stagger-matrix-move {
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .stagger-matrix-enter-active {
                    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                    /* تاخیر آبشاری بر اساس ایندکس متغیر --i */
                    transition-delay: calc(var(--i, 0) * 0.08s); 
                }
                .stagger-matrix-leave-active {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .stagger-matrix-enter-from {
                    opacity: 0;
                    transform: translateY(40px); /* بالا آمدن آرام از پایین */
                    filter: blur(8px);
                }
                .stagger-matrix-leave-to {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.98);
                    filter: blur(4px);
                }

                /* انیمیشن لودر موج صدا (مخصوص فیلتر سانس‌ها) */
                @keyframes waveform {
                    0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
                    50% { transform: scaleY(1.4); opacity: 1; box-shadow: 0 0 12px rgba(6, 182, 212, 0.6); }
                }
                .wave-bar {
                    width: 6px;
                    border-radius: 999px;
                    background: linear-gradient(to top, #0ea5e9, #06b6d4);
                    animation: waveform 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .wave-bar:nth-child(1) { height: 20px; animation-delay: 0s; }
                .wave-bar:nth-child(2) { height: 32px; animation-delay: 0.15s; }
                .wave-bar:nth-child(3) { height: 20px; animation-delay: 0.3s; }
            </style>

            <div class="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-30 pointer-events-none"></div>
            <div class="absolute top-1/4 -right-20 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div class="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div class="container mx-auto px-4 lg:px-8 relative z-10" v-if="selectedVenue">
                
                <div class="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-up">
                    <div class="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <span class="hover:text-brand-500 cursor-pointer transition-colors" @click="goBack">صفحه اصلی</span>
                        <svg class="w-3.5 h-3.5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        <span class="hover:text-brand-500 cursor-pointer transition-colors">مجموعه های ورزشی قم</span>
                        <svg class="w-3.5 h-3.5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        <span class="text-slate-800 dark:text-white font-black">{{ selectedVenue.name }}</span>
                    </div>
                    
                    <button @click="goBack" class="flex items-center gap-2 bg-white dark:bg-dark-card hover:bg-brand-50 dark:hover:bg-brand-500/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-border px-4 py-2.5 rounded-2xl transition-all duration-300 shadow-sm text-xs font-bold group">
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        بازگشت به نتایج جستجو
                    </button>
                </div>

                <div class="glass-panel rounded-[2.5rem] p-6 lg:p-10 mb-10 border-brand-500/10 shadow-2xl animate-fade-up delay-100 relative overflow-hidden">
                    <div class="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div class="lg:col-span-5 space-y-4">
                            <div class="relative h-64 md:h-80 rounded-[2rem] overflow-hidden border-2 border-brand-500/20 shadow-glow-subtle group">
                                <img :src="galleryImages[activeImageIndex]" :alt="selectedVenue.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent pointer-events-none"></div>
                                <div class="absolute bottom-5 right-5 z-20 flex items-center gap-2">
                                    <span class="bg-black/70 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur border border-white/10">
                                        تصویر {{ activeImageIndex + 1 }} از {{ galleryImages.length }}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-4 gap-3">
                                <div v-for="(img, idx) in galleryImages" :key="idx" 
                                     @click="changeMainImage(idx)" 
                                     class="relative h-16 md:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300"
                                     :class="activeImageIndex === idx ? 'border-brand-500 scale-[0.98] shadow-glow-subtle' : 'border-slate-200 dark:border-white/5 opacity-60 hover:opacity-100'">
                                    <img :src="img" :alt="'thumb_' + idx" class="w-full h-full object-cover">
                                </div>
                            </div>
                        </div>

                        <div class="lg:col-span-7 space-y-6">
                            <div class="flex flex-wrap items-center gap-3">
                                <span class="bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-black px-3 py-1.5 rounded-full border border-brand-500/20 shadow-glow-subtle flex items-center gap-1.5">
                                    <span class="status-pulse"></span>
                                    سانس‌های باز آماده رزرو مستقیم
                                </span>
                                <span class="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-black px-3 py-1.5 rounded-full border border-yellow-500/20">
                                    امتیاز {{ selectedVenue.rating || '5.0' }} از ۵
                                </span>
                                <span class="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black px-3 py-1.5 rounded-full border border-cyan-500/20">
                                    مناسب برای: {{ selectedVenue.gender }}
                                </span>
                            </div>

                            <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                                {{ selectedVenue.name }}
                            </h1>

                            <div class="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                                <svg class="w-5 h-5 text-brand-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>قم، میدان الغدیر، فاز ۲ شهر پردیسان، بلوار دانشگاه، مرکز ورزش تخصصی، سالن چندمنظوره اختصاصی</span>
                            </div>

                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 p-4 rounded-2xl text-center">
                                    <span class="block text-slate-400 text-[10px] font-bold mb-1">نوع کفپوش</span>
                                    <span class="block text-xs font-black text-slate-800 dark:text-white">پارکت ضد لغزش</span>
                                </div>
                                <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 p-4 rounded-2xl text-center">
                                    <span class="block text-slate-400 text-[10px] font-bold mb-1">نورپردازی استاندارد</span>
                                    <span class="block text-xs font-black text-slate-800 dark:text-white">مجهز به پروژکتور متال</span>
                                </div>
                                <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 p-4 rounded-2xl text-center">
                                    <span class="block text-slate-400 text-[10px] font-bold mb-1">ساعت فعالیت</span>
                                    <span class="block text-xs font-black text-slate-800 dark:text-white">۰۸:۰۰ الی ۲۳:۳۰</span>
                                </div>
                                <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 p-4 rounded-2xl text-center">
                                    <span class="block text-slate-400 text-[10px] font-bold mb-1">سیستم صوتی</span>
                                    <span class="block text-xs font-black text-slate-800 dark:text-white">باند سقفی یکپارچه</span>
                                </div>
                            </div>

                            <div class="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div>
                                    <span class="block text-[11px] text-slate-400 font-bold mb-1">قیمت رزرو به ازای هر سانس ۹۰ دقیقه‌ای:</span>
                                    <div class="text-brand-500 dark:text-brand-400 font-black text-2xl md:text-3xl flex items-baseline gap-1">
                                        {{ selectedVenue.price }}
                                        <span class="text-xs font-normal text-slate-400 dark:text-slate-500">تومان</span>
                                    </div>
                                </div>
                                
                                <button @click="bookQuickest" class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white dark:text-dark-bg font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-glow hover:scale-[1.03] flex items-center gap-2">
                                    <span>رزرو سریع‌ترین سانس خالی</span>
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-up delay-200">
                    <div class="lg:col-span-2 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
                        <div class="flex items-center gap-3">
                            <span class="w-2 h-8 bg-brand-500 rounded-full"></span>
                            <h2 class="text-xl md:text-2xl font-black text-slate-800 dark:text-white">امکانات و جزئیات فنی مجموعه</h2>
                        </div>
                        
                        <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-loose text-justify">
                            این سالن تخصصی مجهز به کفپوش پارکت آلمانی الاستیک کامپوزیت بوده که با جذب ضربه تا حداکثر ۴۵ درصد، خطر آسیب‌دیدگی‌های مفصلی برای بازیکنان را به شدت کاهش می‌دهد. نورپردازی با شدت میانگین ۷۵۰ لوکس نوری به طور کاملاً یکنواخت در سطح بازی پخش شده است تا از خطای دید جلوگیری شود. همچنین از یک سیستم هواساز پیشرفته گرمایشی و سرمایشی مستقل بهره برده و به صورت دوره ای ضدعفونی می شود.
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <!-- اضافه شدن افکت هاور به کارت‌های امکانات -->
                            <div v-for="spec in specsList" :key="spec.title" 
                                 class="group bg-slate-50 dark:bg-dark-bg/40 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex gap-3.5 items-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-brand-500/30 cursor-default">
                                <span class="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{{ spec.icon }}</span>
                                <div>
                                    <h4 class="text-xs font-black text-slate-800 dark:text-white mb-1 transition-colors group-hover:text-brand-500">{{ spec.title }}</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ spec.value }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6 flex flex-col justify-between">
                        <div class="space-y-6">
                            <div class="flex items-center gap-3">
                                <span class="w-2 h-8 bg-brand-500 rounded-full"></span>
                                <h3 class="text-xl font-black text-slate-800 dark:text-white">شرایط و قوانین رزرو</h3>
                            </div>
                            
                            <ul class="space-y-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-loose">
                                <li class="flex items-start gap-2">
                                    <span class="text-emerald-500 mt-1 font-black">✓</span>
                                    <span>همراه داشتن کفش سالنی مخصوص کاملاً تمیز الزامی است.</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-emerald-500 mt-1 font-black">✓</span>
                                    <span>امکان لغو یا جابجایی سانس تا حداکثر ۴۸ ساعت قبل از سانس ممکن است.</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-emerald-500 mt-1 font-black">✓</span>
                                    <span>رعایت حریم زمانی سانس‌ها (خروج به موقع جهت حضور تیم بعدی) الزامی است.</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-emerald-500 mt-1 font-black">✓</span>
                                    <span>ورود حیوانات خانگی و استعمال دخانیات در محوطه سالن ممنوع است.</span>
                                </li>
                            </ul>
                        </div>

                        <div class="bg-brand-500/5 border border-brand-500/10 p-5 rounded-2xl space-y-3">
                            <h4 class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <span class="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
                                ضمانت رزرو اسپورت
                            </h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                تمامی اطلاعات ثبت شده در وبسایت شامل کفپوش، سانس‌های باز و امکانات منطبق با واقعیت سالن بوده و گارانتی برگشت ۱۰۰ درصدی وجه در صورت مغایرت را دارد.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 lg:p-10 mb-12 shadow-xl animate-fade-up delay-300">
                    
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                        <div class="space-y-1.5 text-right">
                            <h2 class="text-xl md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                                <span class="w-2.5 h-7 bg-brand-500 rounded-full inline-block"></span>
                                جدول زمان‌بندی و رزرو آنلاین سانس‌ها
                            </h2>
                            <p class="text-xs text-slate-400 dark:text-slate-500">ساعت و روز دلخواه را انتخاب کرده و مستقیماً پیش‌فاکتور را دریافت کنید.</p>
                        </div>

                        <div class="flex bg-slate-100 dark:bg-dark-bg p-1 rounded-xl text-xs font-black w-full md:w-auto relative overflow-hidden shadow-inner">
                            <button @click="changeFilter('all')" class="px-4 py-2 rounded-lg transition-all duration-300 z-10" :class="activeFilterBtn === 'all' ? 'bg-brand-500 text-white dark:text-dark-bg shadow-md scale-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white scale-95 hover:scale-100'">همه موارد</button>
                            <button @click="changeFilter('morning')" class="px-4 py-2 rounded-lg transition-all duration-300 z-10" :class="activeFilterBtn === 'morning' ? 'bg-brand-500 text-white dark:text-dark-bg shadow-md scale-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white scale-95 hover:scale-100'">صبح (۸ تا ۱۴)</button>
                            <button @click="changeFilter('afternoon')" class="px-4 py-2 rounded-lg transition-all duration-300 z-10" :class="activeFilterBtn === 'afternoon' ? 'bg-brand-500 text-white dark:text-dark-bg shadow-md scale-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white scale-95 hover:scale-100'">عصر (۱۴ تا ۱۸)</button>
                            <button @click="changeFilter('evening')" class="px-4 py-2 rounded-lg transition-all duration-300 z-10" :class="activeFilterBtn === 'evening' ? 'bg-brand-500 text-white dark:text-dark-bg shadow-md scale-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white scale-95 hover:scale-100'">شب (۱۸ تا ۲۳)</button>
                        </div>
                    </div>

                    <div class="hidden md:block overflow-x-auto relative min-h-[400px]">
                        
                        <!-- پرده لودینگ شیشه‌ای و انیمیشن‌دار (لودینگ لوکس) -->
                        <div v-show="isLoadingFilter" class="absolute inset-0 z-[25] flex flex-col items-center justify-center bg-white/60 dark:bg-[#0c1222]/60 backdrop-blur-[6px] rounded-2xl transition-all duration-300">
                            <div class="flex items-center gap-1.5 mb-3">
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                            </div>
                            <span class="text-[10px] font-black text-brand-500 tracking-widest">در حال بروزرسانی سانس‌ها...</span>
                        </div>

                        <table class="w-full text-right border-collapse min-w-[900px] relative">
                            <thead>
                                <tr class="border-b border-slate-100 dark:border-white/5">
                                    <th class="py-4 px-4 text-xs font-black text-slate-400 tracking-wider w-[12%] text-center">بازه زمانی</th>
                                    <th v-for="(day, dIdx) in weekDays" :key="dIdx" class="py-4 px-3 text-center w-[12%]">
                                        <div class="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 py-3.5 rounded-2xl shadow-sm">
                                            <span class="block text-sm font-black text-slate-800 dark:text-white">{{ day.name }}</span>
                                            <span class="block text-[10px] text-brand-500 dark:text-brand-400 font-bold mt-1" dir="ltr">{{ day.date }}</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <!-- افزودن انیمیشن نرم آبشاری با Vue Transition Group -->
                            <transition-group name="stagger-matrix" tag="tbody" class="divide-y divide-slate-100 dark:divide-white/5 relative">
                                <!-- با تخصیص :style="{'--i': idx}" ایندکس هر ردیف را به CSS پاس می‌دهیم تا تاخیر ایجاد کند -->
                                <tr v-for="(row, idx) in filteredTimeRows" :key="row.id" 
                                    :style="{ '--i': idx }"
                                    @click="activateTimeRow(row.id)"
                                    class="transition-all duration-500 w-full"
                                    :class="activeMatrixRowId === row.id ? 'bg-brand-50/50 dark:bg-brand-500/10 scale-[1.01] shadow-sm z-10 relative rounded-xl' : 'hover:bg-slate-50/40 dark:hover:bg-white/[0.01]'">
                                    
                                    <td class="py-4 px-2 text-center transition-all cursor-pointer">
                                        <div class="inline-flex items-center gap-1.5 border px-3 py-2 rounded-xl text-xs font-black transition-all duration-300"
                                             :class="activeMatrixRowId === row.id ? 'bg-brand-500 border-brand-500 text-white shadow-glow-subtle' : 'bg-slate-100 dark:bg-dark-bg/80 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'">
                                            <svg class="w-3.5 h-3.5" :class="activeMatrixRowId === row.id ? 'text-white' : 'text-brand-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span dir="ltr">{{ row.range }}</span>
                                        </div>
                                    </td>
                                    
                                    <td v-for="(day, dIdx) in weekDays" :key="dIdx" class="py-3 px-2 text-center">
                                        <div @click.stop="selectMatrixSlot(day.name, day.date, row.range, getSlotStatus(dIdx, row.id))"
                                             class="border rounded-2xl p-3.5 text-center transition-all duration-300 relative overflow-hidden group/slot select-none"
                                             :class="getSlotStatus(dIdx, row.id).class">
                                            
                                            <span class="block text-[11px] font-black tracking-wide relative z-10">{{ getSlotStatus(dIdx, row.id).label }}</span>
                                            
                                            <span v-if="getSlotStatus(dIdx, row.id).code === 'available'" class="block text-[10px] text-slate-500 font-bold mt-1.5 relative z-10 transition-colors group-hover/slot:text-emerald-700 dark:group-hover/slot:text-emerald-300">
                                                {{ selectedVenue.price }} تومان
                                            </span>
                                            <span v-else class="block text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1.5 relative z-10">
                                                - - -
                                            </span>

                                            <div v-if="getSlotStatus(dIdx, row.id).code === 'available'" class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-500 scale-x-0 group-hover/slot:scale-x-100 transition-transform duration-300"></div>
                                        </div>
                                    </td>
                                </tr>
                            </transition-group>
                        </table>
                    </div>

                    <div class="md:hidden space-y-6 relative min-h-[300px]">
                        <!-- لودر موبایل -->
                        <div v-show="isLoadingFilter" class="absolute inset-0 z-[25] flex flex-col items-center justify-center bg-white/60 dark:bg-[#0c1222]/60 backdrop-blur-[6px] rounded-2xl transition-all duration-300">
                            <div class="flex items-center gap-1.5 mb-3">
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                            </div>
                        </div>

                        <p class="text-xs text-slate-400 dark:text-slate-500 text-center">برای مشاهده تقویم سانس‌ها، یکی از روزهای هفته زیر را لمس کنید:</p>
                        
                        <div class="flex gap-2 overflow-x-auto pb-3 scrollbar-thin snap-x">
                            <button v-for="(day, dIdx) in weekDays" :key="dIdx" 
                                    @click="activeMobileDayIdx = dIdx"
                                    class="flex-shrink-0 snap-center px-5 py-3 rounded-2xl border text-center transition-all min-w-[85px]"
                                    :class="activeMobileDayIdx === dIdx ? 'bg-brand-500 border-brand-500 text-white dark:text-dark-bg shadow-glow-subtle' : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-400'">
                                <span class="block text-sm font-black">{{ day.name }}</span>
                                <span class="block text-[10px] mt-0.5 opacity-80" dir="ltr">{{ day.date }}</span>
                            </button>
                        </div>

                        <!-- انیمیشن برای لیست موبایل -->
                        <transition-group name="stagger-matrix" tag="div" class="space-y-3.5 relative">
                            <div v-for="(row, idx) in filteredTimeRows" :key="row.id"
                                 :style="{ '--i': idx }"
                                 @click="selectMatrixSlot(weekDays[activeMobileDayIdx].name, weekDays[activeMobileDayIdx].date, row.range, getSlotStatus(activeMobileDayIdx, row.id))"
                                 class="border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 w-full"
                                 :class="getSlotStatus(activeMobileDayIdx, row.id).class">
                                
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                        ⏱️
                                    </div>
                                    <div class="text-right">
                                        <span class="block text-xs font-black text-slate-800 dark:text-white" dir="ltr">{{ row.range }}</span>
                                        <span class="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">قیمت: {{ selectedVenue.price }} تومان</span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black">{{ getSlotStatus(activeMobileDayIdx, row.id).label }}</span>
                                    <svg v-if="getSlotStatus(activeMobileDayIdx, row.id).reservable" class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
                                </div>
                            </div>
                        </transition-group>
                    </div>

                </div>

               

 

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-up">
                    
                    <div class="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6 h-fit">
                        <div class="flex items-center gap-2.5">
                            <span class="w-2 h-7 bg-brand-500 rounded-full"></span>
                            <h3 class="text-lg font-black text-slate-800 dark:text-white">ثبت دیدگاه جدید</h3>
                        </div>

                        <form @submit.prevent="submitComment" class="space-y-4">
                            <div class="space-y-1 text-right">
                                <label class="text-[11px] font-bold text-slate-400">نام و نام خانوادگی:</label>
                                <input type="text" v-model="reviewerName" required placeholder="مثال: ابوالفضل دانش"
                                       class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl py-3 px-4 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 text-right transition-colors">
                            </div>

                            <div class="space-y-1 text-right">
                                <label class="text-[11px] font-bold text-slate-400">شماره همراه (اختیاری):</label>
                                <input type="tel" v-model="reviewerPhone" placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr"
                                       class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl py-3 px-4 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 text-left transition-colors">
                            </div>

                            <div class="space-y-1 text-right">
                                <label class="text-[11px] font-bold text-slate-400">امتیاز شما به مجموعه:</label>
                                <div class="flex items-center gap-2 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 justify-center">
                                    <div class="flex items-center gap-1 text-2xl text-yellow-400">
                                        <button v-for="star in 5" :key="star" type="button" 
                                                @click="ratingInput = star"
                                                @mouseover="ratingHover = star"
                                                @mouseleave="ratingHover = 0"
                                                class="focus:outline-none transition-transform hover:scale-125">
                                            {{ star <= (ratingHover || ratingInput) ? '★' : '☆' }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-1 text-right">
                                <label class="text-[11px] font-bold text-slate-400">پیام و متن دیدگاه شما:</label>
                                <textarea v-model="reviewText" required placeholder="توضیحات خود را در رابطه با کیفیت سالن، برخورد کادر مجموعه و ... بنویسید..." rows="4"
                                          class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl py-3 px-4 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 text-right leading-relaxed transition-colors"></textarea>
                            </div>

                            <button type="submit" class="w-full bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white dark:text-dark-bg font-black py-3.5 rounded-xl text-xs shadow-glow transition-all">
                                ثبت و ارسال دیدگاه شما
                            </button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                            <div class="flex items-center gap-2.5">
                                <span class="w-2 h-7 bg-brand-500 rounded-full"></span>
                                <h3 class="text-lg font-black text-slate-800 dark:text-white">نظرات و تجربیات کاربری</h3>
                            </div>
                            <span class="text-xs text-brand-500 font-black bg-brand-500/10 px-3 py-1.5 rounded-full">{{ commentsList.length }} دیدگاه تایید شده</span>
                        </div>

                        <div class="space-y-8 divide-y divide-slate-100 dark:divide-white/5">
                            <div v-for="comment in commentsList" :key="comment.id" class="pt-6 first:pt-0 space-y-4">
                                
                                <div class="flex items-start gap-4">
                                    <div class="w-12 h-12 rounded-full border-2 border-brand-500/20 overflow-hidden shadow-sm flex-shrink-0">
                                        <img :src="comment.avatar" :alt="comment.author" class="w-full h-full object-cover">
                                    </div>
                                    <div class="flex-1 space-y-1 text-right">
                                        <div class="flex items-center justify-between flex-wrap gap-2">
                                            <h5 class="text-sm font-black text-slate-800 dark:text-white">{{ comment.author }}</h5>
                                            <span class="text-[10px] text-slate-400">{{ comment.date }}</span>
                                        </div>
                                        <div class="flex items-center gap-0.5 text-yellow-400 text-xs mb-2">
                                            <span v-for="s in comment.rating" :key="s">★</span>
                                            <span v-for="s in (5 - comment.rating)" :key="s" class="opacity-30">★</span>
                                        </div>
                                        <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">{{ comment.content }}</p>
                                        
                                        <!-- دکمه‌های آیکون‌دار و جدید لایک و پاسخ -->
                                        <div class="flex items-center gap-5 pt-3">
                                            <div class="flex items-center gap-3 bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/5 rounded-full px-3 py-1">
                                                <button @click="toggleLike(comment.id, 'like')" class="group flex items-center gap-1.5 transition-colors text-xs" :class="commentLikes[comment.id] === 'like' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'">
                                                    <svg class="w-4 h-4 transition-transform group-active:scale-75 group-hover:-translate-y-0.5" :class="commentLikes[comment.id] === 'like' ? 'fill-emerald-500/20' : 'fill-none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg>
                                                    <span class="font-bold pt-0.5" dir="ltr">{{ comment.likes }}</span>
                                                </button>
                                                <span class="w-px h-3 bg-slate-300 dark:bg-white/10"></span>
                                                <button @click="toggleLike(comment.id, 'dislike')" class="group flex items-center gap-1.5 transition-colors text-xs" :class="commentLikes[comment.id] === 'dislike' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'">
                                                    <span class="font-bold pt-0.5" dir="ltr">{{ comment.dislikes }}</span>
                                                    <svg class="w-4 h-4 transition-transform group-active:scale-75 group-hover:translate-y-0.5" :class="commentLikes[comment.id] === 'dislike' ? 'fill-rose-500/20' : 'fill-none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a1.2 1.2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.514"></path></svg>
                                                </button>
                                            </div>

                                            <button @click="openReplyForm(comment.id)" class="group flex items-center gap-1 text-slate-500 hover:text-cyan-500 transition-colors text-[11px] font-bold px-2 py-1">
                                                <svg class="w-3.5 h-3.5 transition-transform group-active:scale-75 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                                پاسخ
                                            </button>
                                        </div>

                                        <!-- فرم ارسال پاسخ (فقط در صورت کلیک باز می‌شود) -->
                                        <div v-if="replyingToId === comment.id" class="mt-4 bg-slate-50 dark:bg-dark-bg/60 border border-brand-500/20 rounded-2xl p-3 animate-fade-up">
                                            <div class="flex items-start gap-2">
                                                <textarea v-model="replyContent" rows="1" placeholder="پاسخ خود را اینجا بنویسید..." class="flex-1 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 text-right resize-none min-h-[40px]"></textarea>
                                                <button @click="submitReply(comment.id)" class="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2.5 rounded-xl text-[11px] font-black transition-all shadow-glow-subtle flex-shrink-0">ثبت پاسخ</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div class="pr-6 md:pr-12 space-y-4" v-if="comment.replies && comment.replies.length > 0">
                                    <div v-for="reply in comment.replies" :key="reply.id"
                                         class="rounded-2xl p-4 md:p-5 border relative overflow-hidden transition-all duration-300 hover:shadow-sm"
                                         :class="reply.isManagement ? 'bg-emerald-500/5 dark:bg-emerald-500/[0.02] border-emerald-500/30 text-right' : 'bg-brand-500/5 dark:bg-brand-500/[0.01] border-brand-500/20 text-right'">
                                        
                                        <div class="absolute top-0 bottom-0 right-0 w-1" :class="reply.isManagement ? 'bg-emerald-500' : 'bg-brand-500'"></div>
                                        
                                        <div class="flex items-start gap-3.5">
                                            <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border" :class="reply.isManagement ? 'border-emerald-500/20' : 'border-brand-500/20'">
                                                <img v-if="reply.avatar.includes('http')" :src="reply.avatar" :alt="reply.author" class="w-full h-full object-cover">
                                                <div v-else class="w-full h-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold text-sm">{{ reply.avatar }}</div>
                                            </div>
                                            <div class="flex-1 space-y-1.5">
                                                <div class="flex items-center justify-between flex-wrap gap-2">
                                                    <span class="text-xs font-black" :class="reply.isManagement ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-600 dark:text-brand-400'">
                                                        {{ reply.author }}
                                                        <span class="text-[9px] bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded-md mr-1" v-if="reply.isManagement">پاسخ رسمی</span>
                                                        <span class="text-[9px] bg-rose-500/15 text-rose-600 px-1.5 py-0.5 rounded-md mr-1" v-if="reply.isSuperAdmin">ناظر رزرو اسپورت</span>
                                                    </span>
                                                    <span class="text-[9px] text-slate-400">{{ reply.date }}</span>
                                                </div>
                                                <p class="text-xs text-slate-500 dark:text-slate-300 leading-relaxed text-justify">{{ reply.content }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    `
}