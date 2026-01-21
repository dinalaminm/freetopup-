import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createApp, ref, onMounted, nextTick } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 🔥 আপনার ফায়ারবেস কনফিগারেশন নিচে বসান
const firebaseConfig = {
            apiKey: "AIzaSyD-.......", 
            authDomain: "offer-topup-....firebaseapp.com",
            projectId: "offer-topup-....",
            storageBucket: "offer-topup-....appspot.com",
            messagingSenderId: ".......",
            appId: "......."
        };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

createApp({
    setup() {
        const loading = ref(true);
        const noticeMessage = ref("নোটিশ লোড হচ্ছে...");
        
        // Data Arrays
        const banners = ref([]);
        const mysteryBoxes = ref([]);
        const specialOffers = ref([]);
        const freeFireItems = ref([]);
        const ingameItems = ref([]);
        const subscriptions = ref([]);
        
        const latestOrders = ref([
            { id: 1, name: 'Md Solim', avatar: 'MS', bgColor: 'bg-purple-500', item: '115 Diamonds', time: '1 min ago', verified: true },
            { id: 2, name: 'Rakibul', avatar: 'R', bgColor: 'bg-orange-500', item: 'Weekly Plus', time: '3 min ago', verified: true }
        ]);

        // 🔥 অটোমেটিক ডাটা আপলোড ফাংশন (যদি ডাটাবেস খালি থাকে)
        const seedDatabase = async () => {
            console.log("Seeding Database...");
            
            const demoProducts = [
                // Mystery Box
                { name: 'MYSTERY BOX- 1', image: 'https://i.pinimg.com/736x/8f/c9/b3/8fc9b38029373972a9e223c34a26e792.jpg', category: 'mystery', price: 50 },
                { name: 'MYSTERY BOX- 2', image: 'https://i.pinimg.com/736x/2c/3e/26/2c3e26463999e4367964720993077732.jpg', category: 'mystery', price: 100 },
                
                // Special Offer
                { name: 'Weekly Offer', image: 'https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHIfHbF9TAT51mgHm', category: 'special', price: 150 },
                { name: 'Level Up Pass', image: 'https://wallpapers.com/images/hd/garena-free-fire-loading-screen-w7883997.jpg', category: 'special', price: 190 },

                // Free Fire
                { name: 'Free Fire ID', image: 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png', category: 'freefire', price: 0 },
                { name: 'Weekly', image: 'https://cdn-icons-png.flaticon.com/512/744/744922.png', category: 'freefire', price: 160 },
                { name: 'Level Up', image: 'https://cdn-icons-png.flaticon.com/512/5278/5278658.png', category: 'freefire', price: 190 },
                { name: 'Airdrop', image: 'https://cdn-icons-png.flaticon.com/512/1170/1170611.png', category: 'freefire', price: 90 },
                { name: 'Monthly', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', category: 'freefire', price: 800 },
                { name: 'Promo', image: 'https://cdn-icons-png.flaticon.com/512/879/879859.png', category: 'freefire', price: 100 },

                // Ingame
                { name: 'Free Fire', image: 'https://wallpapers.com/images/hd/free-fire-max-pictures-bj37292209307222.jpg', category: 'ingame', price: 0 },
                { name: 'Clash of Clans', image: 'https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHIfHbF9TAT51mgHm', category: 'ingame', price: 0 },
                { name: 'Call of Duty', image: 'https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_CallofDutyWarzone20_ActivisionPublishingInc_S2_1200x1600-51c074d280b2c525d8e7472c2d667201', category: 'ingame', price: 0 },

                // Subscription
                { name: 'Netflix', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', category: 'subscription', price: 300 },
                { name: 'Spotify', image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', category: 'subscription', price: 100 },
                { name: 'Canva', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg', category: 'subscription', price: 50 },
            ];

            const demoBanners = [
                { image: 'https://wallpapers.com/images/hd/free-fire-max-pictures-bj37292209307222.jpg' },
                { image: 'https://wallpapers.com/images/hd/pubg-mobile-4k-winner-poster-b77879207823.jpg' }
            ];

            // ডাটা আপলোড লুপ
            for (const p of demoProducts) await addDoc(collection(db, "products"), p);
            for (const b of demoBanners) await addDoc(collection(db, "banners"), b);
            
            alert("অটোমেটিক ডাটা আপলোড সম্পন্ন হয়েছে! পেজটি রিফ্রেশ হবে।");
            location.reload();
        };

        const fetchData = async () => {
            try {
                // ১. নোটিশ
                noticeMessage.value = "আসসালামু আলাইকুম। আমাদের সাইটে বিকাশ, নগদ এবং রকেটের মাধ্যমে পেমেন্ট করতে পারবেন।";

                // ২. প্রোডাক্ট
                const productsSnap = await getDocs(collection(db, "products"));
                
                // যদি ডাটাবেস খালি থাকে, তবে অটোমেটিক ডাটা আপলোড হবে
                if (productsSnap.empty) {
                    await seedDatabase();
                    return;
                }

                productsSnap.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    if (item.category === 'mystery') mysteryBoxes.value.push(item);
                    else if (item.category === 'special') specialOffers.value.push(item);
                    else if (item.category === 'freefire') freeFireItems.value.push(item);
                    else if (item.category === 'ingame') ingameItems.value.push(item);
                    else if (item.category === 'subscription') subscriptions.value.push(item);
                });

                // ৩. ব্যানার
                const bannerSnap = await getDocs(collection(db, "banners"));
                banners.value = bannerSnap.docs.map(doc => doc.data().image);

                loading.value = false;

                // স্লাইডার চালু করা
                await nextTick();
                new Swiper(".mySwiper", {
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    pagination: { el: ".swiper-pagination", clickable: true },
                });

            } catch (error) {
                console.error("Error:", error);
                noticeMessage.value = "ডাটা লোড সমস্যা! (চেক কনসোল)";
            }
        };

        onMounted(() => {
            fetchData();
        });

        return {
            loading, noticeMessage, banners,
            mysteryBoxes, specialOffers, freeFireItems, ingameItems, subscriptions,
            latestOrders
        };
    }
}).mount('#app');