import { store, addNotification } from './store.js';

export default {
    setup(props, { emit }) {
        const { ref, reactive } = window.Vue;

        const currentStep = ref(1);
        
        const form = reactive({
            name: '',
            description: '',
            gender: '',
            sports: [],
            features: [],
            venueImages: [],
            documentImages: []
        });

        const genders = ['آقایان', 'بانوان', 'آقایان و بانوان'];
        const sportOptions = ['فوتسال', 'فوتبال', 'والیبال', 'بسکتبال', 'هندبال', 'تنیس', 'پینت‌بال', 'بدمینتون'];
        const featureOptions = [
            { id: 1, title: 'پارکت ضد لغزش', desc: 'کفپوش چوبی استاندارد با ضربه‌گیر', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
            { id: 2, title: 'سیستم تهویه', desc: 'هواساز سرمایشی و گرمایشی قوی', icon: 'M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h8m-8 3h8' },
            { id: 3, title: 'نورپردازی متال', desc: 'پروژکتورهای ۷۵۰ لوکس بدون سایه', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            { id: 4, title: 'سیستم صوتی', desc: 'باند سقفی یکپارچه محیطی', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
            { id: 5, title: 'پارکینگ اختصاصی', desc: 'فضای پارک امن برای ورزشکاران', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
            { id: 6, title: 'رختکن VIP', desc: 'مجهز به دوش آب گرم و کمد', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
        ];

        const toggleSelection = (array, item) => {
            const index = array.indexOf(item);
            if (index > -1) array.splice(index, 1);
            else array.push(item);
        };

        const handleFileUpload = (event, targetArray) => {
            const files = Array.from(event.target.files);
            files.forEach(file => {
                if (targetArray.length < 4) {
                    targetArray.push(URL.createObjectURL(file));
                }
            });
        };

        const removeImage = (targetArray, index) => {
            targetArray.splice(index, 1);
        };

        const nextStep = () => {
            if (currentStep.value === 1 && (!form.name || !form.gender)) {
                addNotification('خطا', 'لطفاً نام سالن و جنسیت را مشخص کنید.', 'error');
                return;
            }
            if (currentStep.value === 2 && (form.sports.length === 0 || form.features.length === 0)) {
                addNotification('خطا', 'انتخاب حداقل یک رشته ورزشی و یک ویژگی الزامی است.', 'error');
                return;
            }
            currentStep.value++;
        };

        const submitForm = () => {
            if (form.venueImages.length < 4 || form.documentImages.length === 0) {
                addNotification('خطا', 'لطفاً دقیقاً ۴ عکس از سالن و حداقل یک عکس از سند بارگذاری کنید.', 'error');
                return;
            }
            addNotification('درخواست با موفقیت ثبت شد', 'مدارک شما در حال بررسی است.', 'success');
            
            // خبر به داشبورد که کار تموم شد
            emit('completed');
        };

        return {
            currentStep,
            form,
            genders,
            sportOptions,
            featureOptions,
            toggleSelection,
            handleFileUpload,
            removeImage,
            nextStep,
            submitForm
        };
    },
    template: `
        <div class="glass-panel rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 relative overflow-hidden">
            <div class="absolute -right-24 -top-24 w-80 h-80 bg-brand-500/15 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>
            <div class="absolute -left-20 bottom-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-white/5 pb-6 relative z-10">
                <div>
                    <h3 class="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">ثبت سالن ورزشی</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">اطلاعات سالن خود را در ۳ مرحله برای بررسی و احراز وارد کنید.</p>
                </div>
                
                <div class="flex items-center gap-2 bg-slate-50 dark:bg-dark-bg/50 p-2 rounded-2xl border border-slate-100 dark:border-white/5" dir="ltr">
                    <div v-for="step in 3" :key="step" class="flex items-center">
                        <div :class="currentStep >= step ? 'bg-gradient-to-tr from-brand-400 to-cyan-500 text-white shadow-glow-subtle' : 'bg-slate-200 dark:bg-white/5 text-slate-500'" 
                             class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-500 transform" :class="currentStep === step ? 'scale-110' : ''">
                            {{ step }}
                        </div>
                        <div v-if="step < 3" class="w-8 md:w-12 h-1.5 mx-1 rounded-full bg-slate-200 dark:bg-white/5 relative overflow-hidden">
                            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-cyan-500 transition-all duration-700" :style="{ width: currentStep > step ? '100%' : '0%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="min-h-[350px] relative z-10">
                <transition name="fade-slide" mode="out-in">
                    
                    <div v-if="currentStep === 1" key="step1" class="space-y-7">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام سالن یا مجموعه ورزشی <span class="text-red-500">*</span></label>
                            <input v-model="form.name" type="text" class="w-full bg-slate-50/50 dark:bg-[#0a0f1d]/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium" placeholder="مثلاً: مجموعه ورزشی الماس (سالن فوتسال VIP)">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">جنسیت‌های قابل میزبانی <span class="text-red-500">*</span></label>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button v-for="gender in genders" :key="gender" @click="form.gender = gender"
                                    :class="form.gender === gender ? 'border-brand-500 bg-brand-500/10 text-brand-500 dark:text-brand-400 shadow-glow-subtle ring-1 ring-brand-500' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0f1d]/50 text-slate-600 dark:text-slate-400 hover:border-brand-500/50 hover:bg-brand-500/5'"
                                    class="py-4 px-6 rounded-2xl border-2 font-black transition-all duration-300 flex items-center justify-center gap-2 group">
                                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors" :class="form.gender === gender ? 'border-brand-500' : 'border-slate-400'">
                                        <div v-if="form.gender === gender" class="w-2 h-2 bg-brand-500 rounded-full"></div>
                                    </div>
                                    {{ gender }}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">توضیحات و قوانین سالن (اختیاری)</label>
                            <textarea v-model="form.description" rows="4" class="w-full bg-slate-50/50 dark:bg-[#0a0f1d]/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="ابعاد دقیق زمین، نوع کفپوش، قوانین خاص مجموعه و... را اینجا بنویسید"></textarea>
                        </div>
                    </div>

                    <div v-else-if="currentStep === 2" key="step2" class="space-y-8">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">رشته‌های ورزشی مجاز <span class="text-xs text-slate-400 font-normal">(چند انتخاب مجاز است)</span></label>
                            <div class="flex flex-wrap gap-3">
                                <button v-for="sport in sportOptions" :key="sport" @click="toggleSelection(form.sports, sport)"
                                    :class="form.sports.includes(sport) ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-glow-subtle scale-105 border-transparent' : 'bg-slate-50 dark:bg-[#0a0f1d]/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-brand-500/50'"
                                    class="px-6 py-3 rounded-full font-bold text-sm border-2 transition-all duration-300 flex items-center gap-2">
                                    {{ sport }}
                                    <svg v-if="form.sports.includes(sport)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">امکانات و ویژگی‌های فنی مجموعه</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="feature in featureOptions" :key="feature.id" @click="toggleSelection(form.features, feature.id)"
                                    :class="form.features.includes(feature.id) ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/50' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0f1d]/50 hover:border-brand-500/30 hover:bg-brand-500/5'"
                                    class="p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 group">
                                    
                                    <div :class="form.features.includes(feature.id) ? 'text-brand-500 bg-brand-500/20 shadow-glow-subtle' : 'text-slate-400 bg-slate-200 dark:bg-white/5 group-hover:text-brand-400 group-hover:bg-brand-500/10'" 
                                         class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300">
                                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.icon"></path></svg>
                                    </div>
                                    
                                    <div>
                                        <h4 class="font-black text-slate-800 dark:text-white transition-colors" :class="{'text-brand-500 dark:text-brand-400': form.features.includes(feature.id)}">{{ feature.title }}</h4>
                                        <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">{{ feature.desc }}</p>
                                    </div>
                                    
                                    <div class="mr-auto opacity-0 transition-opacity" :class="{'opacity-100': form.features.includes(feature.id)}">
                                        <div class="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="currentStep === 3" key="step3" class="space-y-8">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                                <span>تصاویر سالن از زوایای مختلف</span>
                                <span class="text-xs bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-md">{{ form.venueImages.length }} / ۴ عکس</span>
                            </label>
                            
                            <div class="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-3xl p-8 text-center hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-300 bg-slate-50/50 dark:bg-[#0a0f1d]/50 relative group cursor-pointer overflow-hidden">
                                <input type="file" multiple accept="image/*" @change="e => handleFileUpload(e, form.venueImages)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20">
                                <div class="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div class="w-16 h-16 bg-slate-200 dark:bg-white/5 text-slate-400 group-hover:text-brand-500 group-hover:bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:-translate-y-1">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h4 class="text-base font-black text-slate-700 dark:text-slate-200 mb-1">برای آپلود عکس کلیک کنید</h4>
                                <p class="text-xs text-slate-500">فرمت‌های مجاز: JPG و PNG (حداکثر حجم ۲ مگابایت)</p>
                            </div>
                            
                            <div v-if="form.venueImages.length > 0" class="flex flex-wrap gap-4 mt-6">
                                <div v-for="(img, idx) in form.venueImages" :key="idx" class="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-500/30 shadow-md group">
                                    <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button @click.stop="removeImage(form.venueImages, idx)" class="text-white hover:text-red-500 bg-black/50 p-1.5 rounded-full backdrop-blur-sm transition-colors">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">سند اختیار یا مالکیت سالن جهت احراز هویت</label>
                            
                            <div class="border-2 border-dashed border-emerald-500/30 rounded-3xl p-6 text-center hover:border-emerald-500 transition-all duration-300 bg-emerald-500/5 relative cursor-pointer group">
                                <input type="file" accept="image/*" @change="e => handleFileUpload(e, form.documentImages)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20">
                                
                                <div class="flex items-center justify-center gap-3">
                                    <div class="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <div class="text-right">
                                        <h4 class="text-sm font-black text-emerald-600 dark:text-emerald-400 mb-1">بارگذاری تصویر سند یا اجاره‌نامه رسمی</h4>
                                        <p class="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">اطلاعات شما نزد ما کاملاً محفوظ است.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-if="form.documentImages.length > 0" class="mt-4 flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-3 rounded-xl">
                                <div class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    سند با موفقیت بارگذاری شد.
                                </div>
                                <button @click="form.documentImages = []" class="text-emerald-600 hover:text-red-500 text-xs font-bold transition-colors">حذف</button>
                            </div>
                        </div>
                    </div>

                </transition>
            </div>

            <div class="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-white/5 relative z-10">
                <button v-if="currentStep > 1" @click="currentStep--" class="px-6 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-2 group">
                    <svg class="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    مرحله قبل
                </button>
                <div v-else></div>

                <button v-if="currentStep < 3" @click="nextStep" class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-black px-8 py-3.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
                    مرحله بعد
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                <button v-else @click="submitForm" class="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-black px-8 py-3.5 rounded-xl shadow-glow-success transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    ثبت نهایی درخواست
                </button>
            </div>
        </div>
    `
}