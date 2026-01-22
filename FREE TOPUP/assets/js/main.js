import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createApp, ref, onMounted, nextTick } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 🔥 আপনার ফায়ারবেস কনফিগারেশন (আপনার দেওয়া তথ্য অনুযায়ী)
const firebaseConfig = {
  apiKey: "AIzaSyACUK207BRvtR5yc1UhYLS9FlMitVVlrrE",
  authDomain: "freetopup-fd263.firebaseapp.com",
  projectId: "freetopup-fd263",
  storageBucket: "freetopup-fd263.firebasestorage.app",
  messagingSenderId: "756173302110",
  appId: "1:756173302110:web:14227664f6b5d14d9047cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

createApp({
    setup() {
        const loading = ref(true);
        const noticeMessage = ref("নোটিশ লোড হচ্ছে...");
        
        // সব অ্যারে প্রথমে ফাঁকা রাখা হয়েছে (যেন র‍্যান্ডম ডাটা না আসে)
        const banners = ref([]);
        const mysteryBoxes = ref([]);
        const specialOffers = ref([]);
        const freeFireItems = ref([]);
        const ingameItems = ref([]);
        const subscriptions = ref([]);
        
        // এটি স্ট্যাটিক রাখা হলো সৌন্দর্যের জন্য, চাইলে এটিও ডাটাবেস থেকে আনা যাবে
        const latestOrders = ref([
            { id: 1, name: 'Md Solim', avatar: 'MS', bgColor: 'bg-purple-500', item: '115 Diamonds', time: '1 min ago', verified: true },
            { id: 2, name: 'Rakibul', avatar: 'R', bgColor: 'bg-orange-500', item: 'Weekly Plus', time: '3 min ago', verified: true }
        ]);

        const fetchData = async () => {
            try {
                console.log("Fetching data from Firebase...");

                // ১. নোটিশ আনা
                const settingsSnap = await getDocs(collection(db, "settings"));
                settingsSnap.forEach((doc) => {
                    if (doc.id === "notice") noticeMessage.value = doc.data().text;
                });

                // ২. ব্যানার আনা
                const bannerSnap = await getDocs(collection(db, "banners"));
                banners.value = bannerSnap.docs.map(doc => doc.data().image);

                // ৩. প্রোডাক্টস আনা
                const productsSnap = await getDocs(collection(db, "products"));
                
                // আগের সব ডাটা ক্লিয়ার করা হচ্ছে (ডুপ্লিকেট এড়াতে)
                mysteryBoxes.value = [];
                specialOffers.value = [];
                freeFireItems.value = [];
                ingameItems.value = [];
                subscriptions.value = [];

                productsSnap.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    
                    // ক্যাটাগরি ম্যাচিং (খুব সাবধানে চেক করুন)
                    if (item.category === 'mystery') mysteryBoxes.value.push(item);
                    else if (item.category === 'special') specialOffers.value.push(item);
                    else if (item.category === 'freefire') freeFireItems.value.push(item);
                    else if (item.category === 'ingame') ingameItems.value.push(item);
                    else if (item.category === 'subscription') subscriptions.value.push(item);
                });

                console.log("Data loaded successfully!");
                loading.value = false;

                // স্লাইডার চালু করা (ডাটা আসার পর)
                await nextTick();
                new Swiper(".mySwiper", {
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    pagination: { el: ".swiper-pagination", clickable: true },
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                noticeMessage.value = "ডাটা লোড হতে সমস্যা হচ্ছে।";
            }
        };

        // ব্রোকেন ইমেজ হ্যান্ডলার (যদি ইমেজ লিংক ভুল থাকে তবে ডিফল্ট ছবি দেখাবে)
        const handleImageError = (event) => {
            event.target.src = "https://placehold.co/400x400?text=No+Image";
        };

        onMounted(() => {
            fetchData();
        });

        return {
            loading, noticeMessage, banners,
            mysteryBoxes, specialOffers, freeFireItems, ingameItems, subscriptions,
            latestOrders, handleImageError
        };
    }
}).mount('#app');