import { store } from './store.js';

export default {
    setup() {
        const { ref, onMounted } = window.Vue;

        // متون ورزشی کاملاً تمیز، خوانا و بدون هیچ‌گونه ایموجی
        const loadingTexts = [
            "در حال خط‌کشی چمن استادیوم...",
            "در حال بررسی سیستم کمک‌داور ویدئویی...",
            "آماده‌سازی تجهیزات پزشکی و هماهنگی داوران...",
            "در حال تنظیم پروژکتورهای هوشمند سالن...",
            "گرم کردن بازیکنان و تست فشار باد توپ‌ها...",
            "بررسی نهایی کیفیت کف‌پوش و گیت‌های ورودی..."
        ];

        const currentText = ref(loadingTexts[0]);

        onMounted(() => {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % loadingTexts.length;
                currentText.value = loadingTexts[index];
            }, 2200); // افزایش زمان مکث هر متن جهت خوانایی کامل‌تر کاربر

            return () => clearInterval(interval);
        });

        return { currentText };
    },
    template: `
        <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/90 dark:bg-black/95 backdrop-blur-xl transition-all duration-500 select-none">
            
            <!-- استایل‌های اختصاصی محلی برای رینگ‌ها و ترانزیشن متن‌ها -->
            <style>
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes float-hologram {
                    0%, 100% { 
                        transform: translateY(0) scale(1); 
                        filter: drop-shadow(0 0 25px rgba(6, 182, 212, 0.35)); 
                    }
                    50% { 
                        transform: translateY(-12px) scale(1.04); 
                        filter: drop-shadow(0 0 45px rgba(6, 182, 212, 0.65)); 
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 14s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 9s linear infinite;
                }
                .animate-float-hologram {
                    animation: float-hologram 4s ease-in-out infinite;
                }
                /* ترانزیشن نرم تغییر متن لودینگ */
                .text-fade-enter-active, .text-fade-leave-active {
                    transition: all 0.5s ease-in-out;
                }
                .text-fade-enter-from {
                    opacity: 0;
                    transform: translateY(8px);
                }
                .text-fade-leave-to {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                @keyframes shimmerProgress {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-progress-shimmer {
                    animation: shimmerProgress 1.8s ease-in-out infinite;
                }
            </style>

            <!-- هاله‌های نوری پس‌زمینه با کنتراست بالا جهت ایجاد عمق بصری مدرن -->
            <div class="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
            <div class="absolute w-[300px] h-[300px] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-[80px] pointer-events-none -top-10"></div>

            <div class="relative flex flex-col items-center">
                <!-- ساختار رینگ‌های تو در توی هولوگرافیک (بزرگتر و بسیار جذاب‌تر) -->
                <div class="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
                    
                    <!-- رینگ بیرونی (بزرگ و چرخنده ساعت‌گرد) -->
                    <div class="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 dark:border-cyan-400/20 animate-spin-slow"></div>
                    
                    <!-- رینگ میانی (چرخنده پاد ساعت‌گرد نئونی) -->
                    <div class="absolute inset-4 rounded-full border-2 border-double border-cyan-400/50 dark:border-cyan-400/30 animate-spin-reverse"></div>
                    
                    <!-- افکت نوری دایره مرکزی -->
                    <div class="absolute inset-8 rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-sm"></div>

                    <!-- تصویر اصلی لودینگ شما با سایز بزرگتر و انیمیشن شناور فوق‌العاده تمیز -->
                    <div class="absolute z-10 flex items-center justify-center animate-float-hologram">
                        <img src="./assets/loading.svg" alt="Loading" class="w-24 h-24 md:w-28 md:h-28 object-contain" />
                    </div>
                </div>

                <!-- بخش متون بارگذاری با خوانایی فوق‌العاده بالا و بدون ایموجی -->
                <div class="mt-12 text-center px-6 max-w-lg h-24 flex flex-col items-center justify-start">
                    <!-- استفاده از ترانزیشن پیش‌فرض Vue برای تعویض نرم متن‌ها -->
                    <transition name="text-fade" mode="out-in">
                        <p :key="currentText" class="text-slate-200 dark:text-white font-extrabold text-xl md:text-2xl leading-relaxed tracking-wide drop-shadow-md">
                            {{ currentText }}
                        </p>
                    </transition>
                    
                    <!-- خط پیشرفت مینیاتوری و باریک زیر متن برای پویایی بیشتر ظاهر صفحه -->
                    <div class="w-32 h-[3px] bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                        <div class="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full absolute animate-progress-shimmer"></div>
                    </div>
                    
                    <span class="text-[10px] text-cyan-400 dark:text-cyan-300 font-black tracking-[0.25em] uppercase mt-3">
                        Connecting to Arena
                    </span>
                </div>
            </div>
        </div>
    `
}