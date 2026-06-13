const { reactive } = window.Vue;

export const store = reactive({
    currentView: 'home', // 'home' | 'results' | 'auth'
    isDark: true,
    isMobileMenuOpen: false,
    showNotifications: false,
    notificationHistory: [],
    unreadNotifications: 0,
    activeDropdown: null,
    toasts: [],
    bookingModal: {
        show: false,
        venue: {},
        slot: null
    },
    filters: {
        city: 'قم',
        type: 'سالن فوتسال',
        day: 'شنبه',
        time: 'عصر (۱۴ تا ۱۸)'
    },
    options: {
        city: ['قم', 'تهران', 'کرج'],
        type: ['سالن فوتسال', 'چمن مصنوعی', 'سالن والیبال'],
        day: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
        time: ['صبح (۸ تا ۱۲)', 'عصر (۱۴ تا ۱۸)', 'شب (۱۸ تا ۲۴)']
    },
    popularVenues: [
        {
            name: 'سالن ورزشی کاظمی',
            city: 'قم',
            price: '600,000',
            gender: 'بانوان',
            rating: '5.0',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
            timeSlot: '15:00 تا 16:30'
        },
        {
            name: 'سالن جوادالائمه',
            city: 'قم',
            price: '500,000',
            gender: 'آقایان و بانوان',
            rating: '4.2',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop',
            timeSlot: '17:00 تا 18:30'
        },
        {
            name: 'مجموعه ورزشی هدایتی',
            city: 'قم',
            price: '450,000',
            gender: 'آقایان',
            rating: '4.5',
            image: 'https://images.unsplash.com/photo-1628751538356-0ea7dceb43a9?q=80&w=1470&auto=format&fit=crop',
            timeSlot: '19:00 تا 20:30'
        },
        {
            name: 'سالن حیدریان',
            city: 'قم',
            price: '600,000',
            gender: 'آقایان',
            rating: '5.0',
            image: 'https://images.unsplash.com/photo-1518605368461-1e9de45688ee?q=80&w=1469&auto=format&fit=crop',
            timeSlot: '20:30 تا 22:00'
        }
    ],
    allVenuesDatabase: [
        {
            name: 'سالن شهید اکبری',
            city: 'قم',
            type: 'سالن فوتسال',
            price: '400,000',
            gender: 'آقایان',
            rating: '4.8',
            timeSlot: '14:30 تا 15:00',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
            slots: [
                { date: '1404/09/04', reservable: false },
                { date: '1404/09/03', reservable: true }
            ]
        },
        {
            name: 'سالن شهید امجدی',
            city: 'قم',
            type: 'سالن فوتسال',
            price: '500,000',
            gender: 'آقایان و بانوان',
            rating: '4.9',
            timeSlot: '14:30 تا 15:00',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop',
            slots: [
                { date: '1404/09/04', reservable: true },
                { date: '1404/09/03', reservable: false }
            ]
        },
        {
            name: 'سالن چند منظوره حیدریان',
            city: 'قم',
            type: 'سالن فوتسال',
            price: '590,000',
            gender: 'آقایان',
            rating: '5.0',
            timeSlot: '14:30 تا 15:00',
            image: 'https://images.unsplash.com/photo-1518605368461-1e9de45688ee?q=80&w=1469&auto=format&fit=crop',
            slots: [
                { date: '1404/09/04', reservable: true },
                { date: '1404/09/03', reservable: true }
            ]
        },
        {
            name: 'سالن شهید رضاییان',
            city: 'قم',
            type: 'سالن والیبال',
            price: '400,000',
            gender: 'بانوان',
            rating: '4.3',
            timeSlot: '14:30 تا 16:00',
            image: 'https://images.unsplash.com/photo-1628751538356-0ea7dceb43a9?q=80&w=1470&auto=format&fit=crop',
            slots: [
                { date: '1404/09/07', reservable: false },
                { date: '1404/09/06', reservable: true }
            ]
        },
        {
            name: 'سالن معلم',
            city: 'قم',
            type: 'چمن مصنوعی',
            price: '500,000',
            gender: 'آقایان',
            rating: '4.6',
            timeSlot: '14:30 تا 16:00',
            image: 'https://images.unsplash.com/photo-1518605368461-1e9de45688ee?q=80&w=1469&auto=format&fit=crop',
            slots: [
                { date: '1404/09/06', reservable: true },
                { date: '1404/09/05', reservable: false }
            ]
        },
        {
            name: 'سالن فتاحی',
            city: 'قم',
            type: 'سالن والیبال',
            price: '330,000',
            gender: 'آقایان و بانوان',
            rating: '4.1',
            timeSlot: '14:30 تا 16:00',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop',
            slots: [
                { date: '1404/09/05', reservable: true },
                { date: '1404/09/04', reservable: false }
            ]
        },
        {
            name: 'سالن سردار سلیمانی',
            city: 'تهران',
            type: 'سالن فوتسال',
            price: '750,000',
            gender: 'آقایان',
            rating: '4.9',
            timeSlot: '18:00 تا 19:30',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
            slots: [
                { date: '1404/09/03', reservable: true },
                { date: '1404/09/02', reservable: true }
            ]
        },
        {
            name: 'کمپلکس آزادی',
            city: 'تهران',
            type: 'چمن مصنوعی',
            price: '900,000',
            gender: 'آقایان و بانوان',
            rating: '5.0',
            timeSlot: '20:00 تا 21:30',
            image: 'https://images.unsplash.com/photo-1518605368461-1e9de45688ee?q=80&w=1469&auto=format&fit=crop',
            slots: [
                { date: '1404/09/04', reservable: true },
                { date: '1404/09/03', reservable: false }
            ]
        }
    ],
    filteredVenues: []
});

export const toggleTheme = () => {
    store.isDark = !store.isDark;
    if (store.isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export const toggleNotifications = () => {
    store.showNotifications = !store.showNotifications;
    if (store.showNotifications) {
        store.unreadNotifications = 0;
    }
};

export const addNotification = (title, message, type = 'success') => {
    const id = Date.now();
    const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const notif = { id, title, message, type, time, read: false };
    
    store.toasts.push(notif);
    store.notificationHistory.unshift(notif);
    
    if (!store.showNotifications) {
        store.unreadNotifications++;
    }

    setTimeout(() => {
        store.toasts = store.toasts.filter(t => t.id !== id);
    }, 5000);
};

export const toggleDropdown = (key) => {
    if (store.activeDropdown === key) {
        store.activeDropdown = null;
    } else {
        store.activeDropdown = key;
    }
};

export const selectOption = (key, val) => {
    store.filters[key] = val;
    store.activeDropdown = null;
};

export const closeAllDropdowns = () => {
    store.activeDropdown = null;
    store.showNotifications = false;
};

export const applyFilters = () => {
    store.filteredVenues = store.allVenuesDatabase.filter(venue => {
        const matchCity = venue.city === store.filters.city;
        const matchType = venue.type.includes(store.filters.type) || store.filters.type.includes(venue.type);
        return matchCity && matchType;
    });
};

export const resetFilters = () => {
    store.filters = {
        city: 'قم',
        type: 'سالن فوتسال',
        day: 'شنبه',
        time: 'عصر (۱۴ تا ۱۸)'
    };
    applyFilters();
};

export const navigateToResults = () => {
    applyFilters();
    store.currentView = 'results';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const handleSlotBooking = (venue, slot) => {
    store.bookingModal = {
        show: true,
        venue: venue,
        slot: slot
    };
};

export const openQuickBook = (venue) => {
    store.bookingModal = {
        show: true,
        venue: venue,
        slot: { date: 'رزرو اولین سانس خالی فعال', reservable: true }
    };
};

export const closeBookingModal = () => {
    store.bookingModal.show = false;
};

export const confirmBooking = () => {
    const date = store.bookingModal.slot?.date || '';
    addNotification(
        'رزرو با موفقیت انجام شد! 🎉',
        `سالن "${store.bookingModal.venue.name}" برای تاریخ ${date} ثبت گردید.`
    );
    closeBookingModal();
};