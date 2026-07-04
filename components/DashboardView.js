import { store, addNotification } from './store.js';

export default {
    setup() {
        const { ref, toRefs, computed, watch } = window.Vue;

        // مدیریت وضعیت تب‌های داشبورد هماهنگ با درخواست‌های صفحات دیگر
        const activeTab = ref(store.activeDashboardTab || 'overview'); 
        
        watch(() => store.activeDashboardTab, (newVal) => {
            if (newVal) {
                activeTab.value = newVal;
                store.activeDashboardTab = null;
            }
        });

        watch(activeTab, (newVal) => {
            store.activeDashboardTab = newVal;
        });

        const userVenueStatus = ref('active'); 
        
        // مدیریت مودال شارژ حساب
        const showChargeModal = ref(false);
        const predefinedAmounts = ['۵۰,۰۰۰', '۱۰۰,۰۰۰', '۲۰۰,۰۰۰', '۵۰۰,۰۰۰'];
        const selectedAmount = ref('');
        const customAmount = ref('');

        // متغیرهای مربوط به کاستوم سلکت (انتخاب شهر)
        const isCityDropdownOpen = ref(false);
        const selectedCity = ref('قم');
        const cities = ['قم', 'تهران', 'کرج', 'اصفهان', 'مشهد', 'شیراز'];

        // دیتای تستی برای تاریخچه خرید قطعی
        const purchaseHistory = ref([
            { id: 1, venueName: 'سالن ورزشی کاظمی', date: '۱۴۰۳/۰۹/۱۵', time: '۱۵:۰۰ تا ۱۶:۳۰', price: '۶۰۰,۰۰۰', status: 'موفق' },
            { id: 2, venueName: 'مجموعه ورزشی هدایتی', date: '۱۴۰۳/۰۸/۲۲', time: '۱۹:۰۰ تا ۲۰:۳۰', price: '۴۵۰,۰۰۰', status: 'موفق' },
            { id: 3, venueName: 'سالن فوتسال شهید اکبری', date: '۱۴۰۳/۰۷/۱۰', time: '۱۴:۳۰ تا ۱۶:۰۰', price: '۴۰۰,۰۰۰', status: 'موفق' }
        ]);

        // داده‌های پیگیری خرید (درخواست‌های در جریان)
        const purchaseTrackingList = ref([
            { id: 1001, venueName: 'مجموعه ورزشی انقلاب', type: 'رزرو سانس', date: '۱۴۰۵/۰۴/۱۲', time: '۱۸:۰۰ تا ۱۹:۳۰', price: '۸۵۰,۰۰۰', status: 'approved', statusText: 'تایید نهایی', reqDate: '۱۴۰۵/۰۴/۱۰' },
            { id: 1002, venueName: 'سالن فوتسال الغدیر', type: 'رزرو سانس', date: '۱۴۰۵/۰۴/۱۵', time: '۲۰:۰۰ تا ۲۱:۳۰', price: '۵۰۰,۰۰۰', status: 'pending', statusText: 'در انتظار تایید سالن', reqDate: '۱۴۰۵/۰۴/۱۱' },
            { id: 1003, venueName: 'زمین چمن مصنوعی شهید کشوری', type: 'رزرو سانس', date: '۱۴۰۵/۰۴/۱۸', time: '۱۶:۰۰ تا ۱۷:۳۰', price: '۶۵۰,۰۰۰', status: 'review', statusText: 'در حال بررسی تراکنش', reqDate: '۱۴۰۵/۰۴/۱۱' },
            { id: 1004, venueName: 'سالن چندمنظوره آزادی', type: 'رزرو سانس', date: '۱۴۰۵/۰۴/۰۵', time: '۱۰:۰۰ تا ۱۱:۳۰', price: '۴۰۰,۰۰۰', status: 'rejected', statusText: 'رد شده (عدم ظرفیت)', reqDate: '۱۴۰۵/۰۴/۰۲' }
        ]);

        // بخش مدیریت سالن
        const showManagementPanel = ref(false);
        const userVenue = ref({
            name: 'مجموعه ورزشی الماس (سالن فوتسال VIP)',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
            address: 'قم، سالاریه، بلوار امین، مجتمع ورزشی الماس، طبقه همکف',
            rating: '۴.۹',
            reviewsCount: '۱۲۸ نظر',
            status: 'فعال'
        });

        const persianMonths = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        
        const weekdays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

        const calendarYear = ref(1405);
        const calendarMonthIndex = ref(3);
        const selectedManageDay = ref(null); 
        const dayTimeslots = ref([]);

        const getDaysInMonth = (monthIdx) => {
            if (monthIdx < 6) return 31; 
            if (monthIdx < 11) return 30; 
            return 29; 
        };

        const getMonthStartWeekday = (monthIdx) => {
            let totalDays = 0;
            for (let i = 0; i < monthIdx; i++) {
                totalDays += getDaysInMonth(i);
            }
            return (6 + totalDays) % 7;
        };

        const currentMonthDays = computed(() => {
            const daysCount = getDaysInMonth(calendarMonthIndex.value);
            const startOffset = getMonthStartWeekday(calendarMonthIndex.value);
            const daysArray = [];

            for (let i = 0; i < startOffset; i++) {
                daysArray.push({ isPlaceholder: true });
            }

            for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
                const dayOfWeekIndex = (startOffset + dayNum - 1) % 7;
                daysArray.push({
                    isPlaceholder: false,
                    dayNumber: dayNum,
                    weekdayName: weekdays[dayOfWeekIndex],
                    status: dayOfWeekIndex === 6 ? 'closed' : 'active', 
                    isToday: calendarMonthIndex.value === 3 && dayNum === 12 
                });
            }

            return daysArray;
        });

        const currentMonthLabel = computed(() => {
            return `${persianMonths[calendarMonthIndex.value]} ${calendarYear.value}`;
        });

        const goPrevMonth = () => {
            selectedManageDay.value = null; 
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

        const activeDropdown = ref(''); 
        
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

        const bookingRequests = ref([
            { id: 101, userName: 'علیرضا تقوی', date: '۱۴۰۵/۰۴/۰۵', time: '۱۸:۰۰ تا ۱۹:۳۰', paymentType: 'بیعانه', paidAmount: '۲۵۰,۰۰۰', totalPrice: '۷۰۰,۰۰۰', phone: '09123456789' },
            { id: 102, userName: 'مرتضی هاشمی', date: '۱۴۰۵/۰۴/۰۶', time: '۲۰:۰۰ تا ۲۱:۳۰', paymentType: 'پرداخت کامل', paidAmount: '۷۵۰,۰۰۰', totalPrice: '۷۵۰,۰۰۰', phone: '09198765432' }
        ]);

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

        const handleLogout = () => {
            store.currentView = 'home';
            addNotification('خروج موفقیت‌آمیز', 'شما با موفقیت از سیستم خارج شدید.', 'success');
        };

        const handleChargeWallet = () => {
            const finalAmount = customAmount.value || selectedAmount.value;
            if (!finalAmount) {
                addNotification('خطا', 'لطفاً مبلغ شارژ را مشخص کنید.', 'error');
                return;
            }
            // تبدیل مبلغ به فرمت عدد برای شبیه‌سازی افزایش موجودی
            const numAmount = parseInt(finalAmount.replace(/,/g, ''));
            const currentNum = parseInt(store.user.credit.replace(/,/g, ''));
            store.user.credit = (currentNum + numAmount).toLocaleString('en-US');
            
            addNotification('شارژ موفق', `مبلغ ${finalAmount} تومان با موفقیت به حساب شما واریز شد.`, 'success');
            showChargeModal.value = false;
            selectedAmount.value = '';
            customAmount.value = '';
        };

        const selectAmount = (amount) => {
            selectedAmount.value = amount;
            customAmount.value = '';
        };

        const selectCity = (city) => {
            selectedCity.value = city;
            isCityDropdownOpen.value = false;
        };

        const closeCityDropdown = () => {
            isCityDropdownOpen.value = false;
        };

        const saveChanges = (type) => {
            const msgs = {
                'profile': 'اطلاعات کاربری شما با موفقیت بروزرسانی شد.',
                'security': 'رمز عبور شما با موفقیت تغییر کرد.'
            };
            addNotification('عملیات موفق', msgs[type], 'success');
        };

        const handleRegistrationComplete = () => {
            userVenueStatus.value = 'pending';
            activeTab.value = 'venues';
        };

        // ایجاد گزینه‌های ساعت برای Time Pickers
        const activeTimeDropdown = ref('');
        const timeOptions = [];
        for(let h=6; h<=23; h++) {
            const hour = h.toString().padStart(2, '0');
            timeOptions.push(`${hour}:00`, `${hour}:30`);
        }
        timeOptions.push('24:00');

        // وضعیت و داده‌های مربوط به ویزارد ثبت مجموعه ورزشی جدید
        const registerStep = ref(1);
        const venueForm = ref({
            name: '',
            ownerName: '',
            landline: '',
            phone: '',
            description: '',
            workingHours: { start: '', end: '' }, // ساعت کاری پیش‌فرض
            facilities: [],
            sports: [],
            genders: [],
            academy: { isActive: false, days: [], startTime: '', endTime: '' }, // آکادمی
            province: '',
            city: '',
            address: '',
            mapCoordinates: null,
            venuePhotos: [], // آرایه تصاویر سالن
            documents: []
        });

        // تغییر امکانات
        const availableFacilities = [
            { id: 'parking', name: 'پارکینگ اختصاصی', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
            { id: 'buffet', name: 'بوفه / کافی‌شاپ', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { id: 'locker', name: 'رختکن', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'shower', name: 'دوش حمام', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
            { id: 'ac', name: 'تهویه مطبوع', icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5' },
            { id: 'water_cooler', name: 'آبسردکن و یخ‌ساز', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3s-4.5 3.97-4.5 9 2.015 9 4.5 9z' },
            { id: 'restroom', name: 'سرویس بهداشتی', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
            { id: 'stands', name: 'جایگاه تماشاچی', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
        ];

        const availableSports = ['فوتسال', 'والیبال', 'بسکتبال', 'هندبال', 'تنیس', 'پینت‌بال', 'چمن مصنوعی', 'بدمینتون'];
        const availableGenders = ['مرد', 'زن'];

        // مقادیر کاستوم سلکت‌های فرم ثبت
        const regProvinces = ['تهران', 'قم', 'البرز', 'اصفهان', 'خراسان رضوی', 'فارس', 'گیلان', 'مازندران'];
        const regCities = ['تهران', 'قم', 'کرج', 'اصفهان', 'مشهد', 'شیراز', 'رشت', 'ساری'];
        const isRegProvinceOpen = ref(false);
        const isRegCityOpen = ref(false);
        
        const selectRegProvince = (prov) => { venueForm.value.province = prov; isRegProvinceOpen.value = false; };
        const selectRegCity = (city) => { venueForm.value.city = city; isRegCityOpen.value = false; };

        // منطق نقشه
        const handleMapClick = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            venueForm.value.mapCoordinates = { 
                percentX: (x / rect.width) * 100, 
                percentY: (y / rect.height) * 100 
            };
        };

        // منطق آپلود عکس‌های سالن
        const photoInputRef = ref(null);
        const triggerPhotoUpload = () => { photoInputRef.value.click(); };
        const handlePhotoUpload = (e) => {
            const files = Array.from(e.target.files);
            if (venueForm.value.venuePhotos.length + files.length > 4) {
                addNotification('خطا', 'شما مجاز به آپلود حداکثر ۴ تصویر از سالن هستید.', 'error');
                return;
            }
            files.forEach(file => {
                if (venueForm.value.venuePhotos.length < 4) {
                    venueForm.value.venuePhotos.push({
                        id: Date.now() + Math.random(),
                        url: URL.createObjectURL(file),
                        file: file
                    });
                }
            });
            e.target.value = '';
        };
        const removePhoto = (id) => {
            venueForm.value.venuePhotos = venueForm.value.venuePhotos.filter(p => p.id !== id);
        };

        // منطق آپلود فایل سند
        const fileInputRef = ref(null);
        const triggerDocUpload = () => { fileInputRef.value.click(); };
        const handleDocUpload = (e) => {
            const files = Array.from(e.target.files);
            if (venueForm.value.documents.length + files.length > 5) {
                addNotification('خطا', 'شما مجاز به آپلود حداکثر ۵ تصویر هستید.', 'error');
                return;
            }
            files.forEach(file => {
                if (venueForm.value.documents.length < 5) {
                    venueForm.value.documents.push({
                        id: Date.now() + Math.random(),
                        url: URL.createObjectURL(file),
                        file: file
                    });
                }
            });
            e.target.value = '';
        };
        const removeDoc = (id) => {
            venueForm.value.documents = venueForm.value.documents.filter(d => d.id !== id);
        };

        const nextRegisterStep = () => {
            // اعتبارسنجی مراحل (با 6 مرحله جدید)
            if (registerStep.value === 1) {
                if (!venueForm.value.name || !venueForm.value.ownerName || !venueForm.value.phone || !venueForm.value.workingHours.start || !venueForm.value.workingHours.end) {
                    addNotification('خطا', 'لطفاً فیلدهای الزامی (ستاره‌دار) شامل ساعات فعالیت را در این مرحله تکمیل کنید.', 'error');
                    return;
                }
            } else if (registerStep.value === 2) {
                if (venueForm.value.facilities.length === 0) {
                    addNotification('خطا', 'انتخاب حداقل یک امکان رفاهی الزامی است.', 'error');
                    return;
                }
            } else if (registerStep.value === 3) {
                if (venueForm.value.sports.length === 0 || venueForm.value.genders.length === 0) {
                    addNotification('خطا', 'لطفاً حداقل یک رشته ورزشی و جنسیت پذیرش را مشخص کنید.', 'error');
                    return;
                }
            } else if (registerStep.value === 4) {
                // آکادمی اختیاری است، اما اگر فعال شد باید تکمیل شود
                if (venueForm.value.academy.isActive && (venueForm.value.academy.days.length === 0 || !venueForm.value.academy.startTime || !venueForm.value.academy.endTime)) {
                    addNotification('خطا', 'لطفاً روزها و ساعات آکادمی را مشخص کنید یا تیک فعال‌سازی را بردارید.', 'error');
                    return;
                }
            } else if (registerStep.value === 5) {
                if (!venueForm.value.province || !venueForm.value.city || !venueForm.value.address || !venueForm.value.mapCoordinates) {
                    addNotification('خطا', 'لطفاً استان، شهر، آدرس دقیق و لوکیشن روی نقشه را به صورت کامل مشخص کنید.', 'error');
                    return;
                }
            }

            if (registerStep.value < 6) registerStep.value++;
        };
        const prevRegisterStep = () => {
            if (registerStep.value > 1) registerStep.value--;
        };
        
        const submitVenueRegistration = () => {
            if (venueForm.value.venuePhotos.length === 0) {
                addNotification('خطا', 'لطفاً حداقل یک تصویر از محیط سالن ورزشی آپلود کنید.', 'error');
                return;
            }
            if (venueForm.value.documents.length === 0) {
                addNotification('خطا', 'لطفاً حداقل یک تصویر از سند مالکیت یا اجاره‌نامه آپلود کنید.', 'error');
                return;
            }

            // پاکسازی حافظه URLهای ساخته شده
            venueForm.value.documents.forEach(doc => URL.revokeObjectURL(doc.url));
            venueForm.value.venuePhotos.forEach(photo => URL.revokeObjectURL(photo.url));

            handleRegistrationComplete();
            addNotification('ثبت موفق', 'اطلاعات مجموعه ورزشی شما با موفقیت ارسال شد و پس از بررسی فعال خواهد شد.', 'success');
            
            registerStep.value = 1;
            venueForm.value = {
                name: '', ownerName: '', landline: '', phone: '', description: '',
                workingHours: { start: '', end: '' },
                facilities: [], sports: [], genders: [],
                academy: { isActive: false, days: [], startTime: '', endTime: '' },
                province: '', city: '', address: '', mapCoordinates: null, venuePhotos: [], documents: []
            };
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
            purchaseTrackingList,
            handleLogout,
            handleChargeWallet,
            selectAmount,
            selectCity,
            closeCityDropdown,
            saveChanges,
            handleRegistrationComplete,
            
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
            
            bookingRequests,
            handleRequestAction,

            // افزودن متغیرهای مربوط به ویزارد فرم ساز مجموعه
            registerStep,
            venueForm,
            availableFacilities,
            availableSports,
            availableGenders,
            weekdays,
            regProvinces,
            regCities,
            isRegProvinceOpen,
            isRegCityOpen,
            selectRegProvince,
            selectRegCity,
            handleMapClick,
            photoInputRef,
            triggerPhotoUpload,
            handlePhotoUpload,
            removePhoto,
            fileInputRef,
            triggerDocUpload,
            handleDocUpload,
            removeDoc,
            nextRegisterStep,
            prevRegisterStep,
            submitVenueRegistration,
            
            // Time Pickers سفارشی
            activeTimeDropdown,
            timeOptions
        };
    },
    template: `
        <div class="relative pt-24 pb-24 lg:pt-32 lg:pb-32 min-h-screen z-10 font-sans">
            <!-- Background decorative elements for luxury feel -->
            <div class="absolute right-0 top-20 w-[30rem] h-[30rem] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none hidden md:block animate-pulse duration-[5000ms]"></div>
            <div class="absolute left-10 bottom-20 w-[25rem] h-[25rem] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none hidden md:block"></div>

            <div class="container mx-auto px-4 lg:px-8 relative z-20 max-w-6xl">
                
                <!-- Profile Header Banner -->
                <div class="border border-brand-500/20 rounded-[2rem] shadow-xl overflow-hidden relative mb-6 animate-fade-up">
                    <div class="absolute inset-0 bg-gradient-to-r from-brand-600 via-cyan-500 to-blue-600 opacity-100">
                        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 20px 20px;"></div>
                    </div>
                    
                    <div class="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div class="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto text-center md:text-right">
                            <div class="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-[1.8rem] bg-white/20 backdrop-blur-md p-1.5 shadow-xl relative z-10 group transition-transform duration-500 hover:-translate-y-1">
                                <div class="w-full h-full rounded-[1.4rem] border-2 border-white/40 overflow-hidden bg-slate-100 flex items-center justify-center relative">
                                    <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                            </div>
                            
                            <div class="flex flex-col items-center md:items-start space-y-2.5">
                                <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">{{ user.name }}</h2>
                                <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <p class="text-sm text-white font-bold flex items-center gap-1.5 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 shadow-sm">
                                        <svg class="w-4 h-4 text-brand-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                        <span class="dir-ltr">{{ user.phone }}</span>
                                    </p>
                                    <span class="px-3 py-1.5 bg-black/10 backdrop-blur-sm text-white rounded-xl text-xs font-bold border border-white/10 shadow-sm flex items-center gap-1.5">
                                        <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        کاربر عادی
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button @click="handleLogout" class="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black transition-all duration-300 shadow-xl shadow-red-900/20 border border-red-500 group mt-4 md:mt-0">
                            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            خروج از حساب
                        </button>
                    </div>
                </div>

                <!-- Horizontal Tab Navigation -->
                <nav class="glass-panel backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-lg p-2.5 flex items-center gap-2 overflow-x-auto w-full mb-8 sticky top-24 z-30 animate-fade-up delay-75 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button @click="activeTab = 'overview'" 
                            :class="activeTab === 'overview' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400'"
                            class="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap shrink-0 group relative overflow-hidden">
                        <div v-if="activeTab === 'overview'" class="absolute inset-0 bg-gradient-to-r from-brand-400 to-cyan-500 opacity-100 z-0"></div>
                        <svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span class="relative z-10">داشبورد من</span>
                    </button>
                    
                    <button @click="activeTab = 'tracking'" 
                            :class="activeTab === 'tracking' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-500 border border-transparent'"
                            class="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap shrink-0 group">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        پیگیری خرید
                    </button>

                    <button @click="activeTab = 'purchases'" 
                            :class="activeTab === 'purchases' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-500 border border-transparent'"
                            class="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap shrink-0 group">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        سوابق خرید
                    </button>
                    
                    <button @click="activeTab = 'profile'" 
                            :class="activeTab === 'profile' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-500 border border-transparent'"
                            class="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap shrink-0 group">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        ویرایش اطلاعات
                    </button>

                    <button @click="activeTab = 'security'" 
                            :class="activeTab === 'security' ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-500 border border-transparent'"
                            class="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap shrink-0 group">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        تغییر رمز عبور
                    </button>

                    <button @click="activeTab = 'venues'" 
                            :class="['venues', 'register'].includes(activeTab) ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-500 border border-transparent'"
                            class="flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap shrink-0 group mr-auto">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        سالن من
                    </button>
                </nav>

                <!-- Main Content Area -->
                <main class="w-full animate-fade-up delay-150 relative min-h-[500px]">
                    <transition name="fade-slide" mode="out-in">
                        
                        <!-- TAB: Overview (داشبورد من) -->
                        <div v-if="activeTab === 'overview'" key="overview" class="space-y-6">
                            <!-- محتوای داشبورد -->
                            <div class="relative bg-gradient-to-r from-slate-900 to-slate-800 dark:from-[#0a0f1d] dark:to-slate-900 rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50 dark:border-brand-500/20 group">
                                <div class="absolute inset-0 opacity-[0.15]" style="background-image: radial-gradient(#94a3b8 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
                                <div class="absolute -right-20 -top-20 w-72 h-72 bg-brand-500/20 rounded-full blur-[80px] group-hover:bg-brand-500/30 transition-all duration-700"></div>
                                <div class="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-600/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-all duration-700"></div>
                                
                                <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-6">
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

                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div class="lg:col-span-5 bg-gradient-to-br from-brand-600 to-blue-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-brand-400/30 flex flex-col justify-between min-h-[220px] transition-transform duration-500 hover:-translate-y-1">
                                    <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
                                    <div class="absolute left-6 top-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke-width="1.5"></rect><rect x="9" y="9" width="6" height="6" rx="1" ry="1" stroke-width="1.5"></rect><line x1="9" y1="4" x2="9" y2="9" stroke-width="1.5"></line><line x1="15" y1="4" x2="15" y2="9" stroke-width="1.5"></line><line x1="9" y1="15" x2="9" y2="20" stroke-width="1.5"></line><line x1="15" y1="15" x2="15" y2="20" stroke-width="1.5"></line><line x1="4" y1="9" x2="9" y2="9" stroke-width="1.5"></line><line x1="4" y1="15" x2="9" y2="15" stroke-width="1.5"></line><line x1="15" y1="9" x2="20" y2="9" stroke-width="1.5"></line><line x1="15" y1="15" x2="20" y2="15" stroke-width="1.5"></line></svg>
                                    </div>
                                    
                                    <div class="relative z-10 space-y-6">
                                        <div>
                                            <p class="text-white/70 text-sm font-bold mb-1">موجودی کیف پول شما</p>
                                            <div class="flex items-baseline gap-2">
                                                <h4 class="text-4xl md:text-5xl font-black text-white tracking-tight">{{ user.credit }}</h4>
                                                <span class="text-base font-medium text-white/70">تومان</span>
                                            </div>
                                        </div>
                                        
                                        <div class="pt-4 border-t border-white/10 flex justify-end">
                                            <button @click="showChargeModal = true" class="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                افزایش فوری اعتبار
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="lg:col-span-7 bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-xl border border-slate-200 dark:border-white/10 flex flex-col justify-center relative overflow-hidden group hover:border-brand-500/30 transition-all duration-500">
                                    <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                                    
                                    <div class="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                                        <div class="relative w-36 h-36 shrink-0 flex items-center justify-center">
                                            <svg class="w-full h-full transform -rotate-90 absolute inset-0 drop-shadow-md" viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-100 dark:stroke-white/5" stroke-width="2.5"></circle>
                                                <circle cx="18" cy="18" r="16" fill="none" class="stroke-brand-500 transition-all duration-1000 ease-out" stroke-width="2.5" stroke-dasharray="100" stroke-dashoffset="35" stroke-linecap="round"></circle>
                                            </svg>
                                            <div class="flex flex-col items-center justify-center bg-white dark:bg-slate-800 w-28 h-28 rounded-full shadow-sm border border-slate-50 dark:border-white/5 z-10">
                                                <span class="text-4xl font-black text-slate-800 dark:text-white">{{ purchaseTrackingList.length }}</span>
                                                <span class="text-xs font-bold text-slate-500 mt-1">جاری</span>
                                            </div>
                                        </div>
                                        
                                        <div class="flex-1 text-center md:text-right space-y-5">
                                            <div>
                                                <h4 class="text-2xl font-black text-slate-800 dark:text-white mb-2">پیگیری وضعیت درخواست‌ها</h4>
                                                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                                                    شما {{ purchaseTrackingList.length }} درخواست در حال پردازش دارید که منتظر تایید توسط مدیریت سالن‌ها می‌باشد.
                                                </p>
                                            </div>
                                            
                                            <button @click="activeTab = 'tracking'" class="inline-flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 font-bold px-6 py-3.5 rounded-xl transition-all w-full sm:w-auto border border-brand-500/20">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                مشاهده لیست درخواست‌ها
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB: Tracking (پیگیری خرید) -->
                        <div v-else-if="activeTab === 'tracking'" key="tracking" class="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10">
                            <!-- محتوای پیگیری تغییر نکرده است -->
                            <div class="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                    </div>
                                    <div>
                                        <h3 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-1">پیگیری درخواست‌های خرید</h3>
                                        <p class="text-sm text-slate-500 dark:text-slate-400">وضعیت و سوابق خریدهای در جریان شما</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="space-y-5">
                                <div v-for="item in purchaseTrackingList" :key="item.id" class="bg-white dark:bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-brand-500/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group shadow-sm hover:shadow-md">
                                    <div class="flex items-start gap-5 flex-1">
                                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                                            :class="{
                                                'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10': item.status === 'approved',
                                                'bg-amber-50 text-amber-500 dark:bg-amber-500/10': item.status === 'pending',
                                                'bg-blue-50 text-blue-500 dark:bg-blue-500/10': item.status === 'review',
                                                'bg-red-50 text-red-500 dark:bg-red-500/10': item.status === 'rejected'
                                            }">
                                            <svg v-if="item.status === 'approved'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <svg v-else-if="item.status === 'pending'" class="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <svg v-else-if="item.status === 'review'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            <svg v-else-if="item.status === 'rejected'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        
                                        <div class="space-y-2 w-full">
                                            <div class="flex flex-wrap items-center justify-between gap-2">
                                                <h4 class="font-bold text-lg text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">{{ item.venueName }}</h4>
                                                <span class="text-xs text-slate-500 bg-slate-100 dark:bg-dark-border px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/5">کد پیگیری: {{ item.id }}</span>
                                            </div>
                                            <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span class="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md"><svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> سانس: {{ item.date }}</span>
                                                <span class="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md"><svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ساعت: {{ item.time }}</span>
                                                <span class="text-[11px]">ثبت درخواست: {{ item.reqDate }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-3 border-t border-slate-100 dark:border-white/5 md:border-0 pt-4 md:pt-0 md:pl-6 md:border-r">
                                        <div class="text-slate-800 dark:text-white font-black text-lg">{{ item.price }} <span class="text-xs font-normal text-slate-500">تومان</span></div>
                                        
                                        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm"
                                            :class="{
                                                'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': item.status === 'approved',
                                                'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20': item.status === 'pending',
                                                'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': item.status === 'review',
                                                'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20': item.status === 'rejected'
                                            }">
                                            <span class="w-2 h-2 rounded-full" 
                                                  :class="{
                                                    'bg-emerald-500': item.status === 'approved',
                                                    'bg-amber-500 animate-pulse': item.status === 'pending',
                                                    'bg-blue-500 animate-pulse': item.status === 'review',
                                                    'bg-red-500': item.status === 'rejected'
                                                  }"></span>
                                            {{ item.statusText }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB: Profile (ویرایش اطلاعات) -->
                        <div v-else-if="activeTab === 'profile'" key="profile" class="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10">
                            <!-- محتوای پروفایل تغییر نکرده است -->
                            <div class="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div class="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </div>
                                <h3 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">ویرایش اطلاعات کاربری</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام و نام خانوادگی</label>
                                    <input type="text" :value="user.name" class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors shadow-sm" placeholder="نام خود را وارد کنید">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره موبایل (غیرقابل تغییر)</label>
                                    <input type="text" :value="user.phone" disabled class="w-full bg-slate-100 dark:bg-dark-bg/50 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-500 rounded-xl px-4 py-3.5 opacity-70 cursor-not-allowed text-left dir-ltr shadow-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ایمیل (اختیاری)</label>
                                    <input type="email" class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-left dir-ltr shadow-sm" placeholder="example@email.com">
                                </div>
                                
                                <div class="relative" @blur="closeCityDropdown" tabindex="0">
                                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شهر محل سکونت</label>
                                    <div @click="isCityDropdownOpen = !isCityDropdownOpen" 
                                         class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all duration-300 shadow-sm"
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
                                <button @click="saveChanges('profile')" class="w-full sm:w-auto bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-glow transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    ذخیره تغییرات
                                </button>
                            </div>
                        </div>

                        <!-- TAB: Security (تغییر رمز عبور) -->
                        <div v-else-if="activeTab === 'security'" key="security" class="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 overflow-hidden relative">
                            <!-- محتوای امنیت تغییر نکرده است -->
                            <div class="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6 relative z-10">
                                <div class="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <h3 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">تغییر رمز عبور</h3>
                            </div>
                            
                            <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center relative z-10">
                                <div class="hidden lg:flex lg:col-span-2 flex-col items-center justify-center relative">
                                    <div class="absolute inset-0 bg-brand-500/20 rounded-full blur-[60px] animate-pulse"></div>
                                    <svg class="w-48 h-48 text-brand-500/80 dark:text-brand-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>

                                <div class="lg:col-span-3 space-y-6 bg-slate-50/50 dark:bg-dark-bg/30 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner">
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
                                        <button @click="saveChanges('security')" class="w-full sm:w-auto bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-glow transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            بروزرسانی رمز عبور
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB: Venues (سالن من) -->
                        <div v-else-if="activeTab === 'venues'" key="venues" class="space-y-6">
                            <!-- محتوای سالن من تغییر نکرده است (شامل تقویم و ...) -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-md">
                                <div>
                                    <h3 class="text-2xl font-black text-slate-800 dark:text-white">مدیریت سالن‌های من</h3>
                                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">سالن ثبت‌شده خود را مدیریت کنید یا سالن جدیدی اضافه نمایید.</p>
                                </div>
                                <button @click="activeTab = 'register'" class="bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-black py-3 px-6 rounded-xl shadow-glow transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                                    افزودن سالن
                                </button>
                            </div>

                            <div v-if="userVenueStatus === 'pending'" class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-sm animate-fade-up">
                                <div class="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6 relative">
                                    <div class="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
                                    <svg class="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h4 class="text-2xl font-black text-amber-800 dark:text-amber-400 mb-2">سالن شما در انتظار تایید است</h4>
                                <p class="text-slate-600 dark:text-amber-500/80 font-medium max-w-lg mx-auto">
                                    مدارک و اطلاعات سالن شما دریافت شد و هم‌اکنون توسط کارشناسان ما در حال بررسی می‌باشد. نتیجه بررسی به زودی از طریق پیامک به شما اطلاع داده خواهد شد.
                                </p>
                            </div>

                            <div v-if="userVenueStatus === 'active'" @click="showManagementPanel = !showManagementPanel" 
                                 class="glass-panel rounded-[2.5rem] p-6 shadow-xl border border-slate-200 dark:border-white/10 hover:border-brand-500/50 cursor-pointer transition-all duration-300 hover:shadow-glow-subtle flex flex-col md:flex-row items-center gap-6 group relative overflow-hidden">
                                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all duration-500"></div>
                                <div class="w-full md:w-56 h-36 rounded-2xl overflow-hidden shadow-md shrink-0 relative group-hover:scale-[1.02] transition-transform duration-500">
                                    <img :src="userVenue.image" alt="Venue Image" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span class="absolute bottom-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <span class="w-2 h-2 bg-white rounded-full animate-ping"></span>
                                        {{ userVenue.status }}
                                    </span>
                                </div>
                                <div class="flex-1 w-full text-center md:text-right space-y-2">
                                    <h4 class="text-2xl font-black text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">{{ userVenue.name }}</h4>
                                    <p class="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1">
                                        <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {{ userVenue.address }}
                                    </p>
                                    <div class="flex items-center justify-center md:justify-start gap-4 pt-2">
                                        <span class="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                                            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            {{ userVenue.rating }}
                                        </span>
                                        <span class="text-sm text-slate-400 font-medium">{{ userVenue.reviewsCount }}</span>
                                    </div>
                                </div>
                                <div class="bg-slate-100 dark:bg-white/5 p-4 rounded-full text-slate-400 group-hover:text-brand-500 transition-colors shrink-0">
                                    <svg class="w-7 h-7 transition-transform duration-300" :class="{'rotate-180': showManagementPanel}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <transition name="fade-slide">
                                <div v-if="showManagementPanel && userVenueStatus === 'active'" class="space-y-6 animate-fade-up">
                                    <!-- تقویم و بقیه پنل مدیریت بدون تغییر -->
                                    <div class="glass-panel rounded-[2.5rem] p-6 lg:p-10 shadow-lg border border-slate-200 dark:border-white/10 space-y-6">
                                        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                                            <div class="flex items-center gap-3">
                                                <svg class="w-7 h-7 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                <h5 class="font-black text-slate-800 dark:text-white text-xl">تقویم مدیریت سانس‌ها</h5>
                                            </div>
                                            <div class="flex items-center bg-slate-100/50 dark:bg-dark-bg/50 rounded-xl p-1.5 border border-slate-200/60 dark:border-white/5 shadow-inner">
                                                <button @click="goPrevMonth" class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all flex items-center text-slate-500 dark:text-slate-400 hover:text-brand-500 shadow-sm">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                                </button>
                                                <span class="px-6 font-bold text-lg text-slate-800 dark:text-slate-200 min-w-[150px] text-center">{{ currentMonthLabel }}</span>
                                                <button @click="goNextMonth" class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all flex items-center text-slate-500 dark:text-slate-400 hover:text-brand-500 shadow-sm">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <transition name="fade-slide" mode="out-in">
                                            <div v-if="!selectedManageDay" key="month-view" class="space-y-4">
                                                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                                    جهت مشاهده، تخصیص وضعیت یا لغو و مسدودسازی سانس‌های هر روز، لطفا روی خانه آن روز در جدول زیر کلیک کنید.
                                                </p>
                                                <div class="grid grid-cols-7 gap-3 text-center border-b border-slate-100 dark:border-white/5 pb-2">
                                                    <span v-for="w in weekdays" :key="w" class="text-sm font-bold text-slate-400 dark:text-slate-500">{{ w }}</span>
                                                </div>
                                                <div class="grid grid-cols-7 gap-3">
                                                    <div v-for="(day, idx) in currentMonthDays" :key="idx"
                                                         @click="!day.isPlaceholder && selectDayForManage(day)"
                                                         class="aspect-square rounded-2xl p-2 md:p-4 flex flex-col items-center justify-between border transition-all duration-300 relative group"
                                                         :class="[
                                                             day.isPlaceholder ? 'opacity-0 cursor-default pointer-events-none' : 'cursor-pointer hover:-translate-y-1 hover:shadow-glow-subtle',
                                                             day.isToday ? 'bg-gradient-to-tr from-brand-500 to-cyan-500 text-white border-transparent ring-4 ring-brand-500/20' : 'bg-slate-50/40 dark:bg-dark-bg/20 border-slate-200 dark:border-white/10 hover:border-brand-500/50',
                                                             day.status === 'closed' && !day.isToday ? 'border-red-500/30 hover:border-red-500/50' : ''
                                                         ]">
                                                         <span v-if="!day.isPlaceholder" class="text-lg md:text-xl font-black" :class="day.isToday ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
                                                             {{ day.dayNumber }}
                                                         </span>
                                                         <div v-if="!day.isPlaceholder" class="flex items-center gap-1.5 mt-auto">
                                                             <span class="w-2 h-2 rounded-full shadow-sm" :class="day.status === 'closed' ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'"></span>
                                                             <span class="text-[10px] md:text-xs font-bold hidden sm:inline" :class="day.isToday ? 'text-white/90' : (day.status === 'closed' ? 'text-red-500' : 'text-emerald-500')">
                                                                 {{ day.status === 'closed' ? 'تعطیل' : 'فعال' }}
                                                             </span>
                                                         </div>
                                                         <span v-if="day.isToday" class="absolute -top-2 -left-2 bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce">امروز</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-else key="day-view" class="space-y-4">
                                                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-50 dark:bg-brand-500/10 p-5 rounded-2xl border border-brand-500/20">
                                                    <div>
                                                        <h6 class="font-black text-brand-800 dark:text-brand-400 text-base">برنامه زمان‌بندی و وضعیت سانس‌ها</h6>
                                                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">سانس‌های روز {{ selectedManageDay.weekdayName }} {{ selectedManageDay.dayNumber }} {{ currentMonthLabel }}</p>
                                                    </div>
                                                    <button @click="selectedManageDay = null" class="w-full sm:w-auto text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-white dark:hover:bg-dark-bg px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm border border-brand-500/10 hover:scale-[1.02]">
                                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                                        بازگشت به تقویم
                                                    </button>
                                                </div>
                                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    <div v-for="slot in dayTimeslots" :key="slot.id" class="p-5 rounded-2xl border flex flex-col gap-3 transition-all group hover:shadow-md"
                                                         :class="{
                                                             'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-500/5': slot.status === 'free',
                                                             'border-red-200 dark:border-red-500/20 bg-red-50/20 dark:bg-red-500/5': slot.status === 'booked',
                                                             'border-slate-200 dark:border-slate-600/30 bg-slate-100/50 dark:bg-slate-800/30': slot.status === 'closed'
                                                         }">
                                                         <div class="flex items-center justify-between">
                                                             <span class="font-black text-slate-800 dark:text-white dir-ltr text-right tracking-wider">{{ slot.time }}</span>
                                                             <span class="text-xs px-3 py-1.5 rounded-lg font-black flex items-center gap-1.5"
                                                                   :class="{
                                                                       'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400': slot.status === 'free',
                                                                       'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400': slot.status === 'booked',
                                                                       'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300': slot.status === 'closed'
                                                                   }">
                                                                   <span class="w-2 h-2 rounded-full animate-pulse" :class="slot.status === 'free' ? 'bg-emerald-500' : slot.status === 'booked' ? 'bg-red-500' : 'bg-slate-500'"></span>
                                                                   {{ slot.status === 'free' ? 'آزاد' : slot.status === 'booked' ? 'رزرو شده' : 'بسته شده' }}
                                                             </span>
                                                         </div>
                                                         <div v-if="slot.status === 'booked'" class="text-sm text-red-600/80 dark:text-red-400/80 font-bold flex items-center gap-1.5">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> رزرو توسط: {{ slot.user }}
                                                         </div>
                                                         <div v-if="slot.status === 'closed'" class="text-sm text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> علت: {{ slot.reason }}
                                                         </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>

                                    <div class="glass-panel rounded-[2.5rem] p-6 lg:p-10 shadow-lg border border-slate-200 dark:border-white/10 space-y-6" style="margin-bottom:70px;">
                                        <div class="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                                            <svg class="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                            <h5 class="font-black text-slate-800 dark:text-white text-xl">بستن موقت و محدودسازی سانس‌ها</h5>
                                        </div>
                                        
                                        <div class="space-y-4">
                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">تاریخ مسدودسازی سانس</label>
                                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div class="relative">
                                                    <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">سال</span>
                                                    <div @click="toggleDropdown('year')" class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500">
                                                        <span class="font-bold">{{ closeForm.year || 'انتخاب...' }}</span>
                                                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                    <transition name="dropdown">
                                                        <div v-if="activeDropdown === 'year'" class="absolute left-0 right-0 mt-1.5 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                                                            <div v-for="y in ['۱۴۰۴', '۱۴۰۵', '۱۴۰۶']" :key="y" @click="selectDropdownValue('year', y)" class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer font-bold text-slate-700 dark:text-slate-200 transition-colors">{{ y }}</div>
                                                        </div>
                                                    </transition>
                                                </div>
                                                <div class="relative">
                                                    <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">ماه</span>
                                                    <div @click="toggleDropdown('month')" class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500">
                                                        <span class="font-bold">{{ closeForm.month || 'انتخاب...' }}</span>
                                                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                    <transition name="dropdown">
                                                        <div v-if="activeDropdown === 'month'" class="absolute left-0 right-0 mt-1.5 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                            <div v-for="m in persianMonths" :key="m" @click="selectDropdownValue('month', m)" class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer font-bold text-slate-700 dark:text-slate-200 transition-colors">{{ m }}</div>
                                                        </div>
                                                    </transition>
                                                </div>
                                                <div class="relative">
                                                    <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">روز</span>
                                                    <div @click="closeForm.month ? toggleDropdown('day') : addNotification('هشدار', 'ابتدا ماه را انتخاب کنید', 'info')" class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500">
                                                        <span class="font-bold">{{ closeForm.day || 'انتخاب...' }}</span>
                                                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                    <transition name="dropdown">
                                                        <div v-if="activeDropdown === 'day' && closeFormDays.length > 0" class="absolute left-0 right-0 mt-1.5 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                            <div v-for="d in closeFormDays" :key="d" @click="selectDropdownValue('day', d)" class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer font-bold text-slate-700 dark:text-slate-200 transition-colors">{{ d }}</div>
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="relative" :class="{'z-[60]': activeDropdown === 'time'}">
                                                <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">محدوده سانس</span>
                                                <div @click="toggleDropdown('time')" class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500">
                                                    <span class="font-bold dir-ltr">{{ closeForm.time || 'انتخاب...' }}</span>
                                                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                <transition name="dropdown">
                                                    <div v-if="activeDropdown === 'time'" class="absolute left-0 right-0 mt-1.5 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                        <div v-for="t in availableSlotsForClose" :key="t" @click="selectDropdownValue('time', t)" class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer font-bold text-slate-700 dark:text-slate-200 transition-colors dir-ltr text-right">{{ t }}</div>
                                                    </div>
                                                </transition>
                                            </div>
                                            <div class="relative" :class="{'z-[60]': activeDropdown === 'reason'}">
                                                <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">علت مسدودسازی</span>
                                                <div @click="toggleDropdown('reason')" class="w-full bg-slate-50/70 dark:bg-dark-bg/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-brand-500">
                                                    <span class="font-bold">{{ closeForm.reason || 'انتخاب...' }}</span>
                                                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                <transition name="dropdown">
                                                    <div v-if="activeDropdown === 'reason'" class="absolute left-0 right-0 mt-1.5 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                                                        <div v-for="r in closeReasons" :key="r" @click="selectDropdownValue('reason', r)" class="px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer font-bold text-slate-700 dark:text-slate-200 transition-colors">{{ r }}</div>
                                                    </div>
                                                </transition>
                                            </div>
                                        </div>

                                        <div class="flex justify-end pt-2">
                                            <button @click="submitCloseSlot" class="w-full sm:w-auto px-8 bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-glow hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                                اعمال مسدودسازی
                                            </button>
                                        </div>
                                    </div>

                                    <div v-if="closingAnnouncements.length > 0" class="glass-panel rounded-[2rem] p-6 shadow-lg border border-slate-200 dark:border-white/10 space-y-3">
                                        <h6 class="text-sm font-bold text-slate-700 dark:text-slate-300">سانس‌های مسدود شده فعال:</h6>
                                        <div class="space-y-3">
                                            <div v-for="ann in closingAnnouncements" :key="ann.id" class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl gap-4">
                                                <div class="flex items-start gap-2 text-slate-700 dark:text-amber-300">
                                                    <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                    <span class="font-bold text-sm leading-relaxed">{{ ann.text }}</span>
                                                </div>
                                                <button @click="removeClosingTime(ann.id)" class="text-red-500 hover:text-red-600 font-bold px-4 py-2 bg-red-500/10 rounded-lg transition-colors whitespace-nowrap shrink-0">
                                                    حذف و بازگشایی
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="glass-panel rounded-[2.5rem] p-6 lg:p-10 shadow-lg border border-slate-200 dark:border-white/10 space-y-4">
                                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                                            <div class="flex items-center gap-3">
                                                <div class="status-pulse"></div>
                                                <h5 class="font-black text-slate-800 dark:text-white text-xl">درخواست‌های رزرواسیون</h5>
                                            </div>
                                            <span class="text-sm bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-full font-bold">
                                                {{ bookingRequests.length }} درخواست
                                            </span>
                                        </div>

                                        <div v-if="bookingRequests.length === 0" class="text-center py-8 text-slate-400 text-sm font-medium">
                                            هیچ درخواست تایید نشده‌ای در حال حاضر وجود ندارد.
                                        </div>

                                        <div v-else class="space-y-4">
                                            <div v-for="req in bookingRequests" :key="req.id" class="bg-slate-50/70 dark:bg-dark-bg/20 border border-slate-100 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-brand-500/20 shadow-sm">
                                                <div class="flex items-start gap-4">
                                                    <div class="w-14 h-14 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center shrink-0">
                                                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                    </div>
                                                    <div class="space-y-2">
                                                        <h6 class="font-bold text-lg text-slate-800 dark:text-white">{{ req.userName }}</h6>
                                                        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                            <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>{{ req.date }}</span>
                                                            <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{{ req.time }}</span>
                                                            <span class="text-slate-400 font-normal dir-ltr">{{ req.phone }}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-5 border-t border-slate-100 dark:border-white/5 md:border-0 pt-4 md:pt-0">
                                                    <div class="text-right sm:pl-6 sm:border-l border-slate-200 dark:border-white/5 space-y-1.5">
                                                        <div class="text-xs text-slate-400 font-medium">کل مبلغ: <span class="text-slate-700 dark:text-slate-200 font-bold text-sm">{{ req.totalPrice }} تومان</span></div>
                                                        <div class="flex items-center gap-2 justify-end">
                                                            <span :class="req.paymentType === 'پرداخت کامل' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'" class="px-2.5 py-1 rounded-md text-xs font-bold">
                                                                {{ req.paymentType }}
                                                            </span>
                                                            <span class="text-brand-600 dark:text-brand-400 font-black text-base">{{ req.paidAmount }} <span class="text-[10px] font-normal text-slate-400">واریز شده</span></span>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center gap-3 shrink-0">
                                                        <button @click="handleRequestAction(req.id, 'rejected')" class="flex-1 sm:flex-none bg-red-50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">رد</button>
                                                        <button @click="handleRequestAction(req.id, 'approved')" class="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20">تایید سانس</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </transition>
                        </div>

                        <!-- TAB: Purchases (تاریخچه خرید کامل شده) -->
                        <div v-else-if="activeTab === 'purchases'" key="purchases" class="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10">
                            <!-- محتوای تاریخچه خرید تغییر نکرده است -->
                            <div class="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500">
                                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    </div>
                                    <h3 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">تاریخچه خریدهای شما</h3>
                                </div>
                                <button @click="activeTab = 'overview'" class="text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5">
                                    بازگشت
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </button>
                            </div>
                            
                            <div class="space-y-4">
                                <div v-for="item in purchaseHistory" :key="item.id" class="bg-white dark:bg-dark-bg/50 border border-slate-200 dark:border-white/5 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-brand-500/30 transition-all shadow-sm hover:shadow-md">
                                    <div class="flex items-start gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <div>
                                            <h6 class="font-bold text-slate-800 dark:text-white">{{ item.venueName }}</h6>
                                            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                                <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>{{ item.date }}</span>
                                                <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{{ item.time }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right sm:text-left flex flex-row sm:flex-col items-center sm:items-end justify-between border-t border-slate-100 dark:border-white/5 sm:border-0 pt-4 sm:pt-0">
                                        <div class="font-black text-slate-800 dark:text-white text-lg">{{ item.price }} <span class="text-xs font-normal text-slate-500">تومان</span></div>
                                        <div class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg mt-1 flex items-center gap-1.5 shadow-sm">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                            {{ item.status }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB: Register Venue (افزودن مجموعه ورزشی) - UPDATED -->
                        <div v-else-if="activeTab === 'register'" key="register" class="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 relative overflow-hidden">
                            <!-- Background Decor -->
                            <div class="absolute -right-20 -top-20 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                            <!-- Header -->
                            <div class="flex items-center justify-between mb-8 relative z-10 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-cyan-500 text-white flex items-center justify-center shadow-glow">
                                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    </div>
                                    <div>
                                        <h3 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-1">ثبت مجموعه ورزشی جدید</h3>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">اطلاعات سالن خود را در ۶ مرحله به صورت دقیق تکمیل کنید</p>
                                    </div>
                                </div>
                                <button @click="activeTab = 'venues'" class="text-sm font-bold text-slate-600 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 bg-slate-100 hover:bg-red-50 dark:bg-dark-bg/50 dark:hover:bg-red-500/10 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 group border border-transparent hover:border-red-200 dark:hover:border-red-500/20">
                                    انصراف <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <!-- Stepper Indicator -->
                            <div class="relative z-10 mb-12 px-2 sm:px-8">
                                <div class="flex items-center justify-between relative">
                                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full z-0"></div>
                                    <div class="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-l from-brand-500 to-cyan-500 rounded-full z-0 transition-all duration-700 ease-in-out" :style="{ width: ((registerStep - 1) / 5) * 100 + '%' }"></div>
                                    
                                    <div v-for="step in 6" :key="step" 
                                         class="relative z-10 flex flex-col items-center gap-3 transition-all duration-500"
                                         :class="registerStep >= step ? 'opacity-100 scale-100' : 'opacity-40 scale-95 grayscale'">
                                        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-base md:text-lg transition-all duration-300"
                                             :class="registerStep >= step ? 'bg-brand-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-4 ring-brand-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-2 border-white dark:border-dark-card'">
                                            <span v-if="registerStep > step"><svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
                                            <span v-else>{{ step }}</span>
                                        </div>
                                        <span class="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:block whitespace-nowrap bg-white dark:bg-dark-card px-2 py-0.5 rounded-md">
                                            {{ ['اطلاعات اصلی', 'امکانات سالن', 'رشته و سانس', 'آکادمی', 'موقعیت و آدرس', 'تایید مدارک'][step-1] }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Content Container -->
                            <div class="relative z-10 bg-slate-50/50 dark:bg-dark-bg/40 p-6 md:p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-inner min-h-[350px]">
                                
                                <!-- Step 1: General Info -->
                                <transition name="fade-slide" mode="out-in">
                                    <div v-if="registerStep === 1" key="step1" class="space-y-6">
                                        <h4 class="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span class="w-1.5 h-6 bg-brand-500 rounded-full"></span> اطلاعات پایه مجموعه ورزشی
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام مجموعه / سالن <span class="text-red-500">*</span></label>
                                                <input v-model="venueForm.name" type="text" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm font-medium" placeholder="مثلا: مجموعه ورزشی شهدای انقلاب">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نام مالک / مدیر سالن <span class="text-red-500">*</span></label>
                                                <input v-model="venueForm.ownerName" type="text" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm font-medium" placeholder="نام کامل شخص پاسخگو">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره تماس ثابت سالن</label>
                                                <input v-model="venueForm.landline" type="tel" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm dir-ltr text-right font-medium" placeholder="021-12345678">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شماره موبایل مالک <span class="text-red-500">*</span></label>
                                                <input v-model="venueForm.phone" type="tel" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm dir-ltr text-right font-medium" placeholder="09123456789">
                                            </div>
                                        </div>

                                        <!-- ساعت کاری پیش‌فرض تغییر یافته به کاستوم سلکت -->
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                                            <div class="relative" :class="{'z-50': activeTimeDropdown === 'workStart'}" @blur="activeTimeDropdown = ''" tabindex="0">
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ساعت شروع فعالیت سالن <span class="text-red-500">*</span></label>
                                                <div @click="activeTimeDropdown = activeTimeDropdown === 'workStart' ? '' : 'workStart'" 
                                                     class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all shadow-sm font-medium"
                                                     :class="{'border-brand-500 ring-2 ring-brand-500/20': activeTimeDropdown === 'workStart'}">
                                                    <span class="dir-ltr">{{ venueForm.workingHours.start || 'انتخاب ساعت...' }}</span>
                                                    <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeTimeDropdown === 'workStart'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                <transition name="dropdown">
                                                    <div v-if="activeTimeDropdown === 'workStart'" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                        <div v-for="t in timeOptions" :key="'ws'+t" 
                                                             @click.stop="venueForm.workingHours.start = t; activeTimeDropdown = ''" 
                                                             class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors text-left dir-ltr flex items-center justify-between group">
                                                            {{ t }}
                                                            <svg v-if="venueForm.workingHours.start === t" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>
                                            
                                            <div class="relative" :class="{'z-50': activeTimeDropdown === 'workEnd'}" @blur="activeTimeDropdown = ''" tabindex="0">
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ساعت پایان فعالیت سالن <span class="text-red-500">*</span></label>
                                                <div @click="activeTimeDropdown = activeTimeDropdown === 'workEnd' ? '' : 'workEnd'" 
                                                     class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all shadow-sm font-medium"
                                                     :class="{'border-brand-500 ring-2 ring-brand-500/20': activeTimeDropdown === 'workEnd'}">
                                                    <span class="dir-ltr">{{ venueForm.workingHours.end || 'انتخاب ساعت...' }}</span>
                                                    <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeTimeDropdown === 'workEnd'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                <transition name="dropdown">
                                                    <div v-if="activeTimeDropdown === 'workEnd'" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                        <div v-for="t in timeOptions" :key="'we'+t" 
                                                             @click.stop="venueForm.workingHours.end = t; activeTimeDropdown = ''" 
                                                             class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors text-left dir-ltr flex items-center justify-between group">
                                                            {{ t }}
                                                            <svg v-if="venueForm.workingHours.end === t" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">توضیحات و معرفی سالن</label>
                                            <textarea v-model="venueForm.description" rows="4" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm font-medium" placeholder="توضیحات مختصری درباره سالن، ابعاد زمین، نوع کفپوش، سال تاسیس و شرایط کلی..."></textarea>
                                        </div>
                                    </div>
                                    
                                    <!-- Step 2: Facilities -->
                                    <div v-else-if="registerStep === 2" key="step2" class="space-y-6">
                                        <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                            <span class="w-1.5 h-6 bg-brand-500 rounded-full"></span> امکانات رفاهی و تجهیزات
                                        </h4>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">مواردی که در مجموعه شما برای ورزشکاران در دسترس است را انتخاب کنید (حداقل یک مورد): <span class="text-red-500">*</span></p>
                                        
                                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <label v-for="fac in availableFacilities" :key="fac.id" 
                                                   class="relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden"
                                                   :class="venueForm.facilities.includes(fac.id) ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-md shadow-brand-500/10' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-dark-bg hover:border-brand-300'">
                                                <input type="checkbox" :value="fac.id" v-model="venueForm.facilities" class="hidden">
                                                
                                                <div class="w-14 h-14 rounded-full mb-3 flex items-center justify-center transition-all duration-300"
                                                     :class="venueForm.facilities.includes(fac.id) ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110' : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10'">
                                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="fac.icon"></path></svg>
                                                </div>
                                                
                                                <span class="text-sm font-bold text-center transition-colors" :class="venueForm.facilities.includes(fac.id) ? 'text-brand-700 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'">{{ fac.name }}</span>
                                                
                                                <!-- Checkmark Overlay -->
                                                <div class="absolute top-3 right-3 scale-0 opacity-0 transition-all duration-300" :class="{'scale-100 opacity-100': venueForm.facilities.includes(fac.id)}">
                                                    <div class="bg-brand-500 text-white rounded-full p-0.5 shadow-sm">
                                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Step 3: Sports & Gender -->
                                    <div v-else-if="registerStep === 3" key="step3" class="space-y-8">
                                        <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                            <span class="w-1.5 h-6 bg-brand-500 rounded-full"></span> رشته‌های ورزشی و مخاطبین
                                        </h4>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">رشته‌های قابل اجرا در زمین و جنسیت پذیرش را مشخص کنید (انتخاب حداقل یکی الزامی است).</p>

                                        <!-- Sports -->
                                        <div class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                                            <h5 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">رشته‌های ورزشی مجاز <span class="text-red-500">*</span></h5>
                                            <div class="flex flex-wrap gap-3">
                                                <label v-for="sport in availableSports" :key="sport" class="cursor-pointer group">
                                                    <input type="checkbox" :value="sport" v-model="venueForm.sports" class="hidden">
                                                    <div class="px-5 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-sm select-none flex items-center gap-2"
                                                         :class="venueForm.sports.includes(sport) ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-brand-300'">
                                                        <span v-if="venueForm.sports.includes(sport)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
                                                        {{ sport }}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <!-- Genders -->
                                        <div class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                                            <h5 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">جنسیت پذیرش <span class="text-red-500">*</span></h5>
                                            <div class="flex flex-wrap gap-4">
                                                <label v-for="gender in availableGenders" :key="gender" class="flex items-center gap-3 cursor-pointer p-4 pr-5 rounded-xl border-2 transition-all duration-300 group w-32 justify-center"
                                                    :class="venueForm.genders.includes(gender) ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-brand-300'">
                                                    <div class="relative w-6 h-6 flex items-center justify-center shrink-0">
                                                        <input type="checkbox" :value="gender" v-model="venueForm.genders" class="appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-500 rounded-md checked:bg-brand-500 checked:border-brand-500 transition-colors cursor-pointer peer">
                                                        <svg class="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                    <span class="font-bold text-sm transition-colors" :class="venueForm.genders.includes(gender) ? 'text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'">{{ gender }}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Step 4: Academy -->
                                    <div v-else-if="registerStep === 4" key="step4" class="space-y-6">
                                        <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                            <span class="w-1.5 h-6 bg-brand-500 rounded-full"></span> آکادمی ورزشی (اختیاری)
                                        </h4>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">در صورتی که مجموعه شما دارای دوره‌های آموزشی و آکادمی است، روزها و ساعات آن را مشخص کنید تا در این زمان‌ها امکان رزرو عادی غیرفعال شود.</p>

                                        <div class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                                            <div class="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                                <h5 class="text-sm font-bold text-slate-700 dark:text-slate-300">فعال‌سازی بخش آکادمی</h5>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" v-model="venueForm.academy.isActive" class="sr-only peer">
                                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-500"></div>
                                                </label>
                                            </div>

                                            <transition name="fade-slide">
                                                <div v-if="venueForm.academy.isActive" class="space-y-6">
                                                    <div>
                                                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">روزهای برگزاری آکادمی</label>
                                                        <div class="flex flex-wrap gap-3">
                                                            <label v-for="day in weekdays" :key="'acad-'+day" class="cursor-pointer group">
                                                                <input type="checkbox" :value="day" v-model="venueForm.academy.days" class="hidden">
                                                                <div class="px-4 py-2.5 rounded-xl border-2 transition-all duration-300 font-bold text-sm select-none"
                                                                     :class="venueForm.academy.days.includes(day) ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-brand-300'">
                                                                    {{ day }}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div class="relative" :class="{'z-50': activeTimeDropdown === 'acadStart'}" @blur="activeTimeDropdown = ''" tabindex="0">
                                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ساعت شروع آکادمی</label>
                                                            <div @click="activeTimeDropdown = activeTimeDropdown === 'acadStart' ? '' : 'acadStart'" 
                                                                 class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all shadow-sm font-medium"
                                                                 :class="{'border-brand-500 ring-2 ring-brand-500/20': activeTimeDropdown === 'acadStart'}">
                                                                <span class="dir-ltr">{{ venueForm.academy.startTime || 'انتخاب ساعت...' }}</span>
                                                                <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeTimeDropdown === 'acadStart'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </div>
                                                            <transition name="dropdown">
                                                                <div v-if="activeTimeDropdown === 'acadStart'" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                                    <div v-for="t in timeOptions" :key="'as'+t" 
                                                                         @click.stop="venueForm.academy.startTime = t; activeTimeDropdown = ''" 
                                                                         class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors text-left dir-ltr flex items-center justify-between group">
                                                                        {{ t }}
                                                                        <svg v-if="venueForm.academy.startTime === t" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                                    </div>
                                                                </div>
                                                            </transition>
                                                        </div>
                                                        <div class="relative" :class="{'z-50': activeTimeDropdown === 'acadEnd'}" @blur="activeTimeDropdown = ''" tabindex="0">
                                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ساعت پایان آکادمی</label>
                                                            <div @click="activeTimeDropdown = activeTimeDropdown === 'acadEnd' ? '' : 'acadEnd'" 
                                                                 class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all shadow-sm font-medium"
                                                                 :class="{'border-brand-500 ring-2 ring-brand-500/20': activeTimeDropdown === 'acadEnd'}">
                                                                <span class="dir-ltr">{{ venueForm.academy.endTime || 'انتخاب ساعت...' }}</span>
                                                                <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': activeTimeDropdown === 'acadEnd'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </div>
                                                            <transition name="dropdown">
                                                                <div v-if="activeTimeDropdown === 'acadEnd'" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                                    <div v-for="t in timeOptions" :key="'ae'+t" 
                                                                         @click.stop="venueForm.academy.endTime = t; activeTimeDropdown = ''" 
                                                                         class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors text-left dir-ltr flex items-center justify-between group">
                                                                        {{ t }}
                                                                        <svg v-if="venueForm.academy.endTime === t" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                                    </div>
                                                                </div>
                                                            </transition>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>

                                    <!-- Step 5: Location -->
                                    <div v-else-if="registerStep === 5" key="step5" class="space-y-6">
                                        <h4 class="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                            <span class="w-1.5 h-6 bg-brand-500 rounded-full"></span> موقعیت جغرافیایی سالن
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <!-- Custom Select Province -->
                                            <div class="relative" @blur="isRegProvinceOpen = false" tabindex="0">
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">استان <span class="text-red-500">*</span></label>
                                                <div @click="isRegProvinceOpen = !isRegProvinceOpen" 
                                                     class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all shadow-sm font-medium"
                                                     :class="{'border-brand-500 ring-2 ring-brand-500/20': isRegProvinceOpen}">
                                                    <span>{{ venueForm.province || 'استان خود را انتخاب کنید...' }}</span>
                                                    <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': isRegProvinceOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                <transition name="dropdown">
                                                    <div v-if="isRegProvinceOpen" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                        <div v-for="prov in regProvinces" :key="prov" 
                                                             @click.stop="selectRegProvince(prov)" 
                                                             class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center justify-between group">
                                                            {{ prov }}
                                                            <svg v-if="venueForm.province === prov" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                            <span v-else class="w-2 h-2 rounded-full bg-transparent group-hover:bg-brand-500/30 transition-colors"></span>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>

                                            <!-- Custom Select City -->
                                            <div class="relative" @blur="isRegCityOpen = false" tabindex="0">
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">شهر <span class="text-red-500">*</span></label>
                                                <div @click="venueForm.province ? (isRegCityOpen = !isRegCityOpen) : addNotification('اطلاعیه', 'ابتدا استان را انتخاب کنید', 'info')" 
                                                     class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-brand-500 transition-all shadow-sm font-medium"
                                                     :class="{'border-brand-500 ring-2 ring-brand-500/20': isRegCityOpen, 'opacity-70': !venueForm.province}">
                                                    <span>{{ venueForm.city || 'شهر خود را انتخاب کنید...' }}</span>
                                                    <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180 text-brand-500': isRegCityOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                                <transition name="dropdown">
                                                    <div v-if="isRegCityOpen && venueForm.province" class="absolute left-0 right-0 mt-2 glass-panel bg-white/95 dark:bg-dark-card/95 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2 max-h-48 overflow-y-auto">
                                                        <div v-for="c in regCities" :key="c" 
                                                             @click.stop="selectRegCity(c)" 
                                                             class="px-5 py-3 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center justify-between group">
                                                            {{ c }}
                                                            <svg v-if="venueForm.city === c" class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                            <span v-else class="w-2 h-2 rounded-full bg-transparent group-hover:bg-brand-500/30 transition-colors"></span>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>

                                            <div class="md:col-span-2">
                                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">آدرس دقیق پستی <span class="text-red-500">*</span></label>
                                                <textarea v-model="venueForm.address" rows="2" class="w-full bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-5 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm font-medium" placeholder="نام محله، خیابان اصلی، کوچه فرعی، پلاک، نام مجتمع..."></textarea>
                                            </div>
                                        </div>
                                        
                                        <!-- Interactive Map Area -->
                                        <div>
                                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                                                <span>تعیین لوکیشن روی نقشه <span class="text-red-500">*</span></span>
                                            </label>
                                            <div @click="handleMapClick" class="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer border-2 border-slate-300 dark:border-slate-600 hover:border-brand-400 transition-colors shadow-sm">
                                                <!-- Map Pattern Background -->
                                                <div class="absolute inset-0 opacity-40 dark:opacity-20" style="background-image: url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.8\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E'); background-size: 30px 30px;"></div>
                                                
                                                <!-- Instruction Text (Hide if marker exists) -->
                                                <div v-if="!venueForm.mapCoordinates" class="absolute inset-0 flex items-center justify-center flex-col bg-white/60 dark:bg-black/60 backdrop-blur-[3px] transition-all group-hover:backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-black/70 pointer-events-none">
                                                    <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-3 transform group-hover:-translate-y-2 transition-transform duration-300">
                                                        <svg class="w-8 h-8 text-brand-600 dark:text-brand-400 animate-bounce mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    </div>
                                                    <span class="text-sm font-black text-slate-800 dark:text-white bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-white/10">برای ثبت دقیق موقعیت روی نقشه کلیک کنید</span>
                                                </div>

                                                <!-- The Marker -->
                                                <div v-if="venueForm.mapCoordinates" class="absolute pointer-events-none drop-shadow-xl" 
                                                     :style="{ left: venueForm.mapCoordinates.percentX + '%', top: venueForm.mapCoordinates.percentY + '%', transform: 'translate(-50%, -100%)' }">
                                                    <svg class="w-10 h-10 text-brand-600" viewBox="0 0 24 24" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Step 6: Uploads -->
                                    <div v-else-if="registerStep === 6" key="step6" class="space-y-8">
                                        <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                            <span class="w-1.5 h-6 bg-brand-500 rounded-full"></span> احراز هویت و تصاویر سالن
                                        </h4>
                                        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">بارگذاری مدارک و عکس‌های با کیفیت، روند تایید سالن شما را تسریع می‌بخشد.</p>

                                        <!-- Venue Photos (Real Logic) -->
                                        <div class="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                                            <div class="flex items-center justify-between mb-2">
                                                <h5 class="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                    <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    گالری تصاویر مجموعه <span class="text-red-500">*</span>
                                                </h5>
                                                <span class="text-xs font-bold text-slate-500">{{ venueForm.venuePhotos.length }} / 4 تصویر</span>
                                            </div>
                                            <p class="text-xs text-slate-500 dark:text-slate-400 mb-5">تصاویری واضح از محیط بازی، رختکن، ورودی سالن و امکانات ارسال کنید.</p>
                                            
                                            <!-- Hidden File Input for Venue Photos -->
                                            <input type="file" ref="photoInputRef" @change="handlePhotoUpload" multiple accept="image/*" class="hidden">
                                            
                                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <!-- Image Previews -->
                                                <div v-for="photo in venueForm.venuePhotos" :key="photo.id" class="aspect-[4/3] rounded-xl border-2 border-slate-300 dark:border-slate-600 overflow-hidden relative group bg-white shadow-sm">
                                                    <img :src="photo.url" class="w-full h-full object-cover" />
                                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button @click="removePhoto(photo.id)" class="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg transform scale-0 group-hover:scale-100 duration-300">
                                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <!-- Upload Trigger -->
                                                <div v-if="venueForm.venuePhotos.length < 4" @click="triggerPhotoUpload" class="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-dark-bg/50 hover:bg-slate-100 dark:hover:bg-dark-card hover:border-brand-400 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden">
                                                    <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                        <svg class="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                    </div>
                                                    <span class="text-xs font-bold text-slate-500 group-hover:text-brand-600 transition-colors">افزودن تصویر</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Documents (Real logic) -->
                                        <div class="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm">
                                            <div class="flex items-center justify-between mb-2">
                                                <h5 class="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                    سند مالکیت / اجاره‌نامه معتبر <span class="text-red-500">*</span>
                                                </h5>
                                                <span class="text-xs font-bold text-amber-600">{{ venueForm.documents.length }} / 5 تصویر</span>
                                            </div>
                                            <p class="text-xs text-amber-600/80 dark:text-amber-500/80 mb-5">این مدارک جهت بررسی دریافت شده و محرمانه باقی می‌ماند (حداکثر ۵ تصویر انتخاب کنید).</p>
                                            
                                            <!-- Hidden File Input for Documents -->
                                            <input type="file" ref="fileInputRef" @change="handleDocUpload" multiple accept="image/*" class="hidden">
                                            
                                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <!-- Image Previews -->
                                                <div v-for="doc in venueForm.documents" :key="doc.id" class="aspect-square rounded-xl border-2 border-amber-300 dark:border-amber-500/50 overflow-hidden relative group bg-white shadow-sm">
                                                    <img :src="doc.url" class="w-full h-full object-cover" />
                                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button @click="removeDoc(doc.id)" class="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg transform scale-0 group-hover:scale-100 duration-300">
                                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <!-- Upload Trigger Button -->
                                                <div v-if="venueForm.documents.length < 5" @click="triggerDocUpload" class="aspect-square rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-500/50 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-amber-500/10 flex flex-col items-center justify-center cursor-pointer transition-all group">
                                                    <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                    </div>
                                                    <span class="text-xs font-bold text-amber-700 dark:text-amber-400">افزودن فایل</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>

                            <!-- Footer Actions for Wizard -->
                            <div class="mt-8 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10 relative z-10">
                                <button @click="prevRegisterStep" 
                                        :class="registerStep === 1 ? 'invisible' : 'visible'"
                                        class="px-5 md:px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-bold transition-all flex items-center gap-2 hover:-translate-x-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                    <span class="hidden sm:inline">مرحله قبل</span>
                                </button>

                                <button v-if="registerStep < 6" @click="nextRegisterStep" 
                                        class="px-6 md:px-8 py-3.5 rounded-xl bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 font-black shadow-lg shadow-slate-800/20 dark:shadow-white/20 transition-all flex items-center gap-2 hover:translate-x-1">
                                    <span class="hidden sm:inline">ادامه به مرحله بعد</span>
                                    <span class="sm:hidden">مرحله بعد</span>
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                
                                <button v-else @click="submitVenueRegistration" 
                                        class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-black shadow-glow transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 text-base md:text-lg">
                                    <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    ثبت نهایی سالن
                                </button>
                            </div>
                        </div>

                    </transition>
                </main>
            </div>
            
            <!-- Modal Charge Wallet (New) -->
            <transition name="fade-slide">
                <div v-if="showChargeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="showChargeModal = false"></div>
                    <div class="relative bg-white dark:bg-dark-card w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-slate-200 dark:border-white/10 animate-fade-up">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-black text-slate-800 dark:text-white">افزایش موجودی کیف پول</h3>
                            <button @click="showChargeModal = false" class="text-slate-400 hover:text-red-500 transition-colors bg-slate-100 hover:bg-red-50 dark:bg-dark-bg dark:hover:bg-red-500/10 p-2 rounded-full">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">انتخاب سریع مبلغ (تومان)</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button v-for="amount in predefinedAmounts" :key="amount"
                                            @click="selectAmount(amount)"
                                            :class="selectedAmount === amount ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/30' : 'bg-slate-50 dark:bg-dark-bg text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-brand-400'"
                                            class="py-3.5 rounded-xl border-2 font-bold transition-all duration-300">
                                        {{ amount }}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">مبلغ دلخواه (تومان)</label>
                                <input v-model="customAmount" type="text" @focus="selectedAmount = ''" class="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl px-4 py-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-center dir-ltr font-bold text-lg" placeholder="مثلاً ۱۵۰,۰۰۰">
                            </div>
                            <button @click="handleChargeWallet" class="w-full bg-gradient-to-r from-brand-400 to-cyan-500 hover:from-brand-500 hover:to-cyan-600 text-white font-black py-4 rounded-xl shadow-glow transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-lg">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                                پرداخت و شارژ حساب
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
            
        </div>
    `
};